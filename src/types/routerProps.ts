import { FastifyReply, FastifyRequest } from 'fastify'

type RouterProps = {
	request: FastifyRequest
	reply: FastifyReply
}

export { RouterProps }
