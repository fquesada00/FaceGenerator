import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import paths from "routes/paths";
import faces from "../../../../assets/faces.jpg";
import FeatureListItem from "./components/FeatureListItem";

const Home: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Welcome to Face Generator
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          This is a web application that allows you to generate faces using a GAN model.
          More specifically, it uses a StyleGAN2 model trained on the ... dataset.
          <br /><br />
          Here is a list of the features that are currently available:
        </Typography>
        <ul className="pl-4">
          <FeatureListItem title="Random faces" description="Generate an amount of random faces." path={paths.randomFaces} />
          <FeatureListItem title="Search faces" description="Search for faces using an id. Also displays all generated images." path={paths.searchFaces} />
          <FeatureListItem title="Transition faces" description="Generate an amount of faces (transitions) between two faces." path={paths.transitionFaces} />
          <FeatureListItem title="Face from image" description="Generate a face from an image." path={paths.faceFromImage} />
          <FeatureListItem title="Modify face features" description="Modify the features of a generated face." path={paths.faceFeaturesModification} />
          <FeatureListItem title="Interchange features" description="Interchange the features of two faces." path={paths.interchangeFacesFeatures} />
        </ul>
        <div className="mt-4">
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            You can find more information about the project in the&nbsp; 
            <Link to={paths.about} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
              <strong>About</strong>
            </Link>
            &nbsp;page.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6} container direction="column" alignItems="center" justifyContent="center">
        <Box
          sx={{
            width: {
              xs: "16rem",
              sm: "20rem",
              md: "24rem",
              lg: "26rem",
              xl: "30rem",
            },
            height: {
              xs: "16rem",
              sm: "20rem",
              md: "24rem",
              lg: "26rem",
              xl: "30rem",
            }
          }}
        >
          <img src={faces} alt="Faces" style={{ height: "inherit", width: "inherit" }} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Home;