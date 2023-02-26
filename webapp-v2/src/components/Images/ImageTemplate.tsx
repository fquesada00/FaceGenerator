import { Card, CardActions, IconButton, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import clsx from 'clsx';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { toastError, toastInfo, toastSuccess } from 'components/Toast';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import useFacesApi from 'hooks/api/useFacesApi';
import ImagePlaceholder from './ImagePlaceholder';
import AddMetadataSteps from './AddMetadataSteps';
import { toast, Id } from 'react-toastify';
import useFaceImgLazyLoading from 'hooks/useFaceImgLazyLoading';

type ImageTemplateProps = {
  src?: string;
  alt: string;
  faceId?: string;
  className?: string;
  imgHeightClassName?: string;
  cardHeightClassName?: string;
  cardWidthClassName?: string;
  disableDownload?: boolean;
  disableSave?: boolean;
  placeholderText?: string;
};

function ImageTemplate(props: ImageTemplateProps) {
  const { saveFace } = useFacesApi();
  const {
    src,
    alt,
    faceId,
    className,
    disableDownload,
    disableSave,
    placeholderText,
    imgHeightClassName,
    cardHeightClassName,
    cardWidthClassName
  } = props;

  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const [openMetadataSteps, setOpenMetadataSteps] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const savingToastId = useRef<Id | null>(null);

  const onDownload = () => {
    downloadRef?.current?.click();
  };

  const { mutate: mutateSaveFace, isLoading: isLoadingSave } = useMutation(
    saveFace,
    {
      onSuccess: data => {
        setIsSaved(true);
        toast.dismiss(savingToastId.current!);
        toastSuccess(`Face with id ${faceId} saved successfully`);
      },
      onError: error => {
        if (error instanceof ApiError) {
          toastError(
            `Error saving face with id ${faceId}. ${error.toString()}`
          );
        }
      }
    }
  );

  const onSave = () => {
    if (faceId === undefined) {
      toastError(`Saving Face: Face id is undefined`);
      return;
    }

    setOpenMetadataSteps(true);
  };

  const onMetadataStepsDone = (metadata: Record<string, any>) => {
    setOpenMetadataSteps(false);
    savingToastId.current = toast.info(`Saving face with id ${faceId!}...`);
    mutateSaveFace({
      id: faceId!,
      metadata
    });
  };

  const onMetadataStepsCancel = () => {
    setOpenMetadataSteps(false);
  };

  const { ref, faceImageUrl } = useFaceImgLazyLoading({ faceId });

  const CardContentComponent = useMemo(() => {
    if (!src || !faceImageUrl) {
      return <ImagePlaceholder text={placeholderText} />;
    }

    return (
      <>
        <img
          src={faceImageUrl}
          alt={alt}
          className={clsx('w-full', imgHeightClassName ?? 'h-40')}
          style={{ objectFit: 'cover' }}
        />
        <CardActions className="flex content-center justify-center space-x-6">
          {/* <Typography gutterBottom variant="h6" component="span">
            ID {faceId}
          </Typography> */}
          {!disableDownload && (
            <IconButton onClick={onDownload}>
              <a
                ref={downloadRef}
                href={faceImageUrl}
                download={`face_${faceId}.png`}
              />
              <DownloadIcon />
            </IconButton>
          )}
          {!disableSave && !isSaved && (
            <IconButton onClick={onSave}>
              <SaveIcon />
            </IconButton>
          )}
        </CardActions>
      </>
    );
  }, [
    src,
    alt,
    faceId,
    disableDownload,
    disableSave,
    onDownload,
    onSave,
    placeholderText,
    imgHeightClassName,
    faceImageUrl,
    isSaved
  ]);

  return (
    <>
      <Card
        ref={ref}
        className={clsx(
          cardWidthClassName ?? 'w-48',
          cardHeightClassName ?? 'h-52',
          className
        )}
      >
        {CardContentComponent}
      </Card>
      {openMetadataSteps && (
        <AddMetadataSteps
          open={openMetadataSteps}
          onDone={onMetadataStepsDone}
          onCancel={onMetadataStepsCancel}
        />
      )}
    </>
  );
}

export default ImageTemplate;
