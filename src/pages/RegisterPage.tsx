import RegisterForm from '#src/components/RegisterForm'
import Notification from '#src/components/Notification'
import { Box } from '@mui/material'

const RegisterPage = () => (
	<Box
		sx={{
			display: 'flex',
			width: '100vw',
			height: '100vh',
			backgroundColor: 'background.default',
			color: 'text.primary',
			padding: 3,
			overflow: 'hidden',
			flexDirection: 'column',
		}}
	>
		<RegisterForm />
		<Notification />
	</Box>
)

export default RegisterPage
