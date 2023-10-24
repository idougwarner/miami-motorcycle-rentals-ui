import { BikeData } from '@/components/BikeAdmin/Stepper';
import { GalleryImagesUploader } from '@/components/BikeAdmin/GalleryImage/ImageUploader';

function GalleryImageForm(
  { setActiveStep, bikeData, setBikeData }: 
  { setActiveStep: (value: any) => void; bikeData: BikeData; setBikeData: (bikeData: BikeData) => void;}) 
{
  return (
    <GalleryImagesUploader setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
  );
}

export default GalleryImageForm;