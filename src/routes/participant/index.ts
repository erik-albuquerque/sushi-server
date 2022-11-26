import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { verifyToken } from '../../middlewares'
import { apiPrefix } from '../../utils'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'

const routes = async (server: FastifyInstance) => {
	// Router with Middleware
	server.route({
		method: 'GET',
		url: `${apiPrefix}/participants/:roomId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => get({ request, reply })
	})

	server.route({
		method: 'POST',
		url: `${apiPrefix}/participants/:userId/:roomId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => create({ request, reply })
	})

	server.route({
		method: 'DELETE',
		url: `${apiPrefix}/participants/delete/:userId/:roomId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => onDelete({ request, reply })
	})
}

const participantRoutes = fp(routes)

export { participantRoutes }
