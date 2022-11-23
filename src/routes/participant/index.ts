import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { apiPrefix } from '../../utils'

import { create } from './create'

const routes = async (server: FastifyInstance) => {
	server.post(`${apiPrefix}/participants/:userId/:roomId`, (request, reply) =>
		create({ request, reply })
	)
}

const participantRoutes = fp(routes)

export { participantRoutes }
