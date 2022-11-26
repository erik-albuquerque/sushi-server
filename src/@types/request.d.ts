import { UserWithoutPassword } from '../types'

declare module 'fastify' {
	interface FastifyRequest {
		user: UserWithoutPassword
	}
}
