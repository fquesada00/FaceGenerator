import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import clsx from 'clsx';
import ImagePicker from 'components/ImagePicker';
import { toastError } from 'components/Toast';
import useAutocompleteTags from 'hooks/useAutocompleteTags';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { IApiFaceFilters } from 'services/api/models';
import CtaButton from '..';
import useFacesApi from 'hooks/api/useFacesApi';
import CenteredCircularLoader from 'components/Loaders/CenteredCircularLoader';

type SelectedFace = {
  id?: string;
  url?: string;
};

type PickImageButtonProps = {
  onPick?: (selectedFace: SelectedFace) => void;
  onDone?: (selectedFace: SelectedFace) => void;
  onClose?: () => void;
  className?: string;
  pickedFaceId?: string;
};

const PickImageButton = (props: PickImageButtonProps) => {
  const { searchFaces } = useFacesApi();
  const { onPick, onDone, onClose, className, pickedFaceId } = props;

  const [open, setOpen] = useState(false);

  const { Autocomplete, selectedTags, isLoadingTags } = useAutocompleteTags({
    label: 'Search tags',
    allowUserInput: false
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    onClose?.();
    setOpen(false);
  };

  const reset = () => {
    setSelectedFace({});
    handleClose();
  };

  const [selectedFace, setSelectedFace] = useState<SelectedFace>({ id: pickedFaceId});

  const handlePick = (id: string, url?: string) => {
    onPick?.({ id, url });
    setSelectedFace({ id, url });
  };

  const handleDone = () => {
    onDone?.(selectedFace);
    handleClose();
  };

  const {
    mutate: mutateGetAllFaces,
    isLoading: isLoadingAllFaces,
    data: allFaces
  } = useMutation(searchFaces, {
    onError: error => {
      if (error instanceof ApiError && error.status !== 401) {
        toastError(error.toString());
      }
    }
  });

  useEffect(() => {
    if (open) {
      mutateGetAllFaces({
        tags: selectedTags
      } as IApiFaceFilters);
    }
  }, [open, selectedTags]);

  useEffect(() => {
    setSelectedFace({...selectedFace, id: pickedFaceId});
  }, [pickedFaceId]);

  const MemoizedImagePicker = useMemo(() => {
    if (!allFaces) return null;

    return (
      <ImagePicker
        faces={allFaces}
        onPick={handlePick}
        selectedFaceId={selectedFace?.id ?? null}
      />
    );
  }, [allFaces, selectedFace?.id]);

  return (
    <>
      <CtaButton
        onClick={handleClickOpen}
        label='Pick face'
        className={clsx('mt-2', className)}
      />
      <Dialog open={open}>
        <DialogTitle>Pick a face</DialogTitle>
        <DialogContent style={{ padding: '0.5rem' }}>
          <div className='flex mb-4 justify-center'>
            <div className='w-11/12 '>
              {!isLoadingAllFaces && !isLoadingTags && Autocomplete}
            </div>
          </div>
          {!isLoadingAllFaces && !isLoadingTags && MemoizedImagePicker}
          {isLoadingAllFaces && (
            <CenteredCircularLoader className='h-20 w-40' />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>Close</Button>
          <Button onClick={handleDone}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PickImageButton;
