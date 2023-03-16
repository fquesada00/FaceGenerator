import ContentHeader from 'components/ContentHeader';
import CtaButton from 'components/CtaButton';
import { toastError } from 'components/Toast';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import paths from 'routes/paths';
import ApiError from 'services/api/Error';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import FormikAutoCompleteTags from 'components/Inputs/formik/FormikAutoCompleteTags';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import useRenderFacesSeries from 'hooks/useRenderFacesSeries';
import {
  searchFacesSeriesFormSchema,
  SearchFacesSeriesValues,
  initialValues
} from 'forms/searchFacesSeries';
import useFacesApi from 'hooks/api/useFacesApi';
import facesSeriesJson from 'assets/data/faces_series.json';

const FacesSeries = () => {
  const { getFacesSeries } = useFacesApi();
  const [hideAll, setHideAll] = useState<boolean>(true);
  const [collapseAll, setCollapseAll] = useState<boolean>(false);

  const [collapseAllFiltered, setCollapseAllFiltered] =
    useState<boolean>(false);

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        {facesSeriesJson.subtitle}
        <br />
        The saved series will be displayed below.
      </div>
    );
  }, [facesSeriesJson]);

  const {
    mutate: mutateSearchFacesSeries,
    isLoading: isLoadingSearch,
    data: filteredFacesSeries
  } = useMutation(getFacesSeries, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { FacesSeries: FilteredFacesSeries } = useRenderFacesSeries({
    faces: filteredFacesSeries,
    className: 'mt-4',
    collapseAll: collapseAllFiltered
  });

  const onCollapseAllFiltered = () => {
    setCollapseAllFiltered(!collapseAllFiltered);
  };

  const {
    mutate: mutateGetAllFacesSeries,
    isLoading: isLoadingShowAll,
    data: allFacesSeries
  } = useMutation(getFacesSeries, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { FacesSeries } = useRenderFacesSeries({
    faces: allFacesSeries,
    className: 'mt-4',
    collapseAll
  });

  const onShowAll = () => {
    if (!allFacesSeries && hideAll) {
      mutateGetAllFacesSeries([]);
    }

    if (hideAll) {
      setCollapseAll(false);
    }

    setHideAll(!hideAll);
  };

  const onCollapseAll = () => {
    setCollapseAll(!collapseAll);
  };

  const onSubmit = ({ tags }: SearchFacesSeriesValues) => {
    mutateSearchFacesSeries(tags);
    setCollapseAllFiltered(false);
  };

  return (
    <div>
      <ContentHeader
        title={paths.facesSeries.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={searchFacesSeriesFormSchema}
      >
        <Form>
          <div className={clsx(inputsClasses.container)}>
            <div className='flex justify-center'>
              <div className='w-11/12'>
                <FormikAutoCompleteTags name='tags' label='Search tags' />
              </div>
            </div>
            <div className='flex mt-8'>
              <CtaButton
                type='submit'
                label='Search'
                loading={isLoadingSearch}
              />
              <CtaButton
                onClick={onCollapseAllFiltered}
                label={`${
                  collapseAllFiltered ? 'Expand' : 'Collapse'
                } all series`}
                className={clsx(
                  !isLoadingSearch && !filteredFacesSeries && 'hidden',
                  'w-48',
                  'ml-4'
                )}
                loading={isLoadingSearch}
              />
            </div>
            {!isLoadingSearch && filteredFacesSeries && FilteredFacesSeries}
            <div className='flex mt-4'>
              <CtaButton
                onClick={onShowAll}
                label={`${!hideAll ? 'Hide' : 'Show'} all`}
                loading={isLoadingShowAll}
              />
              <CtaButton
                onClick={onCollapseAll}
                label={`${collapseAll ? 'Expand' : 'Collapse'} all series`}
                className={clsx(hideAll && 'hidden', 'w-48', 'ml-4')}
                loading={isLoadingShowAll}
              />
            </div>
            {!hideAll && !isLoadingShowAll && FacesSeries}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default FacesSeries;
