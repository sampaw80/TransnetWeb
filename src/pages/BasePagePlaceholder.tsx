import { Box, Typography, Paper } from '@mui/material';

type BasePageProps = {
    title: string;
    description: string;
};

export function BasePagePlaceholder({ title, description }: BasePageProps) {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                {title}
            </Typography>
            <Paper sx={{ p: 4, mt: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    (Page under construction)
                </Typography>
            </Paper>
        </Box>
    );
}
