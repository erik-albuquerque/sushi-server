import { Room } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { encrypt } from '../../utils'

const create = async ({ request, reply }: RouterProps) => {
	const createRoomBody = z.object({
		title: z.string(),
		password: z.string().optional(),
		private: z.boolean()
	})

	try {
		const user = request.user

		const userId = user.id

		if (!user || !userId) {
			return reply.status(401).send(new Error('Unexpected error!'))
		}

		const {
			title,
			password,
			private: isPrivate
		} = createRoomBody.parse(request.body)

		const encryptedPassword = password
			? await encrypt({
					str: password,
					saltRounds: 10
			  })
			: null

		const roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
			title,
			password: encryptedPassword,
			private: isPrivate,
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

		await prisma.queue.create({
			data: {
				roomId: room.id
			}
		})

		return reply.status(201).send({ room })
	} catch (error) {
		console.log(error)
		throw new Error('Error on create a room!')
	}
}

export { create }
