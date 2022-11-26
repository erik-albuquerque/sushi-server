import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { verifyToken } from '../../middlewares'
import { apiPrefix } from '../../utils/apiPrefix'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'
import { getAll } from './getAll'

const routes = async (
	server: FastifyInstance
	// options: FastifyPluginOptions
) => {
	server.get(`${apiPrefix}/rooms`, (request, reply) =>
		getAll({ request, reply })
	)

	// Router with Middleware
	server.route({
		method: 'POST',
		url: `${apiPrefix}/rooms/:userId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => create({ request, reply })
	})

	server.route({
		method: 'DELETE',
		url: `${apiPrefix}/rooms/delete/:roomId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => onDelete({ request, reply })
	})

	server.route({
		method: 'GET',
		url: `${apiPrefix}/rooms/:userId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => get({ request, reply })
	})
}

const roomRoutes = fp(routes)

export { roomRoutes }
