import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { userWithoutPassword, userWithRole } from '../../utils'

const get = async ({ request, reply }: RouterProps) => {
	const roomIdParams = z.object({
		roomId: z.string()
	})

	const participants = []

	try {
		const { roomId } = roomIdParams.parse(request.params)

		if (!roomId) {
			return reply.status(400).send(new Error('roomId is required!'))
		}

		const roomData = await prisma.room.findUnique({
			where: {
				id: roomId
			}
		})

		if (!roomData) {
			return reply.status(400).send(new Error('Room not found!'))
		}

		const queue = await prisma.queue.findFirst({
			where: {
				roomId
			}
		})

		const tracks = await prisma.track.findMany({
			where: {
				queueId: queue?.id
			}
		})

		const ownerData = await prisma.user.findUnique({
			where: {
				id: roomData.ownerId
			}
		})

		if (!ownerData) {
			return reply.status(400).send(new Error('Unexpected error!'))
		}

		const owner = userWithoutPassword(ownerData)

		const usersData = await prisma.user.findMany({
			where: {
				participatingAt: {
					some: {
						roomId: roomData.id
					}
				}
			}
		})

		for (const user of usersData) {
			const userRole = await prisma.role.findFirst({
				where: {
					ownerId: user.id
				}
			})

			const participant = userWithoutPassword(user)

			if (userRole) {
				participants.push(userWithRole(userRole.title, participant))
			} else {
				participants.push(participant)
			}
		}

		const room = {
			...roomData,
			owner,
			participants,
			queue,
			tracks
		}

		return reply.status(200).send({ room })
	} catch (error) {
		console.log(error)
		throw new Error('Error on get room!')
	}
}

export { get }
