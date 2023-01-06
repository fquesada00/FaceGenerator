import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

type FeatureListItemProps = {
  title: string;
  description: string;
  path: string;
}

const FeatureListItem = (props: FeatureListItemProps) => {
  const { title, description, path } = props;

  return (
    <li>
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
        <Link to={path} ><strong>{ title }</strong></Link>: { description }
      </Typography>
    </li>
  );
}

export default FeatureListItem;