import { z } from 'zod'
import i18n from '#root/i18n.ts'

const { t } = i18n

const errorMap: z.core.$ZodErrorMap = (issue) => {
	if (issue.code === 'invalid_format' && 'format' in issue && issue.format === 'email') {
		return t('form.invalidEmail')
	}
	if (issue.code === 'too_small' && 'minimum' in issue && issue.minimum === 1) {
		return t('form.required')
	}
	if (issue.code === 'too_small' && 'minimum' in issue && issue.minimum === 6) {
		return t('form.passwordTooShort')
	}
	return issue.message ?? undefined
}

z.config({ customError: errorMap })

export const registerSchema = z
	.object({
		firstName: z.string().min(1, t('form.required')),
		lastName: z.string().min(1, t('form.required')),
		email: z
			.string()
			.min(1, t('form.required'))
			.pipe(z.email({ message: t('form.invalidEmail') })),
		password: z.string().min(6, t('form.passwordTooShort')),
		confirmPassword: z.string().min(6, t('form.passwordTooShort')),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: t('form.passwordsDontMatch'),
				path: ['confirmPassword'],
			})
		}
	})

export type RegisterFormValues = z.infer<typeof registerSchema>
