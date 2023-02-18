import { Grid } from '@mui/material';
import SelectableImage from 'components/Images/SelectableImage';
import { Fragment } from 'react';
import { IApiFace } from 'services/api/models';

type ImagePickerProps = {
  faces: IApiFace[];
  selectedFaceId: number | null;
  onPick: (faceId: number) => void;
};

function ImagePicker(props: ImagePickerProps) {
  const { faces, selectedFaceId, onPick } = props;

  return (
    <Grid container alignItems="center" justifyContent="center">
      {faces.map(face => (
        <SelectableImage
          key={face.id}
          src={face.image}
          alt={`Face ${face.id}`}
          faceId={face.id}
          selected={selectedFaceId === face.id}
          onClick={() => onPick(face.id)}
          className="m-1"
        />
      ))}
    </Grid>
  );
}

export default ImagePicker;
