import BikeList from "@/components/BikeList";
import BrandHeader from "@/components/BrandHeader";
import RentalReason from "@/components/RentalReason";
import { brandsSeo } from "@/constants/seo/brands";
import { MarketingLayout } from "@/layout/MarketingLayout";
import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike, Brand } from "@/types";
import { convertTitleToLink } from "@/utils/helpers";
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, NextSeoProps } from "next-seo";
import { useEffect } from "react";

interface IBrandPageProps {
  currentBrand: Brand;
  bikes: Bike[];
  seo: NextSeoProps;
}

function BrandPage({currentBrand, bikes, seo}: IBrandPageProps) {
  const { allBikes, getAllBikes, getAllBikeTypes, getAllBrands } =
    useMarketing() as MarketingContextType;


  useEffect(() => {
    if (!allBikes) {
      getAllBikes();
      getAllBikeTypes();
      getAllBrands();
    }
    return () => {};
  }, []);

  return (
    <>
      <NextSeo
        {...seo}
        openGraph={{
          ...seo.openGraph,
          // I overwritten these images because, these were coming from endpoint, and our requirements was to use these images as openGraph image
          images: [
            { url: currentBrand.mediaItem.mediaUrl, alt: seo?.openGraph?.images?.[0]?.alt || currentBrand.name }
          ]
        }}
      />
    <MarketingLayout>
      <BrandHeader brand={currentBrand} />
      <BikeList bikes={bikes} />
      <RentalReason brand={currentBrand} />
    </MarketingLayout>
    </>
  );
}

export default BrandPage;



export const getStaticProps: GetStaticProps = async (context) => {

  const currentBrandSlug = context?.params?.brandName as string;
  try {

    const brandsRawResponse = await fetch(`${process.env.BASE_API_URL}/brands`);
    const {data: brandResponse}: {data: Brand[]} = await brandsRawResponse.json();

    const bikeRawResponse = await fetch(`${process.env.BASE_API_URL}/bikes`);
    const { data: bikeResponse }: { data: Bike[] } = await bikeRawResponse.json();

    const currentBrand = brandResponse.find(singleBrand => {
      const singleBrandSlug = `${convertTitleToLink(singleBrand.name).replace('cycles', 'cycle')}-rental-miami`;
      return currentBrandSlug === singleBrandSlug;
    })

    const brandSEO = brandsSeo.find(singleBrand => singleBrand.slug === currentBrandSlug);
    
    const filteredBikes = bikeResponse?.filter((bike) =>
      bike?.brand?.name?.includes(currentBrand?.name as string)
    );

    // If brand is not present, return not found to true
    if(!currentBrand) {
      return {
        notFound: true
      }
    }
    
    return {
      props: {
        currentBrand,
        bikes: filteredBikes || [],
        seo: brandSEO?.seo || {}
      },
      revalidate: 10
    }
  }catch(error) {
    return {
      notFound: true
    }
  }
}


export const getStaticPaths: GetStaticPaths = async (_context) => {

  const rawResponse = await fetch(`${process.env.BASE_API_URL}/brands`);
  const {data: brandResponse}: {data: Brand[]} = await rawResponse.json();

  const brandPathResponse = brandResponse.map(brand => ({ params: { brandName: `/${brand.name}` } }));
  
  return {
      paths: [...brandPathResponse],
      fallback: 'blocking'
    }
}