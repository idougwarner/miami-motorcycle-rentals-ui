"use client";

import HomeBikeList from "@/components/HomeBikeList";
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import LogoImage from '/public/logo.png';


const BlogList = dynamic(() => import('@/components/BlogList'))
const BookingService = dynamic(() => import("@/components/BookingService"));
const RentalService = dynamic(() => import("@/components/RentalService"));
const BrandList = dynamic(() => import("@/components/BrandList"));
const CategoryList = dynamic(() => import("@/components/CategoryList"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FeaturedBikeList = dynamic(() => import("@/components/FeaturedBikeList"));


import { MarketingLayout } from "@/layout/MarketingLayout";
import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike, BikeType, Brand } from "@/types";
import { NextSeo, NextSeoProps } from "next-seo";
import { useEffect } from "react";

interface HomeProps {
  bikes: Bike[];
  brands: Brand[];
  bikeTypes: BikeType[];
}

const seo: NextSeoProps = {
  canonical: process.env.NEXT_PUBLIC_SITE_URL,
  title: 'Miami Motorcycle Rentals | #1 For Affordable Motorcycle Rentals',
  description: 'Motorcycle Rentals in Miami, FL. Rent a Harley, BMW, And More Conveniently Online in Under Five Minutes. Rates As Low As $40/day.',
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'miami motorcycle rentals, motorcycle rentals near me, motorcycle rental miami, rent motorcycle miami, motorcycle rentals, rent a motorcycle in miami'
    }
  ],
  
  openGraph: {
    locale: 'en_US',
    siteName: 'Miami Motorcycle Rentals',
    title: 'Miami Motorcycle Rentals | #1 For Affordable Motorcycle Rentals',
    description: 'Motorcycle Rentals in Miami, FL. Rent a Harley, BMW, And More Conveniently Online in Under Five Minutes. Rates As Low As $40/day.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: LogoImage.src,
        alt: 'miami-motorcycle-rentals-company-logo',
        width: 500,
        height: 500
      }
    ]
  }
}

export default function Home({bikes, bikeTypes, brands }: HomeProps) {
  const { setAllBikes, setAllBrands, setAllBikeTypes } =
    useMarketing() as MarketingContextType;
  
  useEffect(() => {
    setAllBikeTypes(bikeTypes);
    setAllBrands(brands);
    setAllBikes(bikes);
  }, []);
  
  return (
    <>
    <NextSeo {...seo} />
    <MarketingLayout allBrands={brands || []} >
      <HomeBikeList initialBikes={bikes} />
      <BookingService />
      <RentalService />
      <FeaturedBikeList />
      <CategoryList />
      <Testimonials />
      <BrandList />
      <BlogList />
    </MarketingLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (_context) => {
  try {
    const bikesUrl = `${process.env.BASE_API_URL}/bikes`;
    const brandsUrl = `${process.env.BASE_API_URL}/brands`;
    const bikeTypesUrl = `${process.env.BASE_API_URL}/types`;

    const [bikeRawResponse, brandsRawResponse, bikeTypesRawResponse] =
      await Promise.all([
        fetch(bikesUrl),
        fetch(brandsUrl),
        fetch(bikeTypesUrl),
      ]);

    const [bikeData, brandsData, bikeTypesData] = await Promise.all([
      bikeRawResponse.json(),
      brandsRawResponse.json(),
      bikeTypesRawResponse.json(),
    ]);

    const allBikes = bikeData.data as Bike[];
    const allBrands = brandsData.data as Brand[];
    const allBikeTypes = bikeTypesData.data as BikeType[];

      return {
        props: {
            bikes: allBikes,
            brands: allBrands,
            bikeTypes: allBikeTypes
        },
        revalidate: 100
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}