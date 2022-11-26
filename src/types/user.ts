import { User } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'

type UserWithoutPassword = Omit<User, 'password'>

type UserWithRole = UserWithoutPassword & {
	role: string
}

type UserDecodedToken = UserWithoutPassword & JwtPayload

export { UserWithoutPassword, UserWithRole, UserDecodedToken }
