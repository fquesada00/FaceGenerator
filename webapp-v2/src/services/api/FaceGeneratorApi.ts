import api from '.';
import ApiError, { getErrorMessage } from './Error';

const generateFaces = async (amount: number) => {
  try {
    const response = await api.post('/faces', { amount });
    return response;
  } catch (error) {
    throw new ApiError('Generate faces', getErrorMessage(error));
  }
};

const getFaceImage = async (id: number) => {
  try {
    const response = await api.get(`/faces/${id}/image`);
    return response;
  } catch (error) {
    throw new ApiError('Get face', getErrorMessage(error));
  }
};

const generateTransitions = async (fromId: number, toId: number, amount: number) => {
  try {
    const response = await api.post('/faces/transitions', { fromId, toId, amount });
    return response;
  } catch (error) {
    throw new ApiError('Generate transitions', getErrorMessage(error));
  }
};

const generateFaceFromImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.post('/faces/image', formData, { 'Content-Type': 'multipart/form-data' });
    return response;
  } catch (error) {
    throw new ApiError('Generate face from image', getErrorMessage(error));
  }
};

const interchangeFacesFeatures = async (firstId: number, secondId: number) => {
  try {
    const response = await api.post('/faces/interchange', { firstId, secondId });
    return response;
  } catch (error) {
    throw new ApiError('Interchange faces features', getErrorMessage(error));
  }
};

module.exports = {
  generateFaces,
  getFaceImage,
  generateTransitions,
  generateFaceFromImage,
  interchangeFacesFeatures
};