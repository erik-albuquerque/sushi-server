import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type GetProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const onDelete = async ({ request, reply }: GetProps) => {
	const roomIdParams = z.object({
		roomId: z.string()
	})

	try {
		const { roomId } = roomIdParams.parse(request.params)

		if (!roomId) {
			return reply.status(400).send(new Error('roomId is required!'))
		}

		const roomExists = await prisma.room.findUnique({
			where: {
				id: roomId
			}
		})

		if (!roomExists) {
			return reply.status(400).send(new Error('Room not found!'))
		}

		await prisma.room.delete({
			where: {
				id: roomId
			}
		})

		return reply.status(202).send()
	} catch (error) {
		console.log(error)
		throw new Error('Error on delete room!')
	}
}

export { onDelete }
