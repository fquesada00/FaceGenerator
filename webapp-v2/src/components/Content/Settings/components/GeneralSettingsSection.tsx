import { useEffect, useMemo, useState } from 'react';
import Setting from './Setting';
import SettingsSection from './SettingsSection';
import useSettingsApi from 'hooks/api/useSettingsApi';
import { toastError } from 'components/Toast';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { IApiSettings } from 'services/api/models';
import generalSettingsJson from 'assets/data/settings/general_settings.json';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const GeneralSettingsSection = () => {
  const { getSettings, modifySettings } = useSettingsApi();
  const [settings, setSettings] = useState<IApiSettings>();

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

  const generatorData = useMemo(
    () => generalSettingsJson.settings.generator,
    [generalSettingsJson]
  );

  const stableDiffusionData = useMemo(
    () => generalSettingsJson.settings.stableDiffusion,
    [generalSettingsJson]
  );

  return (
    <SettingsSection title={generalSettingsJson.title}>
      <Setting
        title={generatorData.title}
        description={generatorData.description}
        tooltip={generatorData.tooltip}
        actionText={
          settings?.generator
            ? generatorData.actionText.off
            : generatorData.actionText.on
        }
        action={() =>
          mutateModifySettings({
            generator: !settings?.generator,
            stableDiffusion: !settings?.generator
              ? false
              : settings?.stableDiffusion
          })
        }
        loading={isLoadingModifySettings || !settings}
        dialogTitle={
          settings?.generator
            ? generatorData.dialog.title.off
            : generatorData.dialog.title.on
        }
        dialogContent={
          settings?.generator
            ? generatorData.dialog.content.off
            : generatorData.dialog.content.on
        }
        ctaColor={settings?.generator ? 'error' : 'primary'}
      />
      <Setting
        title={stableDiffusionData.title}
        description={stableDiffusionData.description}
        tooltip={stableDiffusionData.tooltip}
        actionText={
          settings?.stableDiffusion
            ? stableDiffusionData.actionText.off
            : stableDiffusionData.actionText.on
        }
        action={() =>
          mutateModifySettings({
            stableDiffusion: !settings?.stableDiffusion,
            generator: !settings?.stableDiffusion ? false : settings?.generator
          })
        }
        loading={isLoadingModifySettings || !settings}
        dialogTitle={
          settings?.stableDiffusion
            ? stableDiffusionData.dialog.title.off
            : stableDiffusionData.dialog.title.on
        }
        dialogContent={
          settings?.stableDiffusion
            ? stableDiffusionData.dialog.content.off
            : stableDiffusionData.dialog.content.on
        }
        ctaColor={settings?.stableDiffusion ? 'error' : 'primary'}
        complimentaryAction={() => console.log('Try it out')}
        complimentaryActionIcon={<OpenInNewIcon />}
      />
    </SettingsSection>
  );
};

export default GeneralSettingsSection;
