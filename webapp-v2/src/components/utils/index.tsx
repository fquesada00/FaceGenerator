import { IApiFace } from "services/api/models";

export const MIN_FACES = 1;
export const MAX_FACES = 10;

export const getFaceById = (faces: IApiFace[], id?: number) => {
  if (!id) return null;
  return faces.find((face) => face.id === id);
};