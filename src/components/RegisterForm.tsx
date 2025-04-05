// #src/components/RegisterForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormValues } from '#src/validation/registerSchema'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '#src/stores/uiStore.ts'
import { registerUser } from '#src/api/registerApi.ts'

const RegisterForm = () => {
	const { setNotification, setError } = useUIStore()
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema, {
			errorMap: (_issue, ctx) => {
				return { message: ctx.defaultError }
			},
		}),
	})

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			const response = await registerUser(data)

			setNotification(t('form.registerSuccess'))
			console.log('Registered with:', response)
			reset()
		} catch (error) {
			console.error('Registration failed:', error)
			setError(t('form.registerError'))
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				width: '100%',
				maxWidth: 400,
				margin: 'auto',
			}}
		>
			<Typography variant="h5" align="center">
				{t('form.title')}
			</Typography>

			<TextField
				label={t('form.firstName')}
				autoFocus
				{...register('firstName')}
				error={!!errors.firstName}
				helperText={errors.firstName?.message}
				inputProps={{ 'data-testid': 'input-firstName' }}
			/>

			<TextField
				label={t('form.lastName')}
				{...register('lastName')}
				error={!!errors.lastName}
				helperText={errors.lastName?.message}
				inputProps={{ 'data-testid': 'input-lastName' }}
			/>

			<TextField
				label={t('form.email')}
				{...register('email')}
				error={!!errors.email}
				helperText={errors.email?.message}
				inputProps={{ 'data-testid': 'input-email' }}
			/>

			<TextField
				label={t('form.password')}
				type="password"
				{...register('password')}
				error={!!errors.password}
				helperText={errors.password?.message}
				inputProps={{ 'data-testid': 'input-password' }}
			/>

			<TextField
				label={t('form.confirmPassword')}
				type="password"
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				helperText={errors.confirmPassword?.message}
				inputProps={{ 'data-testid': 'input-confirmPassword' }}
			/>
			<Button
				sx={{ p: 2 }}
				type="submit"
				variant="contained"
				disabled={isSubmitting}
				data-testid="button-submit"
			>
				{isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('form.submit')}
			</Button>
		</Box>
	)
}

export default RegisterForm
