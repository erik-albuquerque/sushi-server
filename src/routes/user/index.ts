import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils/apiPrefix'

import { create } from './create'
import { update } from './update'

const routes = async (
	server: FastifyInstance
	// options: FastifyPluginOptions
) => {
	server.post(`${apiPrefix}/users`, (request, reply) =>
		create({ request, reply })
	)

	server.patch(`${apiPrefix}/users/edit/:userId`, (request, reply) =>
		update({ request, reply })
	)
}

const userRoutes = fp(routes)

export { userRoutes }
