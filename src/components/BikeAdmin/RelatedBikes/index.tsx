import React, { useState, useEffect } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel, FormHelperText } from '@mui/material';
import { Bike } from '@/types';
import { HStack, TitleOfStep } from '../common/styles';
import { GrayButton, PinkButton } from '../common/ActionButtons/styles';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { BikeData } from '../Stepper';
import { LoadingSpinner } from '../common/LoadingSpinner';
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export interface RelatedBike {
  relatedBikeId?: number,
  relatedBike?: Bike[]
}

export function RelatedBikesForm({ 
  setActiveStep, 
  bikeData,
  setBikeData
}: { 
  setActiveStep: (value: any) => void; 
  bikeData: BikeData;
  setBikeData: (bikeData: BikeData) => void;
}) {
  const [relatedBikes, setRelatedBikes] = useState<RelatedBike[]>(bikeData.relatedBikes);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    setIsLoading(true);
    fetch(`${baseApiUrl}/bikes`)
      .then(res => res.json())
      .then(data => {
        setBikes(data.data);

        // set default bikes by type if edit
        if (bikeData.bike.id && !bikeData.relatedBikes.length) {
          const featuredBikes: RelatedBike[] = bikeData.bike.typeId === 1 || bikeData.bike.typeId === 2
          ? data.data?.filter((item) => item.typeId === 6 && item.id !== bikeData.bike.id).map(bike => ({relatedBikeId: bike.id}))
          : data.data?.filter(
            (item) => item.typeId === bikeData.bike.typeId && item.id !== bikeData.bike.id
            ).map(bike => ({relatedBikeId: bike.id}));
            
          setRelatedBikes([
            ...featuredBikes
          ])
        }

        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bikeId = Number(e.target.value);
    const selectedBike = bikes.find((el) => el.id === bikeId);
    if (e.target.checked) {
      setRelatedBikes(prevRelatedBikes => [...prevRelatedBikes, {relatedBikeId: selectedBike.id}]);
    } else {
      setRelatedBikes(prevRelatedBikes => prevRelatedBikes.filter(relatedBike => relatedBike.relatedBikeId !== bikeId));
    }
  };

  const onNext = () => {
    setBikeData({
      ...bikeData,
      relatedBikes
    })
    setActiveStep(6);
  }

  return (
    <FormControl component="fieldset" style={{width: '100%'}}>
      <TitleOfStep>Related Bikes</TitleOfStep>
      {isLoading ? <LoadingSpinner/> : (
        <>
          {bikes.map(bike => (
            <FormControlLabel 
              key={bike.id}
              value={bike.id}
              control={<Checkbox checked={relatedBikes.some(relatedBike => relatedBike.relatedBikeId === bike.id)} onChange={handleChange} />} 
              label={bike.name}
            />
          ))}
          <HStack style={{justifyContent: 'center', marginTop: '27px', marginBottom: '40px'}}>
            <GrayButton className="gray" onClick={() => setActiveStep(4)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
            <PinkButton className="pink" onClick={onNext} variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>
          </HStack>
        </>
      )}
    </FormControl>
  ) 
}