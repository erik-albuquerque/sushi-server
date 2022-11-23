import { prisma } from '../../lib/prisma'
import { RoomPropsUserWithRole, RouterProps, UserWithRole } from '../../types'
import { exclude, userWithoutPassword, userWithRole } from '../../utils'

const getAll = async ({ reply }: RouterProps) => {
	const rooms: RoomPropsUserWithRole[] = []

	try {
		const roomsData = await prisma.room.findMany({
			include: {
				participants: true,
				trackQueue: true,
				owner: true
			}
		})

		if (!roomsData) {
			return reply.status(400).send(new Error('Rooms not found!'))
		}

		for (const roomData of roomsData) {
			const ownerData = await prisma.user.findUnique({
				where: {
					id: roomData.ownerId
				}
			})

			const usersData = await prisma.user.findMany({
				where: {
					participatingAt: {
						some: {
							roomId: roomData.id
						}
					}
				}
			})

			const userRole = await prisma.role.findFirst({
				where: {
					ownerId: roomData.ownerId
				}
			})

			const participants = usersData.map((user) => {
				if (userRole) {
					return userWithRole(userRole.title, userWithoutPassword(user))
				} else {
					return user
				}
			})

			const queue = await prisma.queue.findFirst({
				where: {
					roomId: roomData.id
				}
			})

			const tracks = await prisma.track.findMany({
				where: {
					queueId: queue?.id
				}
			})

			if (!userRole) {
				continue
			}

			if (!ownerData) {
				return
			}

			const owner: UserWithRole = {
				...userWithoutPassword(ownerData),
				role: userRole.title
			}

			const room = {
				...exclude(roomData, ['trackQueue']),
				owner,
				participants,
				queue,
				tracks
			}

			rooms.push(room)
		}

		return reply.status(200).send({ rooms })
	} catch (error) {
		console.log(error)
		throw new Error('Error on get all rooms!')
	}
}

export { getAll }
