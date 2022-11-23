import { User } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { userWithoutPassword, userWithRole } from '../../utils'

type ParticipantsProps = Omit<User, 'password'>[] & {
	role?: string
}

const get = async ({ request, reply }: RouterProps) => {
	const roomIdParams = z.object({
		roomId: z.string()
	})

	const participants: ParticipantsProps = []

	try {
		const { roomId } = roomIdParams.parse(request.params)

		if (!roomId) {
			return reply.status(400).send(new Error('roomId is required!'))
		}

		const participantsData = await prisma.participant.findMany({
			where: {
				roomId
			}
		})

		if (!participantsData) {
			return reply.status(400).send(new Error('Participants not found!'))
		}

		for (const participant of participantsData) {
			const userRole = await prisma.role.findFirst({
				where: {
					ownerId: participant.userId
				}
			})

			const userFromDB = await prisma.user.findFirst({
				where: {
					id: participant.userId
				}
			})

			if (!userFromDB) {
				return reply.status(400).send(new Error('User not found!'))
			}

			const user = userWithoutPassword(userFromDB)

			if (userRole) {
				participants.push(userWithRole(userRole.title, user))
			} else {
				participants.push(user)
			}
		}

		return reply.status(200).send(participants)
	} catch (error) {
		console.log(error)
		throw new Error('Error on get participants!')
	}
}

export { get }
