import { User } from '@prisma/client'
import { UserWithoutPassword } from '../types'
import { exclude } from './exclude'

const userWithoutPassword = (user: User): UserWithoutPassword => {
	return exclude(user, ['password'])
}

export { userWithoutPassword }
