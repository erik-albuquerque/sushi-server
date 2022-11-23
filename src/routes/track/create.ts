import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'

const create = async ({ request, reply }: RouterProps) => {
	const createTrackBody = z.object({
		title: z.string(),
		url: z.string(),
		ownerId: z.string(),
		queueId: z.string()
	})

	try {
		const trackData = createTrackBody.parse(request.body)

		if (!trackData) {
			return reply.status(400).send(new Error('Unexpected error!'))
		}

		const [userExists, queueExists] = await prisma.$transaction([
			prisma.user.findFirst({
				where: {
					id: trackData.ownerId
				}
			}),
			prisma.queue.findFirst({
				where: {
					id: trackData.queueId
				}
			})
		])

		if (!userExists) {
			return reply.status(400).send(new Error('User not found!'))
		}

		if (!queueExists) {
			return reply.status(400).send(new Error('Queue not found!'))
		}

		const track = await prisma.track.create({
			data: trackData
		})

		return reply.status(201).send({ track })
	} catch (error) {
		console.log(error)
		throw new Error('Error on create track')
	}
}

export { create }
