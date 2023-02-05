import api, { FACES_API_PREFIX } from '.';
import ApiError, { getErrorMessage } from './Error';
import { ApiResponse, IApiFace, IApiFaceFeatures } from './models';
import datasource from './datasource';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateFaces = async (amount: number): Promise<IApiFace[]> => {
  try {
    //await sleep(2000);
    const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}/generate`, {query:{ 'amount':amount }});
    return response.result;
  } catch (error) {
    throw new ApiError('Generate faces', getErrorMessage(error));
  }
};

export const getAllFaces = async (): Promise<IApiFace[]> => {
  try {
    //await sleep(2000);
    const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}`);
    return response.result;
  } catch (error) {
    throw new ApiError('Show all faces', getErrorMessage(error));
  }
};

export const searchFacesBetweenIds = async ({ fromId, toId }: { fromId: number; toId: number }): Promise<IApiFace[]> => {
  try {
    //await sleep(2000);
     const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}/search`, { fromId, toId });
     return response.result;
    return datasource.faces;
  } catch (error) {
    throw new ApiError('Search faces', getErrorMessage(error));
  }
};

export const getFaceImage = async (id: number) => {
  try {
    const response = await api.get<ApiResponse>(`${FACES_API_PREFIX}/${id}/image`);
    return response.result;
  } catch (error) {
    throw new ApiError('Get face', getErrorMessage(error));
  }
};

export const buildImgSrc = (id: number) => `${FACES_API_PREFIX}/${id}/image`;

export const generateTransitions = async ({ fromId, toId, amount }: { fromId: number; toId: number; amount: number }) => {
  try {
    //await sleep(2000);
     const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/transitions`, { fromId, toId, amount });
     return response.result;
    return datasource.faces;
  } catch (error) {
    throw new ApiError('Generate transitions', getErrorMessage(error));
  }
};

export const generateFaceFromImage = async (image: File): Promise<IApiFace> => {
  try {
    //await sleep(2000);
    const formData = new FormData();
    formData.append('image', image);
     const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/image`, formData, { 'Content-Type': 'multipart/form-data' });
     return response.result;
    return datasource.faces[0];
  } catch (error) {
    throw new ApiError('Generate face from image', getErrorMessage(error));
  }
};

export const interchangeFacesFeatures = async ({ firstId, secondId }: { firstId: number; secondId: number }) => {
  try {
    //await sleep(2000);
     const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/interchange`, { firstId, secondId });
     return response.result;
    return datasource.faces.slice(0, 2);
  } catch (error) {
    throw new ApiError('Interchange faces features', getErrorMessage(error));
  }
};

export const saveFace = async (id: number) => {
  try {
    //await sleep(2000);
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/${id}/save`);
  } catch (error) {
    throw new ApiError('Save face', getErrorMessage(error));
  }
};

export const modifyFaceFeatures = async ({ id, faceFeatures }: { id: number, faceFeatures: IApiFaceFeatures }): Promise<IApiFace> => {
  try {
    //await sleep(2000);
     const response = await api.put<ApiResponse>(`${FACES_API_PREFIX}/${id}`, face);
     return response.result;
    return datasource.faces[0];
  } catch (error) {
    throw new ApiError('Modify face', getErrorMessage(error));
  }
}