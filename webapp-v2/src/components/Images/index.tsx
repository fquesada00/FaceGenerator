import { Grid } from "@mui/material";
import { IApiFace } from "services/api/models";
import ImageTemplate from "./ImageTemplate";

type ImagesProps = {
  faces: IApiFace[];
  disableDownload?: boolean;
  disableSave?: boolean;
};

const Images = (props: ImagesProps) => {
  const { faces, disableDownload, disableSave } = props;

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {
        faces.map((face: IApiFace, index) => (
          <Grid item key={face.id}>
            <ImageTemplate
              src={'data:image/png;base64, '+face.image}
              alt={`Face ${index + 1}`}
              faceId={face.id}
              disableDownload={disableDownload}
              disableSave={disableSave}
            />
          </Grid>
        ))
      }
    </Grid>
  );
};

export default Images;