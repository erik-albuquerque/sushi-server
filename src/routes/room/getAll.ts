import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'

type GetAllProps = {
	request: FastifyRequest
	reply: FastifyReply
}

const getAll = async ({ request, reply }: GetAllProps) => {
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

		const rooms = []

		for (const room of roomsData) {
			const ownerData = await prisma.user.findUnique({
				where: {
					id: room.ownerId
				}
			})

			const usersData = await prisma.user.findMany({
				where: {
					participatingAt: {
						some: {
							roomId: room.id
						}
					}
				}
			})

			const userRole = await prisma.role.findFirst({
				where: {
					ownerId: room.ownerId
				}
			})

			const users = usersData.map((user) => {
				if (user.username === ownerData?.username) {
					return {
						id: user.id,
						name: user.name,
						username: user.username,
						avatarUrl: user.avatarUrl,
						role: userRole?.title,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt
					}
				} else {
					return {
						id: user.id,
						name: user.name,
						username: user.username,
						avatarUrl: user.avatarUrl,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt
					}
				}
			})

			const queue = await prisma.queue.findFirst({
				where: {
					roomId: room.id
				}
			})

			// if (!queue) return reply.status(400).send(new Error('Queue not found!'))

			const tracks = await prisma.track.findMany({
				where: {
					queueId: queue?.id
				}
			})

			const owner = {
				id: ownerData?.id,
				name: ownerData?.name,
				username: ownerData?.username,
				avatarUrl: ownerData?.avatarUrl,
				role: userRole?.title,
				createdAt: ownerData?.createdAt,
				updatedAt: ownerData?.updatedAt
			}

			rooms.push({
				id: room.id,
				title: room.title,
				ownerId: room.ownerId,
				// password: room.password,
				createdAt: room.createdAt,
				updatedAt: room.updatedAt,
				owner,
				participants: users,
				queue,
				tracks
			})
		}

		return reply.status(200).send(rooms)
	} catch (error) {
		console.log(error)
		throw new Error('Error on get all rooms!')
	}
}

export { getAll }
