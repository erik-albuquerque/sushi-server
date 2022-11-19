import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { isObjectEmpty } from '../../utils/isObjectEmpty'

type UpdateProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const update = async ({ request, reply }: UpdateProps): Promise<void> => {
	const updateUserBody = z.object({
		name: z.string().optional(),
		username: z.string().optional(),
		email: z.string().email().optional(),
		avatarUrl: z.string().url().optional(),
		password: z.string().optional()
	})

	const userIdParams = z.object({
		userId: z.string()
	})

	try {
		const user = updateUserBody.parse(request.body)
		const { userId } = userIdParams.parse(request.params)

		if (isObjectEmpty(user)) {
			return reply
				.status(400)
				.send(new Error('You need to pass at least one field!'))
		}

		const [userExists, emailAlreadyRegistered, usernameAlreadyRegistered] =
			await prisma.$transaction([
				prisma.user.findUnique({
					where: {
						id: userId
					}
				}),
				prisma.user.findFirst({
					where: {
						email: user.email ?? ''
					}
				}),
				prisma.user.findFirst({
					where: {
						username: user.username ?? ''
					}
				})
			])

		if (!userExists) {
			return reply.status(400).send(new Error('User not found!'))
		}

		if (userExists.email === emailAlreadyRegistered?.email) {
			return reply
				.status(409)
				.send(new Error('You are already using this email!'))
		}

		if (userExists.username === usernameAlreadyRegistered?.username) {
			return reply
				.status(409)
				.send(new Error('You are already using this username!'))
		}

		if (usernameAlreadyRegistered) {
			return reply.status(409).send(new Error('Username already registered!'))
		}

		if (emailAlreadyRegistered) {
			return reply.status(409).send(new Error('Email already registered!'))
		}

		await prisma.user.update({
			data: user,
			where: {
				id: userId
			}
		})

		return reply.status(204).send()
	} catch (error) {
		throw new Error('Error on update a user!')
	}
}

export { update }
