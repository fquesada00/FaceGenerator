import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import CtaButton from 'components/CtaButton';
import ContentHeader from 'components/ContentHeader';
import paths from 'routes/paths';
import { useMutation } from 'react-query';
import { toastError } from 'components/Toast';
import ApiError from 'services/api/Error';
import useRenderImages from 'hooks/useRenderImages';
import {
  searchFacesFormSchema,
  SearchFacesValues,
  initialValues
} from 'forms/searchFaces';
import FormikAutoCompleteTags from 'components/Inputs/formik/FormikAutoCompleteTags';
import useFacesApi from 'hooks/api/useFacesApi';
import searchFacesJson from 'assets/data/search_faces.json';

const SearchFaces: React.FC = () => {
  const { searchFaces } = useFacesApi();

  const [hideAll, setHideAll] = useState<boolean>(true);
  const [latestSearchedTags, setLatestSearchedTags] = useState<string[]>([]);

  const renderSubtitle = useMemo(
    () => (
      <div>
        {searchFacesJson.subtitle}
        <br />
        The results will be displayed below.
      </div>
    ),
    [searchFacesJson]
  );

  const {
    mutate: mutateSearchFaces,
    isLoading: isLoadingSearch,
    data: filteredFaces
  } = useMutation(searchFaces, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const onDelete = () => {
    if (!hideAll) {
      mutateGetAllFaces({});
    }

    if (latestSearchedTags.length > 0) {
      mutateSearchFaces({ tags: latestSearchedTags });
    }
  };

  const { images: SearchFacesImages } = useRenderImages({
    faces: filteredFaces,
    disableSave: true,
    onDelete
  });

  const {
    mutate: mutateGetAllFaces,
    isLoading: isLoadingShowAll,
    data: allFaces
  } = useMutation(searchFaces, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { images: AllFacesImages } = useRenderImages({
    faces: allFaces,
    disableSave: true,
    onDelete
  });

  const onShowAll = () => {
    if (!allFaces && hideAll) {
      mutateGetAllFaces({});
    }
    setHideAll(!hideAll);
  };

  const onSubmit = ({ tags }: SearchFacesValues) => {
    mutateSearchFaces({ tags });
  };

  return (
    <div>
      <ContentHeader
        title={paths.searchFaces.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={searchFacesFormSchema}
      >
        <Form>
          <div className={clsx(inputsClasses.container)}>
            <div className='flex justify-center'>
              <div className='w-11/12'>
                <FormikAutoCompleteTags name='tags' label='Search tags' />
              </div>
            </div>
            <CtaButton
              type='submit'
              label='Search'
              className='mt-8'
              loading={isLoadingSearch}
            />
            {!isLoadingSearch && filteredFaces && SearchFacesImages}
            <CtaButton
              onClick={onShowAll}
              label={`${!hideAll ? 'Hide' : 'Show'} all`}
              className='mt-4'
              loading={isLoadingShowAll}
            />
            {!hideAll && !isLoadingShowAll && AllFacesImages}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SearchFaces;
