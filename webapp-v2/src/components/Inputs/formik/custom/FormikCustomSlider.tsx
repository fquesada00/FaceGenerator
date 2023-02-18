import { Stack, Slider, Typography } from '@mui/material';
import {
  MAX_FEATURE_SLIDER_VALUE,
  MIDDLE_FEATURE_SLIDER_VALUE,
  MIN_FEATURE_SLIDER_VALUE,
  STEP_FEATURE_SLIDER_VALUE
} from 'constants';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useField } from 'formik';

interface FormikCustomSliderProps {
  name: string;
  title: string;
  LeftIcon?: React.ReactNode;
  RightIcon?: React.ReactNode;
  min?: number;
  max?: number;
  middle?: number;
  step?: number;
}

function FormikCustomSlider(props: FormikCustomSliderProps) {
  const {
    name,
    min = MIN_FEATURE_SLIDER_VALUE,
    middle = MIDDLE_FEATURE_SLIDER_VALUE,
    max = MAX_FEATURE_SLIDER_VALUE,
    step = STEP_FEATURE_SLIDER_VALUE,
    title,
    LeftIcon = <RemoveIcon />,
    RightIcon = <AddIcon />
  } = props;

  const [field, meta, helpers] = useField(name);

  return (
    <div className="w-48 m-2">
      <Typography gutterBottom sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        {LeftIcon}
        <Slider
          min={min}
          max={max}
          step={step}
          size="small"
          valueLabelDisplay="auto"
          defaultValue={middle}
          {...field}
        />
        {RightIcon}
      </Stack>
    </div>
  );
}

export default FormikCustomSlider;
