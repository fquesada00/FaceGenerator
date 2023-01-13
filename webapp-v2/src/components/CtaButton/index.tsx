import { LoadingButton } from "@mui/lab";
import clsx from "clsx";

import contentClasses from "components/Content/styles/Content.module.scss"

type CtaButtonProps = {
  onSubmit: () => void;
  label: string;
  className?: string;
  loading?: boolean;
}

const CtaButton = (props: CtaButtonProps) => {
  const { onSubmit, label, className, loading } = props;

  return (
    <div className={clsx(contentClasses.cta, className)}>
      <LoadingButton loading={loading} variant="contained" color="primary" fullWidth onClick={onSubmit}>
        {label}
      </LoadingButton>
    </div>
  );
}

export default CtaButton;