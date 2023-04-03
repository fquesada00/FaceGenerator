import { useEffect, useState } from 'react';
import Setting from './Setting';
import SettingsSection from './SettingsSection';
import useSettingsApi from 'hooks/api/useSettingsApi';
import { toastError } from 'components/Toast';
import { useMutation, useQuery } from 'react-query';
import ApiError from 'services/api/Error';
import { IApiSettings } from 'services/api/models';

const GeneralSettingsSection = () => {
  const { getSettings, modifySettings } = useSettingsApi();
  const [settings, setSettings] = useState<IApiSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const {
    mutate: mutateModifySettings,
    isLoading: isLoadingModifySettings,
    data: newSettings
  } = useMutation(modifySettings, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  useEffect(() => {
    if (newSettings) {
      setSettings(newSettings);
    }
  }, [newSettings]);

  return (
    <SettingsSection title='General'>
      <Setting
        title='Generator'
        description='Turn on and off the Generator.'
        tooltip='The Generator is the feature that generates faces. If you turn it off, you will not be able to generate faces.'
        actionText={settings?.generator ? 'Turn off' : 'Turn on'}
        action={() => mutateModifySettings({ generator: !settings?.generator })}
        loading={isLoadingModifySettings || !settings}
      />
    </SettingsSection>
  );
};

export default GeneralSettingsSection;
