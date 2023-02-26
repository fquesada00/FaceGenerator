import { Box, Card, Typography, useTheme } from '@mui/material';
import clsx from 'clsx';
import CenteredCircularLoader from 'components/Loaders/CenteredCircularLoader';
import useFaceImgLazyLoading from 'hooks/useFaceImgLazyLoading';
import React, { useMemo } from 'react';

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

  const theme = useTheme();
  const { ref, faceImage, isLoadingGetFaceImage } = useFaceImgLazyLoading({
    faceId
  });

  const Content = useMemo(() => {
    if (isLoadingGetFaceImage || !faceImage) {
      return <CenteredCircularLoader className='h-full w-full'/>;
    }

    return (
      <React.Fragment>
        <img
          src={faceImage.url}
          alt={alt}
          className='w-full h-full'
          // className={clsx('w-full', 'h-28')}
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
      </React.Fragment>
    );
  }, [faceImage, alt, faceId, selected, isLoadingGetFaceImage]);

  return (
    <div
      ref={ref}
      className={clsx(
        selected
          ? `shadow-[${theme.palette.success.main}] shadow-xl`
          : 'cursor-pointer hover:scale-105 hover:shadow-xl transition duration-200 ease-in-out transform',
        className
      )}
    >
      <Card
        className='w-32 h-36'
        onClick={selected ? undefined : onClick}
      >
        {Content}
      </Card>
    </div>
  );
}

export default SelectableImage;
