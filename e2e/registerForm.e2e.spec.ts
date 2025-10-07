import i18n from '#root/i18n'
import { expect, test } from '@playwright/test'

const { t } = i18n

test.describe('RegisterForm E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('renders all fields correctly', async ({ page }) => {
		await expect(page.getByTestId('input-firstName')).toBeVisible()
		await expect(page.getByTestId('input-lastName')).toBeVisible()
		await expect(page.getByTestId('input-email')).toBeVisible()
		await expect(page.getByTestId('input-password')).toBeVisible()
		await expect(page.getByTestId('input-confirmPassword')).toBeVisible()
		await expect(page.getByTestId('button-submit')).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ page }) => {
		await page.getByTestId('button-submit').click()

		await expect(page.getByText(t('form.passwordTooShort'))).toHaveCount(2)

		await expect(page.getByText(t('form.required'))).toHaveCount(3)
	})

	test('shows error when passwords do not match', async ({ page }) => {
		await page.getByTestId('input-password').fill('secret123')
		await page.getByTestId('input-confirmPassword').fill('wrong123')
		await page.getByTestId('button-submit').click()

		await expect(page.getByText(t('form.passwordsDontMatch'))).toBeVisible()
	})

	test('shows error for invalid email format', async ({ page }) => {
		await page.getByTestId('input-email').fill('invalid-email')
		await page.getByTestId('button-submit').click()

		await expect(page.getByText(t('form.invalidEmail'))).toBeVisible()
	})

	test('submits form successfully and shows notification', async ({ page }) => {
		await page.getByTestId('input-firstName').fill('John')
		await page.getByTestId('input-lastName').fill('Doe')
		await page.getByTestId('input-email').fill('john@example.com')
		await page.getByTestId('input-password').fill('secret123')
		await page.getByTestId('input-confirmPassword').fill('secret123')
		await page.getByTestId('button-submit').click()

		await expect(page.getByText(t('form.registerSuccess'))).toBeVisible()
	})

	test('shows error notification when registration fails', async ({ page }) => {
		await page.route('**/api/register', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ error: 'Server error' }),
			})
		})

		await page.goto('/')

		await page.getByTestId('input-firstName').fill('Error')
		await page.getByTestId('input-lastName').fill('User')
		await page.getByTestId('input-email').fill('error@example.com')
		await page.getByTestId('input-password').fill('secret123')
		await page.getByTestId('input-confirmPassword').fill('secret123')
		await page.getByTestId('button-submit').click()

		await expect(page.getByText(t('form.registerError'))).toBeVisible()
	})
})
