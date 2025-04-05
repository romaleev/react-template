import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from '#src/pages/RegisterPage.tsx'
import darkTheme from '#src/themes/darkTheme'
import i18n from '#root/i18n.ts'

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<RegisterPage />} />
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</I18nextProvider>
		</QueryClientProvider>
	)
}

export default App
