import useSettingsApi from 'hooks/api/useSettingsApi';
import Setting from './Setting';
import SettingsSection from './SettingsSection';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { toastError } from 'components/Toast';

const FacesSettingsSection = () => {
  const { deleteAllFaces, deleteAllSeries, deleteAllTags } = useSettingsApi();

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
      />
      <Setting
        title='Series'
        description='Delete all series.'
        actionText='Delete'
        action={() => mutateDeleteAllSeries()}
        loading={isLoadingDeleteAllSeries}
      />
      <Setting
        title='Tags'
        description='Delete all tags.'
        actionText='Delete'
        action={() => mutateDeleteAllTags()}
        loading={isLoadingDeleteAllTags}
      />
    </SettingsSection>
  );
};

export default FacesSettingsSection;
