import BikeCarousel from "@/components/BikeCarousel";
import { BikeData } from "../Stepper";
import { CarouselWrapper, Contents, DetailContents, DetailSubTitle, DetailTitle, DetailWrapper, Price, Title } from "./styles";
import { HStack, TitleOfStep, VStack } from "../common/styles";
import { DateDash, DateLabel } from "../Stepper/styles";
import { GrayButton, PinkButton } from "../common/ActionButtons/styles";
import { ArrowBack } from "@mui/icons-material";
import GeneralModal from "@/components/common/GeneralModal";
import { H1Title, ImgUpdated } from "@/components/BookingWizard/UpdatedInsurancePlanModal/styles";
import { useState } from "react";
import { FormHelperText } from "@mui/material";
import { useRouter } from "next/router";

const generateCreateBikePayload = (bikeData: BikeData) => {
  const {
    bike,
    galleryImageIds,
    offDays,
    basePrices,
    insurancePlans,
    relatedBikes
  } = bikeData;

  const payload = {
    bike: {
      name: bike.name,
      slug: bike.name.toLowerCase().replace(/ /g, '-'),
      featuredMediaItemId: bike.featuredMediaItem.id,
      description: bike.description,
      typeId: bike.typeId,
      brandId: bike.brandId,
      model: bike.model,
      regularPrice: bike.regularPrice,
      discountPrice: 0,
      discountPercentage: `{"two": ${bike.twoDaysDiscount}, "three": ${bike.threeDaysDiscount}, "four": ${bike.fourDaysDiscount}, "five": ${bike.fiveDaysDiscount}}`,
      distanceIncluded: bike.distanceIncluded,
      highlights: bike.highlights.join(','),
      features: bike.features.join(','),
      extras: bike.extras.join(','),
      status: bike.status,
      position: bike.position
    },
    galleryImageIds,
    offDays: offDays.map(offDay => ({
      fromDate: offDay.fromDate,
      fromTime: offDay.fromTime,
      toDate: offDay.toDate,
      toTime: offDay.toTime,
      description: offDay.description
    })),
    basePrices: basePrices.map(basePrice => ({
      fromDate: basePrice.fromDate,
      fromTime: basePrice.fromTime,
      toDate: basePrice.toDate,
      toTime: basePrice.toTime,
      pricePerDay: basePrice.pricePerDay
    })),
    insurancePlans: insurancePlans.map(plan => ({
      minAge: plan.minAge,
      maxAge: plan.maxAge,
      type: plan.type,
      dailyRate: plan.dailyRate,
      deposit: plan.deposit,
      description: plan.description,
      popUpDescription: plan.popUpDescription,
      id: plan?.id
    })),
    relatedBikes: relatedBikes.map(bike => ({
      relatedBikeId: bike.relatedBikeId
    }))
  };

  return payload;
}
  

export function BikePreview({
  bikeData,
  setActiveStep,
  editId
}: {
  bikeData: BikeData;
  setActiveStep: (value: any) => void;   
  editId: number;
}) {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const goDashboard = () => {
    router.push('/admin/bike');
    setIsOpenAlert(false);
  }

  const handleSave = () => {
    setIsSaving(true);
    const payload = generateCreateBikePayload(bikeData);

    const token = localStorage.getItem("SESSION_ID");

    // Create
    if (!editId) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bikes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200 || data.status === 201) {
            setIsSaving(false);
            setIsOpenAlert(true)
          } else {
            alert("An error occurred while create the bike.")
            setIsSaving(false);
          }
        })
        .catch(e => {
          alert("An exception occurred while create the bike.")
          setIsSaving(false);
          console.error(e);
        })
    } else { // update
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bikes/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200 || data.status === 201) {
            setIsSaving(false);
            setIsOpenAlert(true)
          } else {
            alert("An error occurred while update the bike.")
            setIsSaving(false);
          }
        })
        .catch(e => {
          alert("An exception occurred while update the bike.")
          setIsSaving(false);
          console.error(e);
        })
    }
  }

  return (
    <>
      <TitleOfStep>Preview</TitleOfStep>
      <CarouselWrapper style={{margin: '0 -260px'}}>
        <BikeCarousel mediaItems={bikeData.galleryMediaItems} /> 
      </CarouselWrapper>
      
      <Contents>
        <div>
          <Title>{bikeData.bike.name}</Title>
          <Price>${bikeData.bike.regularPrice}/Day</Price>

          <DetailWrapper style={{marginTop: '20px'}}>
            <DetailTitle>Description</DetailTitle>
            <DetailContents>
              <div dangerouslySetInnerHTML={{ __html: bikeData.bike.description }} />
            </DetailContents>
          </DetailWrapper>

          {bikeData.basePrices.map((price, index) => (
            <DetailWrapper key={index}>
              {index === 0 && <DetailTitle style={{marginBottom: '10px'}}>Fixed Prices on certain dates</DetailTitle>}
              <HStack>
                <div>
                  <DateLabel>
                    {price.fromDate} | {price.fromTime}<DateDash />
                  </DateLabel>
                  <DateLabel style={{marginTop: '5'}}>${price.pricePerDay}</DateLabel>
                </div>
                <DateLabel style={{marginLeft: '50px'}}>{price.toDate} | {price.toTime}</DateLabel>
              </HStack>
            </DetailWrapper>
          ))}

          {bikeData.insurancePlans.map((plan, index) => (
            <DetailWrapper key={index}>
              {index === 0 && <DetailTitle>Insurance Plans</DetailTitle>}
              <DetailSubTitle>{plan.type} Coverage - ${plan.dailyRate} / Day
                Charge
              </DetailSubTitle>
              <DetailContents>{plan.description}</DetailContents>
              <DetailContents>${plan.deposit} Deductible</DetailContents>
            </DetailWrapper>
          ))}
        </div>
      </Contents>

      <HStack style={{justifyContent: 'center', marginTop: '27px', marginBottom: '40px'}}>
        <GrayButton className="gray" onClick={() => setActiveStep(5)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
        <PinkButton className="pink" disabled={isSaving} variant="contained" onClick={handleSave}>{isSaving ? (editId ? 'Editing...' : 'Creating...') : (editId ? 'Edit' : 'Create')}</PinkButton>
      </HStack>

      <GeneralModal open={isOpenAlert} onClose={() => setIsOpenAlert(false)}>
        <VStack style={{alignItems: 'center', padding: '70px 0'}} spacing="30px">
          <ImgUpdated src="/images/updated_icon.svg" alt="updated_icon" />
          <H1Title>{editId ? 'Motorcycle Updated!' : 'New Motorcycle Created!'}</H1Title>
          <FormHelperText style={{marginTop: '-20px', fontSize: '16px'}}>{editId ? 'The motorcycle has been updated successfully' : 'The new motorcycle has been created successfully'}.</FormHelperText>
          <PinkButton className="pink" onClick={goDashboard} variant="contained" style={{width: '195px'}}>Go To Motorcycles</PinkButton>
        </VStack>
      </GeneralModal>
    </>
  )
}