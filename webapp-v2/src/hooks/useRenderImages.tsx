import clsx from "clsx";
import Images from "components/Images";
import { useMemo } from "react";
import { IApiFace } from "services/api/models";

type RenderImagesHookProps = {
  faces: IApiFace[] | undefined;
  className?: string;
  disableDownload?: boolean;
  disableSave?: boolean;
}

const useRenderImages = (props: RenderImagesHookProps) => {
  const { faces, className, disableDownload, disableSave } = props;

  const images = useMemo(() => {
    if (!faces) {
      return null;
    }

    return (
      <div className={clsx("mt-8", className)}>
        <Images faces={faces} disableDownload={disableDownload} disableSave={disableSave} />
      </div>
    );
  }, [faces, className])

  return { images, count: faces?.length || 0 };
};

export default useRenderImages;