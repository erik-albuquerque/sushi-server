import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'

const onDelete = async ({ request, reply }: RouterProps) => {
	const participantParams = z.object({
		userId: z.string(),
		roomId: z.string()
	})

	try {
		const { userId, roomId } = participantParams.parse(request.params)

		if (!userId || !roomId) {
			return reply.status(400).send(new Error('(userId & roomId) is required!'))
		}

		await prisma.participant.delete({
			where: {
				userId_roomId: {
					userId,
					roomId
				}
			}
		})

		return reply.status(202).send()
	} catch (error) {
		console.log(error)
		throw new Error('Error on delete participant!')
	}
}

export { onDelete }
