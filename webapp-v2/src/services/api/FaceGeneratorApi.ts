import api, { FACES_API_PREFIX } from '.';
import ApiError, { getErrorMessage } from './Error';
import { ApiResponse } from './models';

export const generateFaces = async (amount: number) => {
  try {
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}`, { amount });
    return response.result;
  } catch (error) {
    throw new ApiError('Generate faces', getErrorMessage(error));
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

export const generateTransitions = async (fromId: number, toId: number, amount: number) => {
  try {
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/transitions`, { fromId, toId, amount });
    return response.result;
  } catch (error) {
    throw new ApiError('Generate transitions', getErrorMessage(error));
  }
};

export const generateFaceFromImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/image`, formData, { 'Content-Type': 'multipart/form-data' });
    return response.result;
  } catch (error) {
    throw new ApiError('Generate face from image', getErrorMessage(error));
  }
};

export const interchangeFacesFeatures = async (firstId: number, secondId: number) => {
  try {
    const response = await api.post<ApiResponse>(`${FACES_API_PREFIX}/interchange`, { firstId, secondId });
    return response.result;
  } catch (error) {
    throw new ApiError('Interchange faces features', getErrorMessage(error));
  }
};