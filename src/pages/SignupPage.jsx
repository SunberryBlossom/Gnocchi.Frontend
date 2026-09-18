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
import { Signup } from '../services/AuthService'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await Signup(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Full Signup Error:', err.response?.data)

      const data = err.response?.data
      let errorMessage = 'Signup failed. Please try again.'

      if (data) {
        // Om Identity returnerar en array med felbeskrivningar (t.ex. DuplicateUserName)
        if (Array.isArray(data)) {
          errorMessage = data.map((item) => item.description).join(' ')
        } 
        // Om felet ligger i ett standard .NET ValidationErrors-objekt
        else if (data.errors) {
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.map((item) => item.description || item).join(' ')
          } else if (typeof data.errors === 'object') {
            errorMessage = Object.values(data.errors).flat().join(' ')
          }
        } 
        else if (data.detail) {
          errorMessage = data.detail
        }
      }

      setError(errorMessage)
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
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Create an account to start tracking your dishes and cooking results in Gnocchi.
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box textAlign="center" mt={1}>
                <Link component={RouterLink} to="/" variant="body2">
                  Already have an account? Sign in here
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export { SignupPage }