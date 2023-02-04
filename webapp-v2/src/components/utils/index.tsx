import { IApiFace } from "services/api/models";

export const getFaceById = (faces: IApiFace[], id?: number) => {
  if (!id) return null;
  return faces.find((face) => face.id === id);
};