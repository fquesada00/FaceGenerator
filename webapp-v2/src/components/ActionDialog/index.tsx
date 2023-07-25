import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

type ActionDialogProps = {
  open: boolean;
  onClose: () => void;
  onAgree?: () => void;
  title: string;
  content: string;
  closeText?: string;
  agreeText?: string;
  isIrreversible?: boolean;
};

const ActionDialog = (props: ActionDialogProps) => {
  const {
    open,
    onClose,
    onAgree,
    title,
    content,
    closeText = 'Cancel',
    agreeText = 'Confirm',
    isIrreversible = false
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleAgree = () => {
    onAgree?.();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
        {isIrreversible && (
          <Typography>
            <strong>This action is irreversible and cannot be undone.</strong>
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{closeText}</Button>
        <Button onClick={handleAgree}>{agreeText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
