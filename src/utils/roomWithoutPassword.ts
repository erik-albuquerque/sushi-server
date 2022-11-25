import { Room } from '@prisma/client'
import { RoomWithoutPassword } from '../types'
import { exclude } from './exclude'

const roomWithoutPassword = (room: Room): RoomWithoutPassword => {
	return exclude(room, ['password'])
}

export { roomWithoutPassword }
