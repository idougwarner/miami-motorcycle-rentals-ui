import { getBikeByIdApi, getBikeMediaItemsApi } from "@/apis/marketingApis";
import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import StepperComponent from "@/components/BikeAdmin/Stepper";
import { DivLoadingBar } from "@/components/HomeBikeList/styles";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bike, BikeInsurance, MediaItem } from "@/types";
import { getInsuranceListApi } from "@/apis/adminApis";

function BikeEditAdmin() {
  const router = useRouter();
  const { id: bikeId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [bike, setBike] = useState<Bike>(null);
  const [galleryMediaItems, setGalleryMediaItems] = useState<MediaItem[]>(null);
  const [insurancePlans, setInsurancePlans] = useState<BikeInsurance[]>(null);
  
  useEffect(() => {
    if (bikeId) {
      setIsLoading(true);

      Promise.allSettled([
        getBikeByIdApi(Number(bikeId)),
        getBikeMediaItemsApi(Number(bikeId)),
        getInsuranceListApi(Number(bikeId))
      ]).then((results) => {

        const [bikeResult, mediaItemsResult, insurancePlansResult] = results;

        if (bikeResult.status === 'fulfilled') {
          setBike(bikeResult.value.data);
        } else {
          console.error(bikeResult.reason);
        }

        if (mediaItemsResult.status === 'fulfilled') {
          setGalleryMediaItems(mediaItemsResult.value.data);
        } else {
          console.error(mediaItemsResult.reason);
        }

        if (insurancePlansResult.status === 'fulfilled') {
          setInsurancePlans(insurancePlansResult.value.data.insurances);
        } else {
          console.error(insurancePlansResult.reason);
        }

        setIsLoading(false);
      });
    }
  }, [bikeId])

  return (
    <BookingLayout>
      {isLoading ? (
        <DivLoadingBar style={{display: 'flex', justifyContent: 'center'}}>
          <Image
            src="/images/spinner.gif"
            alt="logo"
            width={70}
            height={70}
            quality={100}
            loading="eager"
          />
        </DivLoadingBar>
      ) : (
        <BikeAdminLayout title="Edit Motorcycle">
          <StepperComponent bike={bike} galleryMediaItems={galleryMediaItems} insurancePlans={insurancePlans} />
        </BikeAdminLayout>
      )}
      
    </BookingLayout>
  )
}

export default withAuth(BikeEditAdmin);
