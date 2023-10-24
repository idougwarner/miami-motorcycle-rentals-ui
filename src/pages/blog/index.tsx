import BlogLanding from "@/components/BlogLanding";
import { MarketingLayout } from "@/layout/MarketingLayout";
import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike, BikeType, Brand } from "@/types";
import { NextSeo, NextSeoProps } from "next-seo";
import { useEffect } from 'react';
import BlogBackgroundImage from '/public/images/blog_landing_bg.webp'

export { getStaticProps } from "@/lib/ssr/common";


const seoTitle = "Motorcycle Rentals Blog";
const seoDescription =
  "Explore our blog for the latest information on motorcycle rentals, trails, and industry happenings in Miami and Miami Beach.";
const seoKeywords =
  "motorcycle rentals, motorcycle rentals blog, motorcycle trails, industry happenings, Miami, Miami Beach";


const seo: NextSeoProps = {
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  title: 'Motorcycle Blog | For All Motorcycle Enthusiasts To Enjoy',
  description: 'We help you be well informed with the best motorcycle rides to explore Florida, local things to do, tips and tricks, and industry happenings. ',
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'bikers blogs, motorcycle blog, motorcycle blogs, best motorcycle blogs, biker blog, motorcycle trip blogs'
    }
  ],
  
  openGraph: {
    locale: 'en_US',
    siteName: 'Miami Motorcycle Rentals',
    title: 'Motorcycle Blog | For All Motorcycle Enthusiasts To Enjoy',
    description: 'We help you be well informed with the best motorcycle rides to explore Florida, local things to do, tips and tricks, and industry happenings. ',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    images: [
      {
        url: BlogBackgroundImage.src,
        alt: 'motorcycle-blogs-for-bikers',
        width: 1200,
        height: 627
      }
    ]
  }
}

interface IBlogPageProps {
  bikes: Bike[];
  brands: Brand[];
  bikeTypes: BikeType[];
}

function BlogPage({bikeTypes, bikes, brands}: IBlogPageProps) {

  const {
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
      <NextSeo  {...seo}/>
    <MarketingLayout>
      <BlogLanding />
    </MarketingLayout>
    </>
  );
}

export default BlogPage;
