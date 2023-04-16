import { Grid } from '@mui/material';
import { IApiFace } from 'services/api/models';
import ImageTemplate from './ImageTemplate';

type ImagesProps = {
  faces: IApiFace[];
  disableDownload?: boolean;
  disableSave?: boolean;
  onDelete?: () => void;
  disableDelete?: boolean;
};

function Images(props: ImagesProps) {
  const { faces, disableDownload, disableSave, onDelete, disableDelete } =
    props;

  return (
    <Grid container spacing={2} alignItems='center' justifyContent='center'>
      {faces.map((face: IApiFace, index) => (
        <Grid item key={face.id}>
          <ImageTemplate
            alt={`Face ${index + 1}`}
            faceId={face.id}
            disableDownload={disableDownload}
            disableSave={disableSave}
            onDelete={onDelete}
            disableDelete={disableDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default Images;
