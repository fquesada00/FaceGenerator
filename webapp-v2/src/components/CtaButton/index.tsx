import { Button } from "@mui/material";
import clsx from "clsx";

import contentClasses from "components/Content/styles/Content.module.scss"

type CtaButtonProps = {
  onSubmit: () => void;
  label: string;
  className?: string;
}

const CtaButton = (props: CtaButtonProps) => {
  const { onSubmit, label, className } = props;

  return (
    <div className={clsx(contentClasses.cta, className)}>
      <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
        {label}
      </Button>
    </div>
  );
}

export default CtaButton;