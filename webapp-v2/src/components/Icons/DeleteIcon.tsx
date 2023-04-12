import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import clsx from 'clsx';

type DeleteIconProps = {
  onClick: () => void;
  className: string;
};

const DeleteIcon = (props: DeleteIconProps) => {
  const { onClick, className } = props;

  return (
    <div
      className={clsx('bg-rose-500', className)}
      style={{ borderRadius: '50%' }}
      onClick={onClick}
    >
      <IconButton
        style={{ padding: '0.25rem', color: 'white' }}
        aria-label='delete'
        size='large'
      >
        <DeleteForeverIcon />
      </IconButton>
    </div>
  );
};

export default DeleteIcon;
