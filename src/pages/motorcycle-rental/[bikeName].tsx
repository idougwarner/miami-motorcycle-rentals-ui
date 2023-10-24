import BikeCarousel from "@/components/BikeCarousel";
import BikeDetail from "@/components/BikeDetail";
import BikeDetailHeader from "@/components/BikeDetailHeader";
import BookingBar from "@/components/BookingBar";
import { bikesSeo } from "@/constants/seo/bikes";
import { MarketingLayout } from "@/layout/MarketingLayout";
import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike, BikeDetail as BikeDetailType, BikeType, Brand } from "@/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo, NextSeoProps } from "next-seo";
import { useEffect } from "react";
interface IRentalPageProps {
  bikes: Bike[];
  brands: Brand[];
  bikeTypes: BikeType[];
  currentBike: BikeDetailType;
  seo: NextSeoProps;
}


function Rental({currentBike, bikeTypes, bikes, brands, seo}: IRentalPageProps) {
  const {
    selectedBikeMediaItems,
    setSelectedBikeId,
    setAllBikes,
    setAllBrands,
    setAllBikeTypes
  } = useMarketing() as MarketingContextType;

  useEffect(() => {
    setAllBikeTypes(bikeTypes);
    setAllBrands(brands);
    setAllBikes(bikes);
  }, []);

  useEffect(() => {
    if(currentBike) setSelectedBikeId(currentBike.id);
  }, [currentBike]);

  return (
    <>
      <NextSeo {...seo} />
      <MarketingLayout>
        <BikeCarousel mediaItems={selectedBikeMediaItems} />
        <BikeDetailHeader bike={currentBike} />
        <BookingBar bike={currentBike} />
        <BikeDetail bike={currentBike} />
      </MarketingLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {

  const currentBikeSlug = context?.params?.bikeName as string;
  
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

    // Get Current Bike
    const currentBikeBrief = allBikes.find(bike => bike.slug === currentBikeSlug);
    const currentBikeSEO = bikesSeo.find(bike => bike.slug === currentBikeSlug);

    const currentBikeRawResponse = await fetch(`${process.env.BASE_API_URL}/bikes/${currentBikeBrief?.id}`);
    const { data: currentBikeDetail }: { data: BikeDetailType } = await currentBikeRawResponse.json();
    
    if (!currentBikeDetail){  
       return {
         notFound: true
      }
    }

      return {
        props: {
          bikes: allBikes,
          brands: allBrands,
          bikeTypes: allBikeTypes,
          currentBike: currentBikeDetail,
          seo: currentBikeSEO?.seo || {}
        },
        revalidate: 100
    }
  }catch(error) {
    return {
      notFound: true
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const rawResponse = await fetch(`${process.env.BASE_API_URL}/bikes`);
  const {data: bikeResponse}: {data: Bike[]} = await rawResponse.json();
  const pathResponse = bikeResponse.map(bike => ({params: { bikeName: `/${bike.slug}` }}));
  return {
    paths: [...pathResponse],
    fallback: 'blocking'
  }
}

export default Rental;
