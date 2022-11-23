import { Room } from '@prisma/client'
import { UserWithRole } from './user'

type RoomPropsUserWithRole = Room & {
	owner: UserWithRole
}

export { RoomPropsUserWithRole }
