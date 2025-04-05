import { z } from 'zod'
import i18n from '#root/i18n.ts'

const { t } = i18n

z.setErrorMap((issue, ctx) => {
	if (issue.code === 'invalid_string' && issue.validation === 'email') {
		return { message: t('form.invalidEmail') }
	}
	if (issue.code === 'too_small' && issue.minimum === 1) {
		return { message: t('form.required') }
	}
	if (issue.code === 'too_small' && issue.minimum === 6) {
		return { message: t('form.passwordTooShort') }
	}
	return { message: ctx.defaultError }
})

export const registerSchema = z
	.object({
		firstName: z.string().min(1, t('form.required')),
		lastName: z.string().min(1, t('form.required')),
		email: z.string().min(1, t('form.required')).email(t('form.invalidEmail')),
		password: z.string().min(6, t('form.passwordTooShort')),
		confirmPassword: z.string().min(6, t('form.passwordTooShort')),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: t('form.passwordsDontMatch'),
				path: ['confirmPassword'], // ✅ works perfectly with RHF
			})
		}
	})

export type RegisterFormValues = z.infer<typeof registerSchema>
