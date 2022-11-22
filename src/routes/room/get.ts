import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type GetProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const get = async ({ request, reply }: GetProps) => {
	const roomIdParams = z.object({
		roomId: z.string()
	})

	try {
		const { roomId } = roomIdParams.parse(request.params)

		if (!roomId) {
			return reply.status(400).send(new Error('roomId is required!'))
		}

		const room = await prisma.room.findUnique({
			where: {
				id: roomId
			}
		})

		if (!room) {
			return reply.status(400).send(new Error('Room not found!'))
		}

		return reply.status(200).send(room)
	} catch (error) {
		console.log(error)
		throw new Error('Error on get room!')
	}
}

export { get }
