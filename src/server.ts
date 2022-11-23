import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import Fastify from 'fastify'
import { participantRoutes, roomRoutes, userRoutes } from './routes'

const fastify = Fastify({
	logger: true
})

const initServer = async () => {
	try {
		await fastify.listen({ port: 3333 })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

const bootstrap = async () => {
	await fastify.register(cors, {
		origin: true
	})

	await fastify.register(formbody)

	await fastify.register(userRoutes)

	await fastify.register(roomRoutes)

	await fastify.register(participantRoutes)

	initServer()
}

bootstrap()
