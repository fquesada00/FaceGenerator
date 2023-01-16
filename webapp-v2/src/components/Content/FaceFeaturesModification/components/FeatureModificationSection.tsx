import { Grid, Typography } from "@mui/material";
import { Children } from "react";

type FeatureModificationSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const FeatureModificationSection = (props: FeatureModificationSectionProps) => {
  const { title, subtitle, children } = props;

  return (
    <div className="mt-8">
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" component="p">
          {subtitle}
        </Typography>
      )}
      <Grid container spacing={1} style={{ marginTop: 0 }} alignItems="center">
        {
          Children.map(children, (child) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {child}
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  );
};

export default FeatureModificationSection;