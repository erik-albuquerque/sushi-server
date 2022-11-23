import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils'

import { create } from './create'
import { onDelete } from './delete'
import { get } from './get'

const routes = async (server: FastifyInstance) => {
	server.post(`${apiPrefix}/participants/:userId/:roomId`, (request, reply) =>
		create({ request, reply })
	)

	server.get(`${apiPrefix}/participants/:roomId`, (request, reply) =>
		get({ request, reply })
	)

	server.delete(
		`${apiPrefix}/participants/delete/:userId/:roomId`,
		(request, reply) => onDelete({ request, reply })
	)
}

const participantRoutes = fp(routes)

export { participantRoutes }
