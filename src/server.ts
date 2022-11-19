import cors from '@fastify/cors'
import Fastify from 'fastify'
import { userRoutes } from './routes'

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

	fastify.register(userRoutes)

	initServer()
}

bootstrap()
