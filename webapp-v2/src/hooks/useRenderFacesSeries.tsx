import clsx from 'clsx';
import FaceSerie from 'components/Content/FacesSeries/components/FaceSerie';
import { useMemo } from 'react';
import { IApiFaceSerie } from 'services/api/models';

type RenderImagesHookProps = {
  faces: IApiFaceSerie[] | undefined;
  className?: string;
  collapseAll?: boolean;
  onDelete?: () => void;
};

const useRenderImages = (props: RenderImagesHookProps) => {
  const { faces, className, collapseAll = false, onDelete } = props;

  const FacesSeries = useMemo(() => {
    if (!faces) {
      return null;
    }

    return faces.map(serie => {
      return (
        <FaceSerie
          serie={serie}
          className={clsx(className)}
          collapse={collapseAll}
          key={serie.id}
          onDelete={onDelete}
        />
      );
    });
  }, [faces, className, collapseAll, onDelete]);

  return { FacesSeries, count: faces?.length || 0 };
};

export default useRenderImages;
