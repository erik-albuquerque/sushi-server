import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { userWithoutPassword } from '../../utils'

const get = async ({ request, reply }: RouterProps) => {
	const trackIdParams = z.object({
		trackId: z.string()
	})

	try {
		const { trackId } = trackIdParams.parse(request.params)

		if (!trackId) {
			return reply.status(400).send(new Error('trackId is required!'))
		}

		const trackData = await prisma.track.findUnique({
			where: {
				id: trackId
			}
		})

		if (!trackData) {
			return reply.status(400).send(new Error('Track no found!'))
		}

		const owner = await prisma.user.findUnique({
			where: {
				id: trackData.ownerId
			}
		})

		if (!owner) {
			return reply.status(400).send(new Error('User no found!'))
		}

		const track = {
			...trackData,
			owner: userWithoutPassword(owner)
		}

		return reply.status(200).send({ track })
	} catch (error) {
		console.log(error)
		throw new Error('Error on get track!')
	}
}

export { get }
