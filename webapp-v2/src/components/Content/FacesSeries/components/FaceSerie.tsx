import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import clsx from "clsx";
import ImageTemplate from "components/Images/ImageTemplate";
import { useMemo, useState } from "react";
import { IApiFaceSerie } from "services/api/models";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type FaceSerieProps = {
  serie: IApiFaceSerie;
  className?: string;
};

const FaceSerie = (props: FaceSerieProps) => {
  const { serie, className } = props;

  const [open, setOpen] = useState<boolean>(true);

  const Faces = useMemo(() => {
    return serie.faces.map((face) => {
      return (
        <Grid item key={face.id}>
          <ImageTemplate
            src={face.image}
            alt={`Face ${face.id}`}
            faceId={face.id}
            disableSave
          />
        </Grid>
      );
    });
  }, [serie]);

  return (
    <Card className={clsx(className, !open ? "cursor-pointer" : "")} onClick={() => !open && setOpen(true)} sx={{ backgroundColor: "rgba(0, 0, 0, 0.075)" }}>
      <CardContent style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}>
        <div className="flex justify-between px-8" >
          <Typography variant="h5" component="h2" className="flex">
            <strong className="flex items-center">ID: {serie.id}</strong>
          </Typography>
          <IconButton aria-label="expand face serie" onClick={() => setOpen(!open)} style={{ color: "black" }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {
          open && (
            <Grid container spacing={2} className="justify-center flex items-center pb-4" style={{ marginTop: 0 }}>
              {Faces}
            </Grid>
          )
        }
      </CardContent>
    </Card>
  )
};

export default FaceSerie;