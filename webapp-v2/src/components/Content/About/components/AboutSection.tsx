import { Typography } from '@mui/material';

type AboutSectionProps = {
  title: string;
  content: string;
};

function AboutSection(props: AboutSectionProps) {
  const { title, content } = props;

  return (
    <div className='mt-4'>
      <Typography variant='h5' sx={{ fontWeight: '600' }}>
        {title}
      </Typography>
      <Typography variant='body2' sx={{ fontWeight: '400' }}>
        {content}
      </Typography>
    </div>
  );
}

export default AboutSection;
