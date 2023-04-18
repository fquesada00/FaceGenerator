import Setting from './Setting';
import SettingsSection from './SettingsSection';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { toastError, toastSuccess } from 'components/Toast';
import useFacesApi from 'hooks/api/useFacesApi';
import facesSettingsJson from 'assets/data/settings/faces_settings.json';
import { useMemo } from 'react';

const FacesSettingsSection = () => {
  const { deleteAllFaces, deleteAllSeries, deleteAllTags } = useFacesApi();

  const { mutate: mutateDeleteAllFaces, isLoading: isLoadingDeleteAllFaces } =
    useMutation(deleteAllFaces, {
      onSuccess(data, variables, context) {
        toastSuccess('All faces deleted successfully');
      },
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  const { mutate: mutateDeleteAllSeries, isLoading: isLoadingDeleteAllSeries } =
    useMutation(deleteAllSeries, {
      onSuccess(data, variables, context) {
        toastSuccess('All series deleted successfully');
      },
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  const { mutate: mutateDeleteAllTags, isLoading: isLoadingDeleteAllTags } =
    useMutation(deleteAllTags, {
      onSuccess(data, variables, context) {
        toastSuccess('All tags deleted successfully');
      },
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    });

  const facesData = useMemo(
    () => facesSettingsJson.settings.faces,
    [facesSettingsJson]
  );

  const seriesData = useMemo(
    () => facesSettingsJson.settings.series,
    [facesSettingsJson]
  );

  const tagsData = useMemo(
    () => facesSettingsJson.settings.tags,
    [facesSettingsJson]
  );

  return (
    <SettingsSection title={facesSettingsJson.title}>
      <Setting
        title={facesData.title}
        description={facesData.description}
        actionText={facesData.actionText}
        action={() => mutateDeleteAllFaces()}
        loading={isLoadingDeleteAllFaces}
        dialogTitle={facesData.dialog.title}
        dialogContent={facesData.dialog.content}
        isIrreversible={true}
      />
      <Setting
        title={seriesData.title}
        description={seriesData.description}
        actionText={seriesData.actionText}
        action={() => mutateDeleteAllSeries()}
        loading={isLoadingDeleteAllSeries}
        dialogTitle={seriesData.dialog.title}
        dialogContent={seriesData.dialog.content}
        isIrreversible={true}
      />
      <Setting
        title={tagsData.title}
        description={tagsData.description}
        actionText={tagsData.actionText}
        action={() => mutateDeleteAllTags()}
        loading={isLoadingDeleteAllTags}
        dialogTitle={tagsData.dialog.title}
        dialogContent={tagsData.dialog.content}
        isIrreversible={true}
      />
    </SettingsSection>
  );
};

export default FacesSettingsSection;
