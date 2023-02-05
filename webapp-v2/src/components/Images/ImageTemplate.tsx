import { Card, CardActions, IconButton, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import clsx from "clsx";
import { Fragment, useMemo, useRef } from "react";
import { toastError, toastInfo } from "components/Toast";
import { useMutation } from "react-query";
import ApiError from "services/api/Error";
import { saveFace } from "services/api/FaceGeneratorApi";
import ImagePlaceholder from "./ImagePlaceholder";

type ImageTemplateProps = {
  src?: string;
  alt: string;
  faceId?: number;
  className?: string;
  imgHeightClassName?: string;
  cardHeightClassName?: string;
  cardWidthClassName?: string;
  disableDownload?: boolean;
  disableSave?: boolean;
  placeholderText?: string;
};

const ImageTemplate = (props: ImageTemplateProps) => {
  const {
    src, alt, faceId, className, disableDownload, disableSave,
    placeholderText, imgHeightClassName, cardHeightClassName, cardWidthClassName
  } = props;

  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  const onDownload = () => {
    // TODO: https://developer.chrome.com/blog/chrome-65-deprecations/#block_cross-origin_wzxhzdk5a_download
    downloadRef?.current?.click();
  }

  const {
    mutate: mutateSaveFace, isLoading: isLoadingSave
  } = useMutation(saveFace, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(`Error saving face with id ${faceId}. ${error.toString()}`);
      }
    }
  });

  const onSave = () => {
    if (faceId === undefined) {
      toastError(`Saving Face: Face id is undefined`);
      return;
    }

    toastInfo(`Saving face with id ${faceId!}...`);
    mutateSaveFace(faceId!);
  }

  const isBase64 = (src: string) => {
    return !src.startsWith('http');
  }

  const CardContentComponent = useMemo(() => {
    if (!src) {
      return (
        <ImagePlaceholder text={placeholderText} />
      );
    }

    return (
      <Fragment>
        <img src={(isBase64(src)? 'data:image/png;base64, ' :'') + src} alt={alt} className={clsx('w-full', imgHeightClassName ?? 'h-40')} loading="lazy" style={{ objectFit: "cover" }} />
        <CardActions className="flex content-center justify-center space-x-6" >
          <Typography gutterBottom variant="h6" component="span">
            ID {faceId}
          </Typography>
          {
            !disableDownload &&
            <IconButton onClick={onDownload}>
              <a ref={downloadRef} href={src} download={'image.jpg'} />
              <DownloadIcon />
            </IconButton>
          }
          {
            !disableSave &&
            <IconButton onClick={onSave}>
              <SaveIcon />
            </IconButton>
          }
        </CardActions>
      </Fragment>
    );
  }, [src, alt, faceId, disableDownload, disableSave, onDownload, onSave, placeholderText, imgHeightClassName]);

  return (
    <Card className={clsx(cardWidthClassName ?? 'w-48', cardHeightClassName ?? 'h-52', className)}>
      {CardContentComponent}
    </Card>
  );
};

export default ImageTemplate;