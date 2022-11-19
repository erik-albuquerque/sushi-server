import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
	const user = await prisma.user.create({
		data: {
			name: 'John DOe',
			email: 'johndoe@gmail.com',
			username: 'johndoe',
			// avatarUrl: '',
			password: '12345678',
			ownRoles: {
				create: {
					title: 'user.hot-roll'
				}
			}
		}
	})

	await prisma.room.create({
		data: {
			title: 'global',
			ownerId: user.id,
			trackQueue: {
				create: {
					tracks: {
						create: {
							title: 'Chamber of Reflection - Mac DeMarco (Live Cover)',
							url: 'https://www.youtube.com/watch?v=l0NjZLmkODA',
							ownerId: user.id
						}
					}
				}
			},
			participants: {
				create: {
					userId: user.id
				}
			}
		}
	})
}

main()
