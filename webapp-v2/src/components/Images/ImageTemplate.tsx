import { Button, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import clsx from "clsx";
import { useRef } from "react";
import { toastError, toastInfo } from "components/Toast";
import { useMutation } from "react-query";
import ApiError from "services/api/Error";
import { interchangeFacesFeatures, saveFace } from "services/api/FaceGeneratorApi";

type ImageTemplateProps = {
  src: string;
  alt: string;
  faceId: number;
  className?: string;
  disableDownload?: boolean;
  disableSave?: boolean;
};

const ImageTemplate = (props: ImageTemplateProps) => {
  const { src, alt, faceId, className, disableDownload, disableSave } = props;

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
    toastInfo(`Saving face with id ${faceId}...`);
    mutateSaveFace(faceId);
  }

  return (
    <Card className={clsx('w-48', 'h-52', className)}>
      <img src={src} alt={alt} className={clsx('w-full', 'h-40')} loading="lazy" style={{ objectFit: "cover" }} />
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
    </Card>
  );
};

export default ImageTemplate;