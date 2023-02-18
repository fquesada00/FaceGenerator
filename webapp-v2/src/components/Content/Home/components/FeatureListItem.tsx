import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

type FeatureListItemProps = {
  title: string;
  description: string;
  path: string;
};

function FeatureListItem(props: FeatureListItemProps) {
  const { title, description, path } = props;

  return (
    <li className="list-disc">
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
        <Link
          to={path}
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          <strong>{title}</strong>
        </Link>
        : {description}
      </Typography>
    </li>
  );
}

export default FeatureListItem;
