import { toastError } from 'components/Toast';
import { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import useFacesApi from './api/useFacesApi';
import useIsInViewport from './useIsInViewport';

type UseFaceImgLazyLoadingProps = {
  faceId?: string;
  rootMargin?: string;
};
const useFaceImgLazyLoading = (props: UseFaceImgLazyLoadingProps) => {
  const { faceId, rootMargin } = props;

  const { getFaceImage } = useFacesApi();

  const ref = useRef<HTMLDivElement | null>(null);
  const isInViewport = useIsInViewport({ element: ref, rootMargin });
  
  const {
    mutate: mutateGetFaceImage,
    isLoading: isLoadingGetFaceImage,
    data: faceImageUrl
  } = useMutation(getFaceImage, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(
          `Error getting face image with id ${faceId}. ${error.toString()}`
        );
      }
    }
  });

  useEffect(() => {
    if (isInViewport && faceId && !faceImageUrl) {
      mutateGetFaceImage(faceId);
    }
  }, [isInViewport, faceId, mutateGetFaceImage, faceImageUrl]);

  return {
    ref,
    faceImageUrl,
    isLoadingGetFaceImage
  };
};

export default useFaceImgLazyLoading;
