import { RelatedBike } from "@/components/BikeAdmin/RelatedBikes";
import { BasePrice } from "@/components/BikeAdmin/Stepper";
import { type NextSeoProps } from "next-seo";
import { type StaticImageData } from "next/image";

export type SEOMeta = {

}

export type Blog = {
  category: string;
  title: string;
  image: {
    src: StaticImageData;
    alt: string;
  };
  overview: string;
  createdAt: string;
  updatedAt: string;
  contents: BlogContent[];
  seo: NextSeoProps;
};

export type BlogContent = {
  id?: string | null;
  title: string;
  descriptions: string[];
  image?: {
    src: StaticImageData;
    alt: string;
  };
  imageLink?: string;
  heading: "h1" | "h2" | "h3";
  isAck: boolean;
};

export type Brand = {
  createdAt?: Date;
  id?: number;
  mediaItemId: number;
  mediaItem: MediaItem;
  name: string;
  revision: string;
  slug: string;
  isPopular?: number;
  updatedAt?: Date;
};

export type BikeType = {
  id: number;
  mediaItemId: number;
  mediaItem: MediaItem;
  name: string;
  slug: string;
};

export type MediaItem = {
  alt: string;
  createdAt?: Date;
  filename: string;
  id: number;
  mediaUrl: string;
  mimeType: string;
  title: string;
  type: string;
  updatedAt?: Date;
  width: number;
  height: number;
};

export interface OffDay {
  fromDate: string;
  fromTime: string;
  toDate: string; 
  toTime: string;
  description: string;
}

export type Bike = {
  brand: Brand;
  brandId: number;
  typeId: number;
  discountPrice: number;
  featuredMediaItem: MediaItem;
  featuredMediaItemId: number;
  id: number;
  name: string;
  slug: string;
  model: string;
  regularPrice: number;
  highlights?: string[];
  description?: string;
  distanceIncluded?: string;
  features?: string[];
  extras?: string[];
  status?: string;
  position?: number;
  discountPercentage?: string;
  bikeOffDays?: OffDay[];
  bikeBasePrices: BasePrice[];
  relatedBikes: RelatedBike[],
  bikeBasePriceCount?: number;
  insuranceCount?: number;
  rentalOrderCount?: number;
};

export type BikeDiscountPercentage = {
  two: number, 
  three: number, 
  four: number, 
  five: number
};

export type BikeDetail = Bike & {
  seoTitle: string;
  seoDescription: string;
};
