import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import RegisterForm from '#src/components/RegisterForm'
import { registerUser } from '#src/api/registerApi.ts'
import i18n from '#root/i18n'

const { t } = i18n
const mockSetNotification = vi.fn()
const mockSetError = vi.fn()
const mockRegisterUser = vi.mocked(registerUser)

vi.mock('#src/stores/uiStore', () => ({
	useUIStore: () => ({
		setNotification: mockSetNotification,
		setError: mockSetError,
	}),
}))

vi.mock('#src/api/registerApi', () => ({
	registerUser: vi.fn(),
}))

describe('RegisterForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		render(
			<I18nextProvider i18n={i18n}>
				<RegisterForm />
			</I18nextProvider>,
		)
	})

	it('renders all form fields', () => {
		expect(screen.getByTestId('input-firstName')).toBeInTheDocument()
		expect(screen.getByTestId('input-lastName')).toBeInTheDocument()
		expect(screen.getByTestId('input-email')).toBeInTheDocument()
		expect(screen.getByTestId('input-password')).toBeInTheDocument()
		expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument()
	})

	it('shows validation errors on empty submit', async () => {
		fireEvent.click(screen.getByTestId('button-submit'))

		await waitFor(() => {
			expect(screen.getAllByText(t('form.passwordTooShort'))).toHaveLength(2)
			expect(screen.getAllByText(t('form.required'))).toHaveLength(3)
		})
	})

	it('shows error if passwords do not match', async () => {
		fireEvent.change(screen.getByTestId('input-password'), {
			target: { value: 'secret123' },
		})

		fireEvent.change(screen.getByTestId('input-confirmPassword'), {
			target: { value: 'wrong123' },
		})

		fireEvent.click(screen.getByTestId('button-submit'))

		await waitFor(() => {
			expect(
				screen.getByText((content) => content.includes(t('form.passwordsDontMatch'))),
			).toBeInTheDocument()
		})
	})

	it('shows error for invalid email format', async () => {
		fireEvent.change(screen.getByTestId('input-email'), {
			target: { value: 'not-an-email' },
		})

		fireEvent.click(screen.getByTestId('button-submit'))

		await waitFor(() => {
			expect(screen.getByText((text) => text.includes(t('form.invalidEmail')))).toBeInTheDocument()
		})
	})

	it('submits form when valid and shows notification', async () => {
		mockRegisterUser.mockResolvedValueOnce({ message: 'Registered!' })

		fireEvent.change(screen.getByTestId('input-firstName'), {
			target: { value: 'John' },
		})
		fireEvent.change(screen.getByTestId('input-lastName'), {
			target: { value: 'Doe' },
		})
		fireEvent.change(screen.getByTestId('input-email'), {
			target: { value: 'john@example.com' },
		})
		fireEvent.change(screen.getByTestId('input-password'), {
			target: { value: 'secret123' },
		})
		fireEvent.change(screen.getByTestId('input-confirmPassword'), {
			target: { value: 'secret123' },
		})

		fireEvent.click(screen.getByTestId('button-submit'))

		await waitFor(
			() => {
				expect(mockSetNotification).toHaveBeenCalledWith(t('form.registerSuccess'))
			},
			{ timeout: 2000 },
		)
	})

	it('shows error notification if registration fails', async () => {
		mockRegisterUser.mockRejectedValueOnce(new Error('Server error'))

		fireEvent.change(screen.getByTestId('input-firstName'), {
			target: { value: 'Jane' },
		})
		fireEvent.change(screen.getByTestId('input-lastName'), {
			target: { value: 'Doe' },
		})
		fireEvent.change(screen.getByTestId('input-email'), {
			target: { value: 'jane@example.com' },
		})
		fireEvent.change(screen.getByTestId('input-password'), {
			target: { value: 'password123' },
		})
		fireEvent.change(screen.getByTestId('input-confirmPassword'), {
			target: { value: 'password123' },
		})

		fireEvent.click(screen.getByTestId('button-submit'))

		await waitFor(
			() => {
				expect(mockSetError).toHaveBeenCalledWith(t('form.registerError'))
			},
			{ timeout: 2000 },
		)
	})
})
