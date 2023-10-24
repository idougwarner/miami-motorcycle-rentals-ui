import { Brand } from "@/types";
import Image from "next/image";
import { BikeRow, Content, Description, Title } from "./styles";
import { useRouter } from 'next/router';
import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import { PinkButton } from "@/components/BikeAdmin/common/ActionButtons/styles";
import { HStack, VStack, WhiteButton } from "@/components/BikeAdmin/common/styles";
import Avatar from '@mui/material/Avatar';

export function BikeBrandDashboard({
  brands
} : {
  brands: Brand[]
}) {
  const router = useRouter();

  const handleCreateNewClick = () => {
    router.push('/admin/brand/create');
  };

  const handleEditClick = (bikeId: number) => {
    router.push(`/admin/brand/edit/${bikeId}`);
  };

  return (
    <BikeAdminLayout title={`${brands.length} Motorcycles`} style={{position: 'relative'}}>
      <PinkButton 
        className="pink" 
        style={{position: 'absolute', top: '10px', right: '20px'}}
        onClick={handleCreateNewClick}
      >
        Create New
      </PinkButton>
      <VStack spacing="0">
        {brands.map((brand, index) => (
          <BikeRow key={index}>
            <HStack>
              {brand.mediaItem ? (
                <Image 
                  src={brand.mediaItem?.mediaUrl}
                  alt={brand.mediaItem?.filename}
                  key={`${brand.mediaItem?.mediaUrl}-${brand.mediaItem?.filename}`}
                  quality={60}
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                  unoptimized
                  width={160}
                  height={150}
                />
              ) : (
                <Avatar
                  alt="Placeholder"
                  style={{
                    width: 160, 
                    height: 150, 
                    fontSize: 75,
                    backgroundColor: '#E0E0E0',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                  // Add a default icon within the Avatar if you prefer
                  // e.g., <IconName />
                >
                  N/A
                </Avatar>
              )}

              <Content>
                <div>
                  <Title>{brand.name}</Title>
                </div>
                <div>
                  <Description style={{maxWidth: '720px'}}>{brand.revision}</Description>
                </div>
              </Content>
            </HStack>
            <WhiteButton className='white' onClick={() => handleEditClick(brand.id)}>Edit</WhiteButton>
          </BikeRow>
        ))}
      </VStack>
    </BikeAdminLayout>
  )
}