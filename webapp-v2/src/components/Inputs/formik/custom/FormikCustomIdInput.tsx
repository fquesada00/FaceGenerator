import clsx from 'clsx';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import FormikIdInput from '../FormikIdInput';
import PreviewIcon from '@mui/icons-material/Preview';
import { Box, IconButton, Paper } from '@mui/material';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

type FormikCustomIdInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  url?: string;
};

function FormikCustomIdInput(props: FormikCustomIdInputProps) {
  const { required, label, name, url } = props;

  const [openPreview, setOpenPreview] = useState<boolean>(false);

  return (
    <div className={clsx(inputsClasses.field, 'relative')}>
      <FormikIdInput
        label={label}
        name={name}
        required={required}
        endAdornment={
          <IconButton onClick={() => url && setOpenPreview(!openPreview)}>
            <PreviewIcon />
          </IconButton>
        }
      />
      <Paper
        className={clsx(
          openPreview ? '' : 'hidden',
          'z-10',
          'h-40',
          'w-40',
          'absolute',
          'right-0'
        )}
        elevation={24}
      >
        <Box
          onClick={() => setOpenPreview(false)}
          sx={{
            backgroundColor: 'white',
            position: 'absolute',
            borderRadius: '50%'
          }}
          className='right-0 m-1 inline-flex'
        >
          <IconButton
            color='primary'
            sx={{ backgroundColor: 'white', padding: 0 }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
        <img
          src={url}
          style={{ width: 'inherit', height: 'inherit' }}
          className='rounded-md'
        />
      </Paper>
    </div>
  );
}

export default FormikCustomIdInput;
