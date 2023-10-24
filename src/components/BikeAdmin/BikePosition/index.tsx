import { useState } from 'react';
import { FormHelperText, TextField } from '@mui/material';
import { Bike } from '@/types';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { HStack, VStack } from '../common/styles';
import { GrayButton, PinkButton } from '../common/ActionButtons/styles';
import Image from "next/image";
import { BikeRow, Content, Description, Title } from '../BikeDashboard/styles';
import { useRouter } from 'next/router';
import GeneralModal from '@/components/common/GeneralModal';
import { H1Title, ImgUpdated } from '@/components/BookingWizard/UpdatedInsurancePlanModal/styles';

interface PositionPayload {
  bikeId: number;
  position: number; 
}

export function BikePositionUpdater({ 
  bikes,
}: {
  bikes: Bike[];
}) {
  const [positionPayloads, setPositionPayloads] = useState<PositionPayload[]>([]);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const goDashboard = () => {
    router.push('/admin/bike');
    setIsOpenAlert(false);
  }

  const handleChange = (e, bikeId: number) => {
    const { value } = e.target;
    setPositionPayloads(prevPositionPayloads => {
      const index = prevPositionPayloads.findIndex(payload => payload.bikeId === bikeId);
      if (index > -1) {
        const newPositionPayloads = [...prevPositionPayloads];
        newPositionPayloads[index].position = Number(value);
        return newPositionPayloads;
      }
      return [...prevPositionPayloads, {
        bikeId,
        position: Number(value)
      }];
    });
  };

  const onUpdate = () => {
    if (positionPayloads.length) {
      const token = localStorage.getItem("SESSION_ID");

      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bikes/position/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(positionPayloads)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200 || data.status === 201) {
            setIsSaving(false);
            setIsOpenAlert(true)
          } else {
            alert("An error occurred while update the bike positions.")
            setIsSaving(false);
          }
        })
        .catch(e => {
          alert("An exception occurred while update the bike positions.")
          setIsSaving(false);
          console.error(e);
        })
    }
  };

  return (
    <VStack>
      {bikes.map((bike, index) => (
        <BikeRow key={index}>
          <HStack>
            <Image 
              src={bike.featuredMediaItem.mediaUrl}
              alt={bike.featuredMediaItem.filename}
              key={`${bike.featuredMediaItem.mediaUrl}-${bike.featuredMediaItem.filename}`}
              quality={60}
              style={{ objectFit: 'cover', borderRadius: '10px' }}
              unoptimized
              width={80}
              height={75}
            />

            <Content>
              <div>
                <Title>{bike.name} - ${bike.regularPrice}/Day</Title>
                <Description>{bike.brand.name}</Description>
              </div>
            </Content>
          </HStack>
          <TextField 
            name="position"
            label="Position"
            type="number"
            style={{width: '100px'}}
            value={(positionPayloads.find(payload => payload.bikeId === bike.id)?.position) || bike.position}
            onChange={(e) => handleChange(e, bike.id)}
          />
        </BikeRow>
      ))}
      <HStack style={{justifyContent: 'center', marginTop: '27px', marginBottom: '40px'}}>
        <PinkButton className="pink" onClick={onUpdate} variant="contained">Save</PinkButton>
      </HStack>

      <GeneralModal open={isOpenAlert} onClose={() => setIsOpenAlert(false)}>
        <VStack style={{alignItems: 'center', padding: '70px 0'}} spacing="30px">
          <ImgUpdated src="/images/updated_icon.svg" alt="updated_icon" />
          <H1Title>{'Bike positions updated!'}</H1Title>
          <FormHelperText style={{marginTop: '-20px', fontSize: '16px'}}>{'The bike positions has been updated successfully'}.</FormHelperText>
          <PinkButton className="pink" onClick={goDashboard} variant="contained" style={{width: '195px'}}>Go To Bikes</PinkButton>
        </VStack>
      </GeneralModal>
    </VStack>
  );
}