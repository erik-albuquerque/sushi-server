import jwt from 'jsonwebtoken'
import { UserWithoutPassword } from '../types'
import { env } from './env'

type GenerateTokenProps = {
	userData: UserWithoutPassword
	expiresIn?: string
}

const generateToken = ({
	userData,
	expiresIn = '2h'
}: GenerateTokenProps): string => {
	const { TOKEN_KEY } = env

	const token = jwt.sign(userData, TOKEN_KEY, { expiresIn })

	return token
}

export { generateToken }
