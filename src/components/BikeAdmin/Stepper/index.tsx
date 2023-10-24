import { useEffect, useState } from 'react';
import { BikeDetailAdmin } from '../BikeDetailAdmin';
import { OffDaysForm } from '../OffDays';
import { MuiStep, MuiStepLabel, MuiStepper, StepperWrapper } from './styles';
import { SubmitButtons } from '../common/ActionButtons';
import { GalleryImagesUploader, MediaItemProps } from '../GalleryImage/ImageUploader';
import { BasePricesForm } from '../BasePrices';
import BikeInsuranceTable from '../BikeInsuranceTable';
import { BikeInsurance, Bike, MediaItem, OffDay } from '@/types';
import { RelatedBike, RelatedBikesForm } from '../RelatedBikes';
import { BikePreview } from '../Preview';
import { parseDiscountPercentages } from '@/utils/helpers';
import { initBikeData } from '../constants';

export interface BikeDetails {
  id?: number,
  name: string,
  slug: string, 
  featuredMediaItemId: number,
  featuredMediaItem?: MediaItemProps,
  description: string,
  typeId: number,
  brandId: number,
  model: string,
  regularPrice: number,
  discountPrice: number,
  twoDaysDiscount: number,
  threeDaysDiscount: number,
  fourDaysDiscount: number,
  fiveDaysDiscount: number,
  distanceIncluded: string,
  highlights: string[],
  features: string[],
  extras: string[],
  status: string,
  position: number
}

export interface BasePrice {
  fromDate: string;
  fromTime: string;
  toDate: string; 
  toTime: string;
  pricePerDay: number;
}

export interface BikeData {
  bike: BikeDetails;
  galleryImageIds: number[];
  galleryMediaItems?: MediaItemProps[];
  offDays: OffDay[];
  basePrices: BasePrice[];
  insurancePlans: BikeInsurance[];
  relatedBikes: RelatedBike[];
}

function generateBikeData(response: Bike, galleryMediaItems: MediaItem[], insurancePlans: BikeInsurance[]): BikeData {
  const {
    id, 
    name, 
    slug, 
    featuredMediaItemId, 
    featuredMediaItem,
    description, 
    typeId, 
    brandId, 
    model, 
    regularPrice, 
    discountPrice, 
    highlights, 
    features, 
    extras, 
    distanceIncluded,
    status,
    position,
    discountPercentage,
    bikeOffDays,
    bikeBasePrices,
    relatedBikes,
  } = response;
  
  const galleryImageIds = galleryMediaItems.map(item => item.id);
  const discountPercentages = parseDiscountPercentages(discountPercentage)
  
  const bike: BikeDetails = {
    id,
    name,
    slug, 
    featuredMediaItemId,
    featuredMediaItem,
    description,
    typeId,
    brandId,
    model,
    regularPrice,
    discountPrice,
    twoDaysDiscount: discountPercentages.two,
    threeDaysDiscount: discountPercentages.three,
    fourDaysDiscount: discountPercentages.four,
    fiveDaysDiscount: discountPercentages.five,
    distanceIncluded,
    highlights,
    features,
    extras,
    status,
    position
  };
  
  const offDays: OffDay[] = bikeOffDays;
  const basePrices: BasePrice[] = bikeBasePrices;
  
  return {
    bike,
    galleryImageIds,
    galleryMediaItems,
    offDays,
    basePrices,
    insurancePlans,
    relatedBikes
  };
}

function StepperComponent({ 
  bike: bikeResponse,
  galleryMediaItems,
  insurancePlans,
}: { 
  bike?: Bike 
  galleryMediaItems?: MediaItem[]
  insurancePlans?: BikeInsurance[]
}) {
  const [activeStep, setActiveStep] = useState(-1);
  const [bikeData, setBikeData] = useState<BikeData>(null);

  useEffect(() => {
    setActiveStep(0);
  }, []);

  const steps = [
    'Bike',
    'Gallery Images',
    'Off Days',
    'Base Prices',
    'Insurance Plans',
    'Related Bikes',
  ];

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (bikeResponse) {
      const data = generateBikeData(bikeResponse, galleryMediaItems, insurancePlans);
      setBikeData(data);
    } else {
      setBikeData(initBikeData)
    }
  }, [bikeResponse])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BikeDetailAdmin setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData}>
            <SubmitButtons disableBack={activeStep === 0} onBack={handleBack} />
          </BikeDetailAdmin>
        );
      case 1:
        return (
          <GalleryImagesUploader setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
        );
      case 2:
        return (
          <OffDaysForm setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
        )
      case 3:
        return (
          <BasePricesForm setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
        )
      case 4:
        return(
          <BikeInsuranceTable setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
        );
      case 5:
        return (
          <RelatedBikesForm setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
        );
      default:
        return 'Just moment...';
    }
  };

  return (
    <StepperWrapper>
      {activeStep < steps.length && (
        <>
          <MuiStepper activeStep={activeStep}>
            {steps.map((label) => (
              <MuiStep key={label}>
                <MuiStepLabel></MuiStepLabel>
              </MuiStep>
            ))}
          </MuiStepper>
          <div>
            {(activeStep !== null) && getStepContent(activeStep)}
          </div>
        </>
      )}

      {activeStep === steps.length && <BikePreview bikeData={bikeData} setActiveStep={setActiveStep} editId={bikeResponse?.id} />}
    </StepperWrapper>
  );
}

export default StepperComponent;