import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'

const onDelete = async ({ request, reply }: RouterProps) => {
	const trackIdParams = z.object({
		trackId: z.string()
	})
	try {
		const { trackId } = trackIdParams.parse(request.params)

		if (!trackId) {
			return reply.status(400).send(new Error('trackId is required!'))
		}

		await prisma.track.delete({
			where: {
				id: trackId
			}
		})

		return reply.status(202).send()
	} catch (error) {
		console.log(error)
		throw new Error('Error on delete track!')
	}
}

export { onDelete }
