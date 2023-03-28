import { Box, Grid, Typography } from '@mui/material';
import ContentHeader from 'components/ContentHeader';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import paths from 'routes/paths';
import faces from 'assets/faces.jpg';
import FeatureListItem from './components/FeatureListItem';
import homeJson from 'assets/data/home.json';

const Home: React.FC = () => {
  const renderSubtitle = useMemo(
    () => (
      <div>
        {homeJson.subtitle}
        <br />
        <br />
        Here is a list of the features that are currently available:
      </div>
    ),
    [homeJson]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <ContentHeader title={homeJson.title} subtitle={renderSubtitle} />
        <ul className='pl-4'>
          <FeatureListItem
            title={paths.randomFaces.title}
            description={homeJson.features.random_faces.description}
            path={paths.randomFaces.path}
          />
          <FeatureListItem
            title={paths.searchFaces.title}
            description={homeJson.features.search_faces.description}
            path={paths.searchFaces.path}
          />
          <FeatureListItem
            title={paths.transitionFaces.title}
            description={homeJson.features.transition_faces.description}
            path={paths.transitionFaces.path}
          />
          <FeatureListItem
            title={paths.faceFromImage.title}
            description={homeJson.features.face_from_image.description}
            path={paths.faceFromImage.path}
          />
          <FeatureListItem
            title={paths.faceFeaturesModification.title}
            description={homeJson.features.features_modification.description}
            path={paths.faceFeaturesModification.path}
          />
          <FeatureListItem
            title={paths.interchangeFacesFeatures.title}
            description={homeJson.features.interchange_features.description}
            path={paths.interchangeFacesFeatures.path}
          />
          <FeatureListItem
            title={paths.facesSeries.title}
            description={homeJson.features.faces_series.description}
            path={paths.facesSeries.path}
          />
        </ul>
        <div className='mt-4'>
          <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
            You can find more information about the project in the&nbsp;
            <Link
              to={paths.about.path}
              className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'
            >
              <strong>About</strong>
            </Link>
            &nbsp;page.
          </Typography>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        xl={6}
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Box
          sx={{
            width: {
              xs: '16rem',
              sm: '20rem',
              md: '24rem',
              lg: '26rem',
              xl: '30rem'
            },
            height: {
              xs: '16rem',
              sm: '20rem',
              md: '24rem',
              lg: '26rem',
              xl: '30rem'
            }
          }}
        >
          <img
            src={faces}
            alt='Faces'
            style={{ height: 'inherit', width: 'inherit' }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
