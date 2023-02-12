import { Card, CardActions, CardContent, Grid, IconButton, Typography } from "@mui/material";
import clsx from "clsx";
import ImageTemplate from "components/Images/ImageTemplate";
import { useEffect, useMemo, useState } from "react";
import { IApiFaceSerie } from "services/api/models";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CtaButton from "components/CtaButton";

type FaceSerieProps = {
  serie: IApiFaceSerie;
  className?: string;
  collapse?: boolean;
};

const FaceSerie = (props: FaceSerieProps) => {
  const { serie, className, collapse = false } = props;

  const [open, setOpen] = useState<boolean>(!collapse);

  useEffect(() => {
    setOpen(!collapse);
  }, [collapse]);

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
            <Grid container spacing={2} className="justify-center flex items-center pb-2" style={{ marginTop: 0 }}>
              {Faces}
            </Grid>
          )
        }
      </CardContent>
      <CardActions className="flex content-center justify-center space-x-6 mb-2">
        <CtaButton
          type="button"
          label="Download Serie"
          onClick={() => { console.log("Download Serie" + serie.id) }}
          className="w-48"
        />
      </CardActions>
    </Card>
  )
};

export default FaceSerie;