import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { verifyToken } from '../../middlewares'
import { apiPrefix } from '../../utils/apiPrefix'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'
import { update } from './update'

const routes = async (
	server: FastifyInstance
	// options: FastifyPluginOptions
) => {
	server.post(`${apiPrefix}/users`, (request, reply) =>
		create({ request, reply })
	)

	// Router with Middleware
	server.route({
		method: 'GET',
		url: `${apiPrefix}/users/:userId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => get({ request, reply })
	})

	server.route({
		method: 'DELETE',
		url: `${apiPrefix}/users/delete/:userId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => onDelete({ request, reply })
	})

	server.route({
		method: 'PATCH',
		url: `${apiPrefix}/users/edit/:userId`,
		preHandler: (request, reply, done) => verifyToken({ request, reply, done }),
		handler: (request, reply) => update({ request, reply })
	})
}

const userRoutes = fp(routes)

export { userRoutes }
