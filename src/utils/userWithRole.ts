import { UserWithoutPassword } from '../types'

const userWithRole = (role: string, user: UserWithoutPassword) => {
	return {
		...user,
		role
	}
}

export { userWithRole }
