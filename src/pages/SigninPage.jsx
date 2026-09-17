import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router'
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
    Container,
} from '@mui/material'
import { Signin } from '../services/AuthService'


function SigninPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await Signin(email, password)
            navigate('/dashboard')

        } catch (err) {
            setError(err.response?.data?.message || 'Signin failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
                            Log in
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                            Welcome back to Gnocchi! Please enter your credentials to access your dashboard.
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : ' sign in'}
                            </Button>

                            <Box textalign="center" mt={1}>
                                <Link component={RouterLink} to="/signup" variant="body2">
                                    No account yet? Sign up here
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}

export { SigninPage }