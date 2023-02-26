import { Box, Card, Typography } from '@mui/material';
import clsx from 'clsx';

type SelectableImageProps = {
  src: string;
  alt: string;
  faceId: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

function SelectableImage(props: SelectableImageProps) {
  const { src, alt, selected, onClick, className, faceId } = props;

  return (
    <div
      className={clsx(
        selected
          ? ''
          : 'cursor-pointer hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out transform',
        className
      )}
    >
      <Card
        className={clsx('w-32', 'h-34')}
        onClick={selected ? undefined : onClick}
      >
        <img
          src={src}
          alt={alt}
          className={clsx('w-full', 'h-28')}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <Box
          className={clsx('flex', 'justify-center')}
          sx={{ backgroundColor: selected ? 'success.main' : 'secondary.main' }}
        >
          {/* <Typography gutterBottom variant="subtitle1" component="span">
            ID {faceId}
          </Typography> */}
        </Box>
      </Card>
    </div>
  );
}

export default SelectableImage;
