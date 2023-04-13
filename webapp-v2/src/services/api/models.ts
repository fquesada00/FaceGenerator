export type ApiResponse = {
  result: any;
  error: any;
};

export interface IApiFace {
  id: string;
  image: string;
}

export interface IApiFaceFeatures {
  age?: number;
  eyeDistance?: number;
  eyeEyebrowDistance?: number;
  eyeRatio?: number;
  eyesOpen?: number;
  gender?: number;
  lipRatio?: number;
  mouthOpen?: number;
  mouthRatio?: number;
  noseMouthDistance?: number;
  noseRatio?: number;
  noseTip?: number;
  pitch?: number;
  roll?: number;
  smile?: number;
  yaw?: number;
}

export interface IApiFaceFilters {
  tags?: string[];
}

export interface IApiFaceSerie {
  id: string;
  faces: IApiFace[];
}

export interface IApiAuth {
  accessToken: string;
  roles: number[];
}

export interface IApiFaceImage {
  url: string;
  blob: Blob;
}
