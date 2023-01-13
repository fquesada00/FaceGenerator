import { Box, Grid, Typography } from "@mui/material";
import ContentHeader from "components/ContentHeader";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import paths from "routes/paths";
import faces from "assets/faces.jpg";
import FeatureListItem from "./components/FeatureListItem";

const Home: React.FC = () => {

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        This is a web application that allows you to generate faces using a GAN model.
        More specifically, it uses a StyleGAN2 model trained on the ... dataset.
        <br /><br />
        Here is a list of the features that are currently available:
      </div>
    );
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <ContentHeader
          title="Welcome to Face Generator"
          subtitle={renderSubtitle}
        />
        <ul className="pl-4">
          <FeatureListItem title="Random faces" description="Generate an amount of random faces." path={paths.randomFaces.path} />
          <FeatureListItem title="Search faces" description="Search for faces using an id. Also displays all generated images." path={paths.searchFaces.path} />
          <FeatureListItem title="Transition faces" description="Generate an amount of faces (transitions) between two faces." path={paths.transitionFaces.path} />
          <FeatureListItem title="Face from image" description="Generate a face from an image." path={paths.faceFromImage.path} />
          <FeatureListItem title="Modify face features" description="Modify the features of a generated face." path={paths.faceFeaturesModification.path} />
          <FeatureListItem title="Interchange features" description="Interchange the features of two faces." path={paths.interchangeFacesFeatures.path} />
        </ul>
        <div className="mt-4">
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            You can find more information about the project in the&nbsp;
            <Link to={paths.about.path} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
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