import { LoadingButton } from '@mui/lab';
import clsx from 'clsx';

import contentClasses from 'components/Content/styles/Content.module.scss';

type CtaButtonProps = {
  onClick?: () => void;
  label: string;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

function CtaButton(props: CtaButtonProps) {
  const { onClick, label, className, loading, type } = props;

  return (
    <div className={clsx(contentClasses.cta, className)}>
      <LoadingButton
        loading={loading}
        variant="contained"
        color="primary"
        fullWidth
        onClick={onClick}
        type={type}
      >
        {label}
      </LoadingButton>
    </div>
  );
}

export default CtaButton;
