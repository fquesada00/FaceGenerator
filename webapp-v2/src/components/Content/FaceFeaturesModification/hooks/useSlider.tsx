import { VolumeDown, VolumeUp } from "@mui/icons-material";
import { Stack, Slider, Typography } from "@mui/material";
import { MAX_FEATURE_SLIDER_VALUE, MIDDLE_FEATURE_SLIDER_VALUE, MIN_FEATURE_SLIDER_VALUE, STEP_FEATURE_SLIDER_VALUE } from "constants";
import { useMemo, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type useSliderProps = {
  min?: number;
  max?: number;
  middle?: number;
  step?: number;
  title: string;
  LeftIcon?: React.ReactNode;
  RightIcon?: React.ReactNode;
};

const useSlider = (props: useSliderProps) => {
  const { min = MIN_FEATURE_SLIDER_VALUE,
    middle = MIDDLE_FEATURE_SLIDER_VALUE,
    max = MAX_FEATURE_SLIDER_VALUE,
    step = STEP_FEATURE_SLIDER_VALUE,
    title,
    LeftIcon = <RemoveIcon />,
    RightIcon = <AddIcon />
  } = props;

  const [value, setValue] = useState(middle);

  const onChange = (e: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const CustomSlider = useMemo(() => {
    return (
      <div className="w-48 m-4">
        <Typography gutterBottom sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        {LeftIcon}
        <Slider value={value} onChange={onChange} min={min} max={max} step={step} size="small" valueLabelDisplay="auto" defaultValue={middle} />
        {RightIcon}
      </Stack>
      </div>
    );
  }, [value, setValue, RightIcon, LeftIcon]);

  return {
    value,
    CustomSlider
  };
};

export default useSlider;