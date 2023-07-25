import ContentHeader from 'components/ContentHeader';
import paths from 'routes/paths';
import GeneralSettingsSection from './components/GeneralSettingsSection';
import { Box } from '@mui/material';
import FacesSettingsSection from './components/FacesSettingsSection';

const Settings: React.FC = () => {
  return (
    <div>
      <ContentHeader title={paths.adminPanel.title} />
      <div className='mt-4 justify-center flex'>
        <Box
          sx={{
            width: {
              xs: '20rem',
              sm: '30rem',
              md: '40rem',
              lg: '50rem',
              xl: '60rem'
            }
          }}
          className='gap-8 grid'
        >
          <GeneralSettingsSection />
          <FacesSettingsSection />
        </Box>
      </div>
    </div>
  );
};

export default Settings;
