import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useCallback, useMemo } from 'react';
import apiProvider, { API_PREFIX, FACES_API_PREFIX } from 'services/api';
import ApiError, { getErrorMessage } from 'services/api/Error';
import datasource from 'services/api/datasource';
import {
  ApiResponse,
  IApiFace,
  IApiFaceFeatures,
  IApiFaceFilters,
  IApiFaceImage,
  IApiFaceSerie
} from 'services/api/models';

const useFacesApi = () => {
  const client = useAxiosPrivate();

  const api = useMemo(() => apiProvider(client), [client]);

  const generateFaces = useCallback(
    async (amount: number): Promise<IApiFace[]> => {
      try {
        const response = await api.get<ApiResponse>(
          `${FACES_API_PREFIX}/generate`,
          { query: { amount } }
        );
        return response.result;
      } catch (error) {
        throw new ApiError('Generate faces', getErrorMessage(error));
      }
    },
    [api]
  );

  const searchFaces = useCallback(
    async (filters: IApiFaceFilters): Promise<IApiFace[]> => {
      try {
        const query: { [key: string]: any } = {};
        if (filters.tags && filters.tags.length > 0) {
          query['tags'] = filters.tags.join(',');
        }

        const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}`, {
          query
        });
        return response.result;
      } catch (error) {
        throw new ApiError('Search faces', getErrorMessage(error));
      }
    },
    [api]
  );

  const getFaceImage = useCallback(
    async (id: string): Promise<IApiFaceImage> => {
      try {
        const response = await api.get<Blob>(
          `${FACES_API_PREFIX}/${id}/image`,
          {
            headers: { Accept: 'image/png' },
            responseType: 'blob'
          }
        );

        return {
          url: URL.createObjectURL(response),
          blob: response
        };
      } catch (error) {
        throw new ApiError('Get face', getErrorMessage(error));
      }
    },
    [api]
  );

  const generateTransitions = useCallback(
    async ({
      fromId,
      toId,
      amount
    }: {
      fromId: string;
      toId: string;
      amount: number;
    }): Promise<IApiFaceSerie> => {
      try {
        const response = await api.get<ApiResponse>(
          `${FACES_API_PREFIX}/transition`,
          { query: { from_id: fromId, to_id: toId, amount } }
        );
        return response.result;
      } catch (error) {
        throw new ApiError('Generate transitions', getErrorMessage(error));
      }
    },
    [api]
  );

  const generateFaceFromImage = useCallback(
    async (image: File): Promise<IApiFace> => {
      try {
        console.log(image);
        // await sleep(2000);
        // send image file
        const formData = new FormData();
        formData.append('image', image);
        const response = await api.post<ApiResponse>(
          `${FACES_API_PREFIX}/image`,
          { body: formData, headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.result;
        return datasource.faces[0];
      } catch (error) {
        throw new ApiError('Generate face from image', getErrorMessage(error));
      }
    },
    [api]
  );

  const interchangeFacesFeatures = useCallback(
    async ({ firstId, secondId }: { firstId: string; secondId: string }) => {
      try {
        // await sleep(2000);
        const response = await api.get<ApiResponse>(
          `${FACES_API_PREFIX}/interchange`,
          { query: { id1: firstId, id2: secondId } }
        );
        return response.result;
        return datasource.faces.slice(0, 2);
      } catch (error) {
        throw new ApiError(
          'Interchange faces features',
          getErrorMessage(error)
        );
      }
    },
    [api]
  );

  const saveFace = useCallback(
    async ({ id, metadata }: { id: string; metadata: Record<string, any> }) => {
      try {
        const response = await api.post<ApiResponse>(
          `${FACES_API_PREFIX}/${id}`,
          {
            body: JSON.stringify(metadata)
          }
        );
      } catch (error) {
        throw new ApiError('Save face', getErrorMessage(error));
      }
    },
    [api]
  );

  const modifyFaceFeatures = useCallback(
    async ({
      id,
      faceFeatures
    }: {
      id: string;
      faceFeatures: IApiFaceFeatures;
    }): Promise<IApiFace> => {
      try {
        if (id === '0') {
          throw new Error('Face id is missing');
        }
        // await sleep(2000);
        const response = await api.put<ApiResponse>(
          `${FACES_API_PREFIX}/${id}`,
          {
            body: faceFeatures
          }
        );
        return response.result;
        return datasource.faces[0];
      } catch (error) {
        throw new ApiError('Modify face', getErrorMessage(error));
      }
    },
    [api]
  );

  const getAllTags = useCallback(
    async (removeEmptyTag: boolean = false): Promise<string[]> => {
      try {
        const response = await api.get<ApiResponse>(`${API_PREFIX}/tags`);
        if (removeEmptyTag) {
          return response.result.filter((tag: string) => tag !== 'empty');
        }

        return response.result;
      } catch (error) {
        throw new ApiError('Get all tags', getErrorMessage(error));
      }
    },
    [api]
  );

  const saveFaceSerie = useCallback(
    async ({ id, metadata }: { id: string; metadata: Record<string, any> }) => {
      try {
        const response = await api.post<ApiResponse>(
          `${FACES_API_PREFIX}/series/${id}`,
          {
            body: JSON.stringify(metadata)
          }
        );
      } catch (error) {
        throw new ApiError('Save face serie', getErrorMessage(error));
      }
    },
    [api]
  );

  const getFacesSeries = useCallback(
    async (tags: string[]): Promise<IApiFaceSerie[]> => {
      try {
        const query: { [key: string]: any } = {};
        if (tags && tags.length > 0) {
          query['tags'] = tags.join(',');
        }

        const response = await api.get<ApiResponse>(
          `${FACES_API_PREFIX}/series`,
          { query }
        );
        return response.result;
      } catch (error) {
        throw new ApiError('Get faces series', getErrorMessage(error));
      }
    },
    [api]
  );

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
      await api.delete(`${API_PREFIX}/tags`);
    } catch (error) {
      throw new ApiError('Delete all tags', getErrorMessage(error));
    }
  }, [api]);

  const deleteFace = useCallback(
    async (id: string): Promise<void> => {
      try {
        await api.delete(`${FACES_API_PREFIX}/${id}`);
      } catch (error) {
        throw new ApiError('Delete face', getErrorMessage(error));
      }
    },
    [api]
  );

  const deleteSerie = useCallback(
    async (id: string): Promise<void> => {
      try {
        await api.delete(`${FACES_API_PREFIX}/series/${id}`);
      } catch (error) {
        throw new ApiError('Delete serie', getErrorMessage(error));
      }
    },
    [api]
  );

  return {
    generateFaces,
    searchFaces,
    getFaceImage,
    generateTransitions,
    generateFaceFromImage,
    interchangeFacesFeatures,
    saveFace,
    modifyFaceFeatures,
    getAllTags,
    saveFaceSerie,
    getFacesSeries,
    deleteAllFaces,
    deleteAllSeries,
    deleteAllTags,
    deleteFace,
    deleteSerie
  };
};

export default useFacesApi;
