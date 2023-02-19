import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useCallback, useMemo } from 'react';
import apiProvider, { API_PREFIX, FACES_API_PREFIX } from 'services/api';
import ApiError, { getErrorMessage } from 'services/api/Error';
import datasource from 'services/api/datasource';
import {
  ApiResponse,
  IApiFace,
  IApiFaceFeatures,
  IApiFaceFilters
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

  const getAllFaces = useCallback(
    async (filters: IApiFaceFilters): Promise<IApiFace[]> => {
      try {
        const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}`);
        return response.result;
      } catch (error) {
        throw new ApiError('Show all faces', getErrorMessage(error));
      }
    },
    [api]
  );

  const searchFaces = useCallback(
    async (filters: IApiFaceFilters): Promise<IApiFace[]> => {
      try {
        // filters to query param
        const query = new URLSearchParams();
        filters.tags?.forEach(tag => query.append('tags', tag));
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
    async (id: number) => {
      try {
        const response = await api.get<ApiResponse>(
          `${FACES_API_PREFIX}/${id}`
        );
        return response.result;
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
      fromId: number;
      toId: number;
      amount: number;
    }) => {
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
        // const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/image`,  { body:formData, headers:{ 'Content-Type': 'multipart/form-data' }});
        const response = await api.post<ApiResponse>(
          `http://localhost:5000/faces/image`,
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
    async ({ firstId, secondId }: { firstId: number; secondId: number }) => {
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
    async ({ id, metadata }: { id: number; metadata: Record<string, any> }) => {
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
      id: number;
      faceFeatures: IApiFaceFeatures;
    }): Promise<IApiFace> => {
      try {
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

  const getAllTags = useCallback(async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse>(`${API_PREFIX}/tags`);
      return response.result;
    } catch (error) {
      throw new ApiError('Get all tags', getErrorMessage(error));
    }
  }, [api]);

  return {
    generateFaces,
    getAllFaces,
    searchFaces,
    getFaceImage,
    generateTransitions,
    generateFaceFromImage,
    interchangeFacesFeatures,
    saveFace,
    modifyFaceFeatures,
    getAllTags
  };
};

export default useFacesApi;