import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useCallback, useMemo } from 'react';
import apiProvider, { API_PREFIX, FACES_API_PREFIX } from 'services/api';
import ApiError, { getErrorMessage } from 'services/api/Error';
import { ApiResponse, IApiSettings } from 'services/api/models';

type IApiSettingStatus = 'ON' | 'OFF';
const ApiSettingStatus = {
  ON: 'ON' as IApiSettingStatus,
  OFF: 'OFF' as IApiSettingStatus
};

type ApiSettings = {
  generator: IApiSettingStatus;
};

const useSettingsApi = () => {
  const client = useAxiosPrivate();

  const api = useMemo(() => apiProvider(client), [client]);

  const deleteAllFaces = useCallback(async (): Promise<void> => {
    try {
      await api.delete(`${FACES_API_PREFIX}`);
    } catch (error) {
      throw new ApiError('Delete all faces', getErrorMessage(error));
    }
  }, [api]);

  const deleteAllSeries = useCallback(async (): Promise<void> => {
    try {
      await api.delete(`${FACES_API_PREFIX}/series`);
    } catch (error) {
      throw new ApiError('Delete all series', getErrorMessage(error));
    }
  }, [api]);

  const deleteAllTags = useCallback(async (): Promise<void> => {
    try {
      await api.delete(`${FACES_API_PREFIX}/tags`);
    } catch (error) {
      throw new ApiError('Delete all tags', getErrorMessage(error));
    }
  }, [api]);

  const getSettings = useCallback(async (): Promise<IApiSettings> => {
    try {
      const response = await api.get<ApiResponse>(`${API_PREFIX}/settings`);

      return {
        generator:
          response.result.generator === ApiSettingStatus.ON ? true : false
      } satisfies IApiSettings;
    } catch (error) {
      throw new ApiError('Get settings', getErrorMessage(error));
    }
  }, [api]);

  const modifySettings = useCallback(
    async (settings: Partial<IApiSettings>): Promise<void> => {
      try {
        const body = {
          generator: settings.generator
            ? ApiSettingStatus.ON
            : ApiSettingStatus.OFF
        } satisfies ApiSettings;

        await api.patch(`${API_PREFIX}/settings`, { body });
      } catch (error) {
        throw new ApiError('Modify settings', getErrorMessage(error));
      }
    },
    [api]
  );

  return {
    deleteAllFaces,
    deleteAllSeries,
    deleteAllTags,
    getSettings,
    modifySettings
  };
};

export default useSettingsApi;
