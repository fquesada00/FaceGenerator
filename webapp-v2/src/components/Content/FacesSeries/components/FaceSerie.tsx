import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import clsx from 'clsx';
import ImageTemplate from 'components/Images/ImageTemplate';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IApiFaceSerie } from 'services/api/models';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CtaButton from 'components/CtaButton';
import JSZip from 'jszip';
import DeleteIcon from 'components/Icons/DeleteIcon';
import useAuth from 'hooks/useAuth';
import useFacesApi from 'hooks/api/useFacesApi';
import { useMutation } from 'react-query';
import { toastError, toastSuccess } from 'components/Toast';
import ApiError from 'services/api/Error';

type FaceSerieProps = {
  serie: IApiFaceSerie;
  className?: string;
  collapse?: boolean;
  onDelete?: () => void;
};

const FaceSerie = (props: FaceSerieProps) => {
  const { serie, className, collapse = false, onDelete } = props;

  const { deleteSerie } = useFacesApi();
  const { isAdmin } = useAuth();

  const [open, setOpen] = useState<boolean>(!collapse);
  const blobs = useMemo(() => new Map<number, Blob>(), []);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setOpen(!collapse);
  }, [collapse]);

  const handleAddBlob = ({ index, blob }: { index: number; blob: Blob }) => {
    blobs.set(index, blob);
  };

  const { mutate: mutateDeleteSerie, isLoading: isLoadingDeleteSerie } =
    useMutation(deleteSerie, {
      onSuccess: data => {
        onDelete?.();
        toastSuccess(`Serie with id ${serie.id} deleted successfully`);
      },
      onError: error => {
        if (error instanceof ApiError) {
          toastError(
            `Error deleting serie with id ${serie.id}. ${error.toString()}`
          );
        }
      }
    });

  const Faces = useMemo(() => {
    return serie.faces.map((face, index) => {
      return (
        <Grid item key={face.id}>
          <ImageTemplate
            alt={`Face ${face.id}`}
            faceId={face.id}
            disableSave
            onLoaded={faceImg =>
              handleAddBlob({
                index,
                blob: faceImg.blob
              })
            }
            onDelete={onDelete}
          />
        </Grid>
      );
    });
  }, [serie.faces, onDelete]);

  const handleDownload = useCallback(() => {
    const zip = new JSZip();
    const sortedBlobs = new Map([...blobs].sort((a, b) => a[0] - b[0]));
    sortedBlobs.forEach((blob, index) => {
      zip.file(`face_${index + 1}_of_${blobs.size}.jpg`, blob);
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = URL.createObjectURL(content);
      downloadRef.current!.href = url;
      downloadRef.current!.click();
      URL.revokeObjectURL(url);
    });
  }, [blobs, downloadRef]);

  return (
    <Card
      style={{
        overflow: 'visible'
      }}
      className={clsx(className, !open ? 'cursor-pointer' : '')}
      onClick={() => !open && setOpen(true)}
      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.075)' }}
    >
      <CardContent
        style={{
          paddingBottom: '0.5rem',
          paddingTop: '0.5rem'
        }}
        className='relative'
      >
        <DeleteIcon
          onClick={() => mutateDeleteSerie(serie.id!)}
          className={clsx(
            'absolute',
            '-top-3',
            '-right-3',
            isAdmin ? 'visible' : 'invisible'
          )}
        />
        <div className='flex justify-between px-8'>
          <Typography variant='h5' component='h2' className='flex'>
            <strong className='flex items-center'>ID: {serie.id}</strong>
          </Typography>
          <IconButton
            aria-label='expand face serie'
            onClick={() => setOpen(!open)}
            style={{ color: 'black' }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {open && (
          <Grid
            container
            spacing={2}
            className='justify-center flex items-center pb-2'
            style={{ marginTop: 0 }}
          >
            {Faces}
          </Grid>
        )}
      </CardContent>
      <CardActions className='flex content-center justify-center space-x-6 mb-2'>
        <CtaButton
          type='button'
          label='Download Serie'
          onClick={handleDownload}
          className='w-48'
        />
        <a
          ref={downloadRef}
          className='hidden'
          download={`serie_${serie.id}`}
        />
      </CardActions>
    </Card>
  );
};

export default FaceSerie;
