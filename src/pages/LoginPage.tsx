import { Paper, Stack } from '@mui/material'
import { LoginForm } from '../features/auth/LoginForm'

export function LoginPage() {
  return (
    <Stack
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (t) => t.palette.grey[100],
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
        }}
      >
        <LoginForm />
      </Paper>
    </Stack>
  )
}

