import { User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'password'>

type UserWithRole = UserWithoutPassword & {
	role: string
}

export { UserWithoutPassword, UserWithRole }
