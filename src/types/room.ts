import { Room } from '@prisma/client'
import { UserWithRole } from './user'

type RoomWithoutPassword = Omit<Room, 'password'>

type RoomPropsUserWithRole = RoomWithoutPassword & {
	owner: UserWithRole
}

export { RoomPropsUserWithRole, RoomWithoutPassword }
