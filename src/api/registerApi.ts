import { RegisterFormValues } from '#src/validation/registerSchema'
import ky from 'ky'

export const API_URL = 'http://localhost:4100/api'

const api = ky.create({
	prefixUrl: API_URL,
	throwHttpErrors: true,
})

export const registerUser = (data: RegisterFormValues) =>
	api.post('register', { json: data }).json<{ message: string }>()
