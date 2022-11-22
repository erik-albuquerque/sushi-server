import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils/apiPrefix'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'
import { getAll } from './getAll'

const routes = async (
	server: FastifyInstance
	// options: FastifyPluginOptions
) => {
	server.post(`${apiPrefix}/rooms/:userId`, (request, reply) =>
		create({ request, reply })
	)

	server.get(`${apiPrefix}/rooms/:roomId`, (request, reply) =>
		get({ request, reply })
	)

	server.get(`${apiPrefix}/rooms`, (request, reply) =>
		getAll({ request, reply })
	)

	server.delete(`${apiPrefix}/rooms/delete/:roomId`, (request, reply) =>
		onDelete({ request, reply })
	)
}

const roomRoutes = fp(routes)

export { roomRoutes }
