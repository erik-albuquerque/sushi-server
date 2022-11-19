import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type CreateProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const create = async ({ request, reply }: CreateProps): Promise<void> => {
	const createUserBody = z.object({
		name: z.string(),
		username: z.string(),
		email: z.string({}).email(),
		avatarUrl: z.string().url().optional(),
		password: z.string()
	})

	try {
		const user = createUserBody.parse(request.body)

		const [userExists, emailAlreadyRegistered, usernameAlreadyRegistered] =
			await prisma.$transaction([
				prisma.user.findUnique({
					where: {
						username_email: {
							username: user.username,
							email: user.email
						}
					}
				}),
				prisma.user.findFirst({
					where: {
						email: user.email
					}
				}),
				prisma.user.findFirst({
					where: {
						username: user.username
					}
				})
			])

		if (userExists) {
			return reply.status(409).send({ message: 'User already exist!' })
		}

		if (usernameAlreadyRegistered) {
			return reply.status(409).send({ message: 'Username already registered!' })
		}

		if (emailAlreadyRegistered) {
			return reply.status(409).send({ message: 'Email already registered!' })
		}

		await prisma.user.create({
			data: user
		})

		return reply.status(201).send({ user })
	} catch (error) {
		throw new Error('Error on create a new user!')
	}
}

export { create }
