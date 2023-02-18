import api, { FACES_API_PREFIX, API_PREFIX } from '.';
import ApiError, { getErrorMessage } from './Error';
import {
  ApiResponse,
  IApiFace,
  IApiFaceFeatures,
  IApiFaceFilters
} from './models';
import datasource from './datasource';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateFaces = async (amount: number): Promise<IApiFace[]> => {
  try {
    const response = await api.get<ApiResponse>(
      `${FACES_API_PREFIX}/generate`,
      { query: { amount } }
    );
    return response.result;
  } catch (error) {
    throw new ApiError('Generate faces', getErrorMessage(error));
  }
};

export const getAllFaces = async (
  filters: IApiFaceFilters
): Promise<IApiFace[]> => {
  try {
    const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}`);
    return response.result;
  } catch (error) {
    throw new ApiError('Show all faces', getErrorMessage(error));
  }
};

export const searchFaces = async (
  filters: IApiFaceFilters
): Promise<IApiFace[]> => {
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
};

export const getFaceImage = async (id: number) => {
  try {
    const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}/${id}`);
    return response.result;
  } catch (error) {
    throw new ApiError('Get face', getErrorMessage(error));
  }
};

export const generateTransitions = async ({
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
};

export const generateFaceFromImage = async (image: File): Promise<IApiFace> => {
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
};

export const interchangeFacesFeatures = async ({
  firstId,
  secondId
}: {
  firstId: number;
  secondId: number;
}) => {
  try {
    // await sleep(2000);
    const response = await api.get<ApiResponse>(
      `${FACES_API_PREFIX}/interchange`,
      { query: { id1: firstId, id2: secondId } }
    );
    return response.result;
    return datasource.faces.slice(0, 2);
  } catch (error) {
    throw new ApiError('Interchange faces features', getErrorMessage(error));
  }
};

export const saveFace = async ({
  id,
  metadata
}: {
  id: number;
  metadata: Record<string, any>;
}) => {
  try {
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/${id}`, {
      body: JSON.stringify(metadata)
    });
  } catch (error) {
    throw new ApiError('Save face', getErrorMessage(error));
  }
};

export const modifyFaceFeatures = async ({
  id,
  faceFeatures
}: {
  id: number;
  faceFeatures: IApiFaceFeatures;
}): Promise<IApiFace> => {
  try {
    // await sleep(2000);
    const response = await api.put<ApiResponse>(`${FACES_API_PREFIX}/${id}`, {
      body: faceFeatures
    });
    return response.result;
    return datasource.faces[0];
  } catch (error) {
    throw new ApiError('Modify face', getErrorMessage(error));
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    const response = await api.get<ApiResponse>(`${API_PREFIX}/tags`);
    return response.result;
  } catch (error) {
    throw new ApiError('Get all tags', getErrorMessage(error));
  }
};
