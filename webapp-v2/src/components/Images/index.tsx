import { Grid } from "@mui/material";
import clsx from "clsx";
import { IApiFace } from "services/api/models";
import ImageTemplate from "./ImageTemplate";

type ImagesProps = {
  faces: IApiFace[];
};

const Images = (props: ImagesProps) => {
  const { faces } = props;

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {
        faces.map((face: IApiFace, index) => (
          <Grid item key={face.id}>
            <ImageTemplate
              src={face.image}
              alt={`Face ${index + 1}`}
            />
          </Grid>
        ))
      }
    </Grid>
  );
};

export default Images;