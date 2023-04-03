import { Stack, Typography } from '@mui/material';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = (props: SettingsSectionProps) => {
  const { title, children } = props;

  return (
    <div>
      <Typography variant='h5' style={{ marginBottom: '0.5rem' }}>
        <strong>{title}</strong>
      </Typography>
      <Stack spacing={2}>{children}</Stack>
    </div>
  );
};

export default SettingsSection;
