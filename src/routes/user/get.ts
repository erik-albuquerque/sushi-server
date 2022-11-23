import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'
import { userWithoutPassword } from '../../utils'

const get = async ({ request, reply }: RouterProps) => {
	const userIdParams = z.object({
		userId: z.string()
	})

	try {
		const { userId } = userIdParams.parse(request.params)

		if (!userId) {
			return reply.status(400).send(new Error('userId is required!'))
		}

		const userExists = await prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!userExists) {
			return reply.status(400).send(new Error('User not found!'))
		}

		const user = userWithoutPassword(userExists)

		return reply.status(200).send(user)
	} catch (error) {
		console.log(error)
		throw new Error('Error on get user!')
	}
}

export { get }
