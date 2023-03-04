import { Typography } from '@mui/material';
import clsx from 'clsx';

type ImagePlaceholderProps = {
  text?: string;
};

function ImagePlaceholder(props: ImagePlaceholderProps) {
  const { text } = props;

  return (
    <div
      className={clsx(
        'w-full',
        'h-full',
        'flex',
        'justify-center',
        'items-center',
        'rounded-lg',
        'border-stone-900',
        'bg-stone-300'
      )}
      style={{ borderWidth: '0.25rem' }}
    >
      <Typography variant='h6' component='span' textAlign='center'>
        {text ?? 'You will see an image here'}
      </Typography>
    </div>
  );
}

export default ImagePlaceholder;
