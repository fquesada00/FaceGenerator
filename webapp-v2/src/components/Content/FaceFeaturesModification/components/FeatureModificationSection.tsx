import { Card, Grid, Typography } from '@mui/material';
import clsx from 'clsx';
import { Children } from 'react';

type FeatureModificationSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  first?: boolean;
};

function FeatureModificationSection(props: FeatureModificationSectionProps) {
  const { title, subtitle, children, first = false } = props;

  return (
    <Card className={clsx('w-full p-2', !first ? 'mt-8' : '')}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" component="p">
          {subtitle}
        </Typography>
      )}
      <Grid container spacing={1} style={{ marginTop: 0 }} alignItems="center">
        {Children.map(children, child => (
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className="justify-center flex items-center"
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}

export default FeatureModificationSection;
