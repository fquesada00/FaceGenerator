import { CircularProgress } from "@mui/material";
import clsx from "clsx";

type CenteredCircularLoaderProps = {
  className?: string;
};

const CenteredCircularLoader = (props: CenteredCircularLoaderProps) => {
  const { className } = props;

  return (
    <div
      className={clsx(className, "justify-center items-center flex" )}
    >
      <CircularProgress />
    </div>
  );
};

export default CenteredCircularLoader;