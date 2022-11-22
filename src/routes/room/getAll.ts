import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'

type GetAllProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const getAll = async ({ request, reply }: GetAllProps) => {
	try {
		const rooms = await prisma.room.findMany()

		if (!rooms) {
			return reply.status(400).send(new Error('Rooms not found!'))
		}

		return reply.status(200).send(rooms)
	} catch (error) {
		console.log(error)
		throw new Error('Error on get all rooms!')
	}
}

export { getAll }
