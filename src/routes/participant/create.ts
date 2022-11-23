import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type CreateProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const create = async ({ request, reply }: CreateProps) => {
	const requestParams = z.object({
		roomId: z.string(),
		userId: z.string()
	})

	try {
		const { userId, roomId } = requestParams.parse(request.params)

		if (!roomId) {
			return reply.status(400).send(new Error('roomId is required!'))
		}

		if (!userId) {
			return reply.status(400).send(new Error('userId is required!'))
		}

		const participantExists = await prisma.participant.findUnique({
			where: {
				userId_roomId: {
					userId,
					roomId
				}
			}
		})

		if (participantExists) {
			return reply.status(409).send(new Error('you already belong here!'))
		}

		const participant = await prisma.participant.create({
			data: {
				roomId,
				userId
			}
		})

		return reply.status(201).send(participant)
	} catch (error) {
		console.log(error)
		throw new Error('Erro on create participant!')
	}
}

export { create }
