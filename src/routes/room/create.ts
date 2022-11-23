import { Room } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

type CreateProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const create = async ({ request, reply }: CreateProps) => {
	const createRoomBody = z.object({
		title: z.string(),
		password: z.string().optional()
	})

	const userIdParams = z.object({
		userId: z.string()
	})

	try {
		const { userId } = userIdParams.parse(request.params)
		const { title, password } = createRoomBody.parse(request.body)

		if (!userId) {
			return reply.status(400).send(new Error('userId is required!'))
		}

		const roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
			title,
			password: password ?? null,
			ownerId: userId
		}

		await prisma.role.create({
			data: {
				title: 'user.sushiman',
				ownerId: userId
			}
		})

		const room = await prisma.room.create({
			data: {
				...roomData,
				participants: {
					create: {
						userId
					}
				}
			}
		})

		return reply.status(201).send(room)
	} catch (error) {
		console.log(error)
		throw new Error('Error on create a room!')
	}
}

export { create }
