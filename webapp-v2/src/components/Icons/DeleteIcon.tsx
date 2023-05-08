import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton } from '@mui/material';
import clsx from 'clsx';

type DeleteIconProps = {
  onClick: () => void;
  className: string;
};

const DeleteIcon = (props: DeleteIconProps) => {
  const { onClick, className } = props;

  return (
    <Box
      className={clsx(className)}
      sx={{
        backgroundColor: 'error.main',
        borderRadius: '50%'
      }}
      onClick={onClick}
    >
      <IconButton
        style={{ padding: '0.25rem', color: 'white' }}
        aria-label='delete'
        size='large'
      >
        <DeleteForeverIcon />
      </IconButton>
    </Box>
  );
};

export default DeleteIcon;
