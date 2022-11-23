import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { userWithoutPassword } from '../../utils'

const getAll = async ({ reply }: RouterProps) => {
	try {
		const tracksData = await prisma.track.findMany({
			include: {
				owner: true
			}
		})

		if (!tracksData) {
			return reply.status(400).send(new Error('Tracks not found!'))
		}

		const tracks = tracksData.map((track) => {
			const owner = userWithoutPassword(track.owner)

			return {
				...track,
				owner
			}
		})

		const total = tracks.length

		return reply.status(200).send({ tracks, total })
	} catch (error) {
		console.log(error)
		throw new Error('Error on get all tracks!')
	}
}

export { getAll }
