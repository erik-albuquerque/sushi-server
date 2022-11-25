import { hash } from 'bcrypt'

type EncryptProps = {
	str: string
	saltRounds: number
}

const encrypt = async ({ str, saltRounds }: EncryptProps) => {
	try {
		const encrypted = await hash(str, saltRounds)

		return encrypted
	} catch (error) {
		console.log(error)
		throw new Error('Error on encrypt!')
	}
}

export { encrypt }
