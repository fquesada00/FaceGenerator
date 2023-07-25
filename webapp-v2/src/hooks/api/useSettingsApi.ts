import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useCallback, useMemo } from 'react';
import apiProvider, { API_PREFIX } from 'services/api';
import ApiError, { getErrorMessage } from 'services/api/Error';
import { ApiResponse, IApiSettings } from 'services/api/models';

type IApiSettingStatus = 'ON' | 'OFF';
const ApiSettingStatus = {
  ON: 'ON' as IApiSettingStatus,
  OFF: 'OFF' as IApiSettingStatus
};

type ApiSettings = {
  generator: IApiSettingStatus;
  stableDiffusion: IApiSettingStatus;
};

const assignSetting = (setting: keyof ApiSettings, value: boolean | undefined, result: Partial<ApiSettings>) => {
  if (value === undefined) {
    return;
  }
  result[setting] = value ? ApiSettingStatus.ON : ApiSettingStatus.OFF;
};

const useSettingsApi = () => {
  const client = useAxiosPrivate();

  const api = useMemo(() => apiProvider(client), [client]);

  const getSettings = useCallback(async (): Promise<IApiSettings> => {
    try {
      const response = await api.get<ApiResponse>(`${API_PREFIX}/settings`);

      return {
        generator:
          response.result.generator === ApiSettingStatus.ON,
        stableDiffusion:
          response.result.stableDiffusion === ApiSettingStatus.ON
      } satisfies IApiSettings;
    } catch (error) {
      throw new ApiError('Get settings', getErrorMessage(error));
    }
  }, [api]);

  const modifySettings = useCallback(
    async (settings: Partial<IApiSettings>): Promise<IApiSettings> => {
      try {
        const body: ApiSettings = {} as ApiSettings;
        assignSetting('generator', settings.generator, body);
        assignSetting('stableDiffusion', settings.stableDiffusion, body);

        const response = await api.patch<ApiResponse>(
          `${API_PREFIX}/settings`,
          { body }
        );
        return {
          generator:
            response.result.generator === ApiSettingStatus.ON,
          stableDiffusion:
            response.result.stableDiffusion === ApiSettingStatus.ON
        } satisfies IApiSettings;
      } catch (error) {
        throw new ApiError('Modify settings', getErrorMessage(error));
      }
    },
    [api]
  );

  return {
    getSettings,
    modifySettings
  };
};

export default useSettingsApi;
