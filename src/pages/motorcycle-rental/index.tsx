import BikeList from "@/components/BikeList";
import BrandList from "@/components/BrandList";
import RentalBanner from "@/components/RentalBanner";
import TypeFilter from "@/components/TypeFilter";
import { MarketingLayout } from "@/layout/MarketingLayout";
import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike, BikeType, Brand } from "@/types";
import { NextSeo, NextSeoProps } from "next-seo";
import { useEffect } from "react";
export { getStaticProps } from "@/lib/ssr/common";
import HarleyDavidsonUltraInterceptorImage from '/public/images/bikes/harley-davidson-ultra-interceptor.webp';


const seo: NextSeoProps = {
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/motorcycle-rental`,
  title: 'Motorcycles For Rent | At Miami Motorcycle Rentals',
  description: 'Rent motorcycles for your next adventure. Explore a wide range of motorcycle rentals in Miami and Miami Beach.',
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'motorcycle rental, rent a motorcycle, rent motorcycle, motorcycle rentals, rental motorcycle'
    }
  ],
  
  openGraph: {
    locale: 'en_US',
    siteName: 'Miami Motorcycle Rentals',
    title: 'Motorcycles For Rent | At Miami Motorcycle Rentals',
    description: 'Rent motorcycles for your next adventure. Explore a wide range of motorcycle rentals in Miami and Miami Beach.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/motorcycle-rental`,
    images: [
      {
        url: HarleyDavidsonUltraInterceptorImage.src,
        alt: 'motorcycle-rental',
        width: 1200,
        height: 627
      }
    ]
  }
}  

interface IRentalPageProps {
  bikes: Bike[];
  brands: Brand[];
  bikeTypes: BikeType[];
}

function Rental({bikeTypes, bikes, brands}: IRentalPageProps) {
  const {
    bikesByType,
    selectedBikeTypeId,
    setAllBikes,
    setAllBrands,
    setAllBikeTypes
  } = useMarketing() as MarketingContextType;

  useEffect(() => {
    setAllBikes(bikes);
    setAllBrands(brands);
    setAllBikeTypes(bikeTypes);
  }, []);

  return (
    <>
      <NextSeo {...seo} />
      <MarketingLayout>
        <RentalBanner />
        <BikeList bikes={selectedBikeTypeId !== 0 ? bikesByType : bikes} />
        <TypeFilter />
        <BrandList />
      </MarketingLayout>
    </>
  );
}

export default Rental;

