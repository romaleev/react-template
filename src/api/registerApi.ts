import ky from 'ky'
import { RegisterFormValues } from '#src/validation/registerSchema'

export const API_URL = 'http://localhost:4100/api'

const api = ky.create({
	prefixUrl: API_URL,
	throwHttpErrors: true,
})

export const registerUser = async (data: RegisterFormValues) => {
	return api.post('register', { json: data }).json<{ message: string }>()
}
