import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { encrypt } from '../../utils'

const create = async ({ request, reply }: RouterProps): Promise<void> => {
	const createUserBody = z.object({
		name: z.string(),
		username: z.string(),
		email: z.string({}).email(),
		avatarUrl: z.string().url().optional(),
		password: z.string()
	})

	try {
		const { name, username, email, password } = createUserBody.parse(
			request.body
		)

		const encryptedPassword = await encrypt({ str: password, saltRounds: 10 })

		const user = { name, username, email, password: encryptedPassword }

		if (!name || !username || !email || !password) {
			return reply.status(400).send(new Error('All input is required!'))
		}

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
			return reply
				.status(409)
				.send(new Error('User already exist. Please login!'))
		}

		if (usernameAlreadyRegistered) {
			return reply
				.status(409)
				.send(new Error('Username already registered. Try another!'))
		}

		if (emailAlreadyRegistered) {
			return reply
				.status(409)
				.send(new Error('Email already registered. Try another!'))
		}

		await prisma.user.create({
			data: user
		})

		return reply.status(201).send({ user })
	} catch (error) {
		console.log(error)
		throw new Error('Error on create user!')
	}
}

export { create }
