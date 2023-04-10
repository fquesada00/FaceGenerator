import Setting from './Setting';
import SettingsSection from './SettingsSection';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { toastError } from 'components/Toast';
import useFacesApi from 'hooks/api/useFacesApi';

const FacesSettingsSection = () => {
  const { deleteAllFaces, deleteAllSeries, deleteAllTags } = useFacesApi();

  const { mutate: mutateDeleteAllFaces, isLoading: isLoadingDeleteAllFaces } =
    useMutation(deleteAllFaces, {
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  const { mutate: mutateDeleteAllSeries, isLoading: isLoadingDeleteAllSeries } =
    useMutation(deleteAllSeries, {
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  const { mutate: mutateDeleteAllTags, isLoading: isLoadingDeleteAllTags } =
    useMutation(deleteAllTags, {
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  return (
    <SettingsSection title='Faces and tags'>
      <Setting
        title='Faces'
        description='Delete all faces.'
        actionText='Delete'
        action={() => mutateDeleteAllFaces()}
        loading={isLoadingDeleteAllFaces}
        dialogTitle='Delete all faces'
        dialogContent='Are you sure you want to delete all faces? This action will remove all faces except from the series ones.'
        isIrreversible={true}
      />
      <Setting
        title='Series'
        description='Delete all series.'
        actionText='Delete'
        action={() => mutateDeleteAllSeries()}
        loading={isLoadingDeleteAllSeries}
        dialogTitle='Delete all series'
        dialogContent='Are you sure you want to delete all series?'
        isIrreversible={true}
      />
      <Setting
        title='Tags'
        description='Delete all tags.'
        actionText='Delete'
        action={() => mutateDeleteAllTags()}
        loading={isLoadingDeleteAllTags}
        dialogTitle='Delete all tags'
        dialogContent='Are you sure you want to delete all tags?'
        isIrreversible={true}
      />
    </SettingsSection>
  );
};

export default FacesSettingsSection;
