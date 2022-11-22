import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type GetProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const get = async ({ request, reply }: GetProps) => {
	const userIdParams = z.object({
		userId: z.string()
	})

	try {
		const { userId } = userIdParams.parse(request.params)

		if (!userId) {
			return reply.status(400).send(new Error('userId is required!'))
		}

		const userExists = await prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!userExists) {
			return reply.status(400).send(new Error('User not found!'))
		}

		return reply.status(200).send({ user: userExists })
	} catch (error) {
		console.log(error)
		throw new Error('Error on get user!')
	}
}

export { get }
