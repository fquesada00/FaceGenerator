export type ApiResponse = {
  result: any;
  error: any;
};

export interface IApiFace {
  id: number;
  image: string;
}

export interface IApiFaceFeatures {
  age?: number;
  gender?: number;
  orientation: {
    vertical?: number;
    horizontal?: number;
  };
  eyes: {
    distance?: number;
    distanceToEyeBrows?: number;
    ratio?: number;
    open?: number;
    roll?: number;
  };
  mouth: {
    open?: number;
    smile?: number;
    ratio?: number;
    lipRatio?: number;
  };
  nose: {
    distanceToMouth?: number;
    ratio?: number;
    tip?: number;
  };
}

export interface IApiFaceFilters {
  tags?: string[];
}
