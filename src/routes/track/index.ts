import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { verifyToken } from '../../middlewares'
import { apiPrefix } from '../../utils'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'
import { getAll } from './getAll'

const routes = async (server: FastifyInstance) => {
	server.get(`${apiPrefix}/tracks`, (request, reply) =>
		getAll({ request, reply })
	)

	server.route({
		method: 'GET',
		url: `${apiPrefix}/tracks/:trackId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => get({ request, reply })
	})

	server.route({
		method: 'POST',
		url: `${apiPrefix}/tracks`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => create({ request, reply })
	})

	server.route({
		method: 'DELETE',
		url: `${apiPrefix}/tracks/delete/:trackId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => onDelete({ request, reply })
	})
}

const trackRoutes = fp(routes)

export { trackRoutes }
