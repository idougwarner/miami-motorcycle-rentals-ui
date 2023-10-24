import { useFormik } from 'formik';  
import * as yup from 'yup';
import { 
  Button,
  TextField 
} from '@mui/material';
import { GalleryImagesUploader } from './ImageUploader';
import { BikeData } from '../Stepper';
import { useState } from 'react';

function GalleryImageForm(
  { setActiveStep, bikeData, setBikeData }: 
  { setActiveStep: (value: any) => void; bikeData: BikeData; setBikeData: (bikeData: BikeData) => void;}) 
{
  return (
    <GalleryImagesUploader setActiveStep={setActiveStep} bikeData={bikeData} setBikeData={setBikeData} />
  );
}

export default GalleryImageForm;