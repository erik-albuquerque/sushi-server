import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'
import { getAll } from './getAll'

const routes = async (server: FastifyInstance) => {
	server.post(`${apiPrefix}/tracks`, (request, reply) =>
		create({ request, reply })
	)

	server.get(`${apiPrefix}/tracks`, (request, reply) =>
		getAll({ request, reply })
	)

	server.delete(`${apiPrefix}/tracks/delete/:trackId`, (request, reply) =>
		onDelete({ request, reply })
	)

	server.get(`${apiPrefix}/tracks/:trackId`, (request, reply) =>
		get({ request, reply })
	)
}

const trackRoutes = fp(routes)

export { trackRoutes }
