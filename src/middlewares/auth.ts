import { HookHandlerDoneFunction } from 'fastify'
import jwt from 'jsonwebtoken'
import { RouterProps, UserWithoutPassword } from '../types'
import { env } from '../utils'

type VerifyTokenProps = RouterProps & {
	done: HookHandlerDoneFunction
}

const verifyToken = ({ request, reply, done }: VerifyTokenProps) => {
	const { TOKEN_KEY } = env

	try {
		const token = request.headers.authorization?.split(' ')[1]

		if (!token) {
			return reply.status(403).send(new Error('A token is required!'))
		}

		const decodedToken = jwt.verify(token, TOKEN_KEY)

		if (!decodedToken) {
			return reply
				.status(401)
				.send(new Error('Something is wrong with the token!'))
		}

		request.user = decodedToken as UserWithoutPassword

		request.headers.authorization = `Bearer ${token}`

		done()
	} catch (error) {
		console.log(error)
		throw new Error('Token is broken!')
	}
}

export { verifyToken }
