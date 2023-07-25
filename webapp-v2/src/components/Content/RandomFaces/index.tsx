import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { Formik, Form } from 'formik';
import { MIN_FACES, MAX_FACES } from 'constants/constants';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import CtaButton from 'components/CtaButton';
import ContentHeader from 'components/ContentHeader';
import paths from 'routes/paths';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import { toastError } from 'components/Toast';
import useRenderImages from 'hooks/useRenderImages';
import FormikCustomAmountInput from 'components/Inputs/formik/custom/FormikCustomAmountInput';
import {
  randomFacesFormSchema,
  RandomFacesFormValues,
  initialValues
} from 'forms/randomFaces';
import useFacesApi from 'hooks/api/useFacesApi';
import { useTranslation } from 'react-i18next';

const RandomFaces: React.FC = () => {



  const inputRef = useRef<HTMLInputElement | null>(null);



  const { t } = useTranslation('randomFaces');
  const { generateFaces } = useFacesApi();

  const renderSubtitle = useMemo(
    () => (
      <div>
        {t('subtitle', { min: MIN_FACES, max: MAX_FACES })}
        <br />
        The results will be displayed below.
      </div>
    ),
    []
  );

  const {
    mutate: mutate,
    isLoading: isLoading,
    data: faces
  } = useMutation(generateFaces, {
    onError: error => {
      if (error instanceof ApiError && error.status !== 401) {
        toastError(error.toString());
      }
    }
  });

  const { images: FacesImages } = useRenderImages({
    faces,
    disableDelete: true
  });

  const onSubmit = (data: RandomFacesFormValues) => {
    mutate({ amount: data.randomFaces, referenceFace: data.referenceFace });
  };

  return (
    <div>
      <ContentHeader
        title={paths.randomFaces.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={randomFacesFormSchema}
      >{({ setFieldValue }) => (
        <Form>
          <div className={clsx(inputsClasses.container)}>
            <FormikCustomAmountInput name='randomFaces' />
            <br />
            <h2>Select file for face reference (optional)</h2>
            <input
              type='file'
              name='referenceFace'
              accept='image/jpeg, image/png'
              required={false}
              //className='hidden'
              onChange={() => {
                if (inputRef?.current?.files?.length === 0) {
                  return;
                }

                const file = inputRef?.current?.files?.[0] || null;
                setFieldValue('referenceFace', file);
              }}
              ref={inputRef}
            />
            <CtaButton
              type='submit'
              label='Generate'
              className='mt-12'
              loading={isLoading}
            />
            {!isLoading && FacesImages}
          </div>
        </Form>
      )}
      </Formik>
    </div>
  );
};

export default RandomFaces;
