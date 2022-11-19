import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils/apiPrefix'

import { create } from './create'

const routes = async (
	server: FastifyInstance,
	options: FastifyPluginOptions
) => {
	server.post(`${apiPrefix}/users`, (request, reply) =>
		create({ request, reply })
	)
}

const userRoutes = fp(routes)

export { userRoutes }
