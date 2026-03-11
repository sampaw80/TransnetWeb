import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { GpsFixed as GpsIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getLatestLocation } from './locationApi'
import type { LocationRecord } from './locationApi'
import { alpha, useTheme } from '@mui/material/styles'

export function DriverLocationPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [location, setLocation] = useState<LocationRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    setError(null)
    try {
      setLocation(await getLatestLocation(driverId))
    } catch {
      setError('Failed to fetch driver location.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  const mapSrc = location
    ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`
    : null

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <GpsIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Driver Location</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Latest GPS coordinates</Typography>
              </Box>
            </Box>
            <Button variant="outlined" startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />} onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none' }}>
              Refresh
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : location ? (
            <>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  {[
                    { label: 'Latitude', value: location.latitude.toFixed(6) },
                    { label: 'Longitude', value: location.longitude.toFixed(6) },
                    { label: 'Speed', value: location.speed != null ? `${location.speed} km/h` : '—' },
                    { label: 'Heading', value: location.heading != null ? `${location.heading}°` : '—' },
                    { label: 'Recorded At', value: new Date(location.recordedAt).toLocaleString() },
                  ].map((item) => (
                    <Box key={item.label} sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', height: 400, bgcolor: 'background.paper' }}>
                <iframe
                  title="Driver Location Map"
                  src={mapSrc!}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allowFullScreen
                  loading="lazy"
                />
              </Paper>
            </>
          ) : (
            <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center', bgcolor: 'background.paper' }}>
              <GpsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>No Location Data</Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>This driver has not reported a GPS location yet.</Typography>
            </Paper>
          )}
        </Stack>
      </Fade>
    </Container>
  )
}
