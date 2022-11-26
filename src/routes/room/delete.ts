import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'

const onDelete = async ({ request, reply }: RouterProps) => {
	const roomIdParams = z.object({
		roomId: z.string()
	})

	try {
		const { roomId } = roomIdParams.parse(request.params)
		const userId = request.user.id

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

		if (!(roomExists.ownerId === userId)) {
			return reply
				.status(401)
				.send(new Error(`Unauthorized! You don't seem to be the owner!`))
		}

		const userRole = await prisma.role.findFirst({
			where: {
				ownerId: roomExists.ownerId
			}
		})

		if (userRole) {
			await prisma.role.delete({
				where: {
					id: userRole.id
				}
			})
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
