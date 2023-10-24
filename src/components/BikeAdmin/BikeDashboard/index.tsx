import { Bike } from "@/types";
import { HStack, VStack, WhiteButton } from "../common/styles";
import Image from "next/image";
import { BikeRow, Content, Description, Title } from "./styles";
import { BikeAdminLayout } from "../BikeAdminLayout";
import { PinkButton } from "../common/ActionButtons/styles";
import { useRouter } from 'next/router';

export function BikeDashboard({
  bikes
} : {
  bikes: Bike[]
}) {
  const router = useRouter();

  const handleCreateNewClick = () => {
    router.push('/admin/bike/create');
  };

  const handleEditClick = (bikeId: number) => {
    router.push(`/admin/bike/edit/${bikeId}`);
  };

  return (
    <BikeAdminLayout title={`${bikes.length} Motorcycles`} style={{position: 'relative'}}>
      <PinkButton 
        className="pink" 
        style={{position: 'absolute', top: '10px', right: '20px'}}
        onClick={handleCreateNewClick}
      >
        Create New
      </PinkButton>
      <VStack spacing="0">
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
                width={160}
                height={150}
              />

              <Content>
                <div>
                  <Title>{bike.name} - ${bike.regularPrice}/Day</Title>
                  <Description>{bike.brand.name}</Description>
                </div>
                <div>
                  <Description>{bike.bikeBasePriceCount ? `Fixed prices on ${bike.bikeBasePriceCount} date ranges, ` : ''} {bike.insuranceCount} Insurance plans</Description>
                  <Description>{bike.rentalOrderCount ? bike.rentalOrderCount : 'Empty'} overall bookings</Description>
                </div>
              </Content>
            </HStack>
            <WhiteButton className='white' onClick={() => handleEditClick(bike.id)}>Edit</WhiteButton>
          </BikeRow>
        ))}
      </VStack>
    </BikeAdminLayout>
  )
}