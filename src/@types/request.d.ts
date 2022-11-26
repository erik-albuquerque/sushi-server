import { UserDecodedToken } from '../types'

declare module 'fastify' {
	interface FastifyRequest {
		user: UserDecodedToken
	}
}
