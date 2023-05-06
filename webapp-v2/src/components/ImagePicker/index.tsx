import { Grid } from '@mui/material';
import SelectableImage from 'components/Images/SelectableImage';
import { IApiFace } from 'services/api/models';

type ImagePickerProps = {
  faces: IApiFace[];
  selectedFaceId: string | null;
  onPick: (faceId: string, url?: string) => void;
};

function ImagePicker(props: ImagePickerProps) {
  const { faces, selectedFaceId, onPick } = props;

  return (
    <Grid container alignItems='center' justifyContent='center'>
      {faces.map(face => (
        <SelectableImage
          key={face.id}
          src={face.image}
          alt={`Face ${face.id}`}
          faceId={face.id}
          selected={selectedFaceId === face.id}
          onClick={(url) => onPick(face.id, url)}
          className='m-1'
        />
      ))}
    </Grid>
  );
}

export default ImagePicker;
