import clsx from "clsx";
import Images from "components/Images";
import { useMemo } from "react";
import { IApiFace } from "services/api/models";

type RenderImagesHookProps = {
  faces: IApiFace[] | undefined;
  className?: string;
}

const useRenderImages = (props: RenderImagesHookProps) => {
  const { faces, className } = props;

  const images = useMemo(() => {
    if (!faces) {
      return null;
    }

    return (
      <div className={clsx("mt-8", className)}>
        <Images faces={faces} />
      </div>
    );
  }, [faces, className])

  return { images };
};

export default useRenderImages;