import {
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import CtaButton from 'components/CtaButton';
import InfoIcon from '@mui/icons-material/Info';
import ActionDialog from 'components/ActionDialog';
import { useState } from 'react';

type SettingProps = {
  title: string;
  description?: string;
  tooltip?: string;
  actionText: string;
  action?: () => void;
  loading?: boolean;
  dialogTitle: string;
  dialogContent: string;
  isIrreversible?: boolean;
};

const Setting = (props: SettingProps) => {
  const {
    title,
    description,
    tooltip,
    actionText,
    action,
    loading,
    dialogTitle,
    dialogContent,
    isIrreversible
  } = props;

  const [open, setOpen] = useState<boolean>(false);

  const onOpenDialog = () => {
    setOpen(true);
  };

  const onCloseDialog = () => {
    setOpen(false);
  };

  const onAgreeDialog = () => {
    action?.();
    onCloseDialog();
  };

  return (
    <>
      <Paper elevation={2} className='py-2 px-6'>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='h6'>{title}</Typography>
              {tooltip && (
                <Tooltip title={tooltip}>
                  <IconButton>
                    <InfoIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <Typography variant='body1'>{description}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            justifyContent='center'
            direction='column'
            alignItems='center'
            container
          >
            <CtaButton
              label={actionText}
              onClick={onOpenDialog}
              loading={loading}
              color='error'
            />
          </Grid>
        </Grid>
      </Paper>
      <ActionDialog
        open={open}
        onClose={onCloseDialog}
        onAgree={onAgreeDialog}
        title={dialogTitle}
        content={dialogContent}
        isIrreversible={isIrreversible}
      />
    </>
  );
};

export default Setting;
