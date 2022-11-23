import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { RouterProps } from '../../types'

const onDelete = async ({ request, reply }: RouterProps) => {
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

		await prisma.user.delete({
			where: {
				id: userId
			}
		})

		return reply.status(202).send()
	} catch (error) {
		console.log(error)
		throw new Error('Error on delete user!')
	}
}

export { onDelete }
