import { Bike, BikeType, Brand, MediaItem } from ".";

export type AllBikesResponse = {
  data: Bike[];
  status: number;
};

export type BikeResponse = {
  data: Bike;
  status: number;
};

export type BikeMediaItemsResponse = {
  data: MediaItem[];
  status: number;
};

export type AllTypesResponse = {
  data: BikeType[];
  status: number;
};

export type AllBrandsResponse = {
  data: Brand[];
  status: number;
};
