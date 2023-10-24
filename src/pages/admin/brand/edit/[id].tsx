import { getAllBrandsApi } from "@/apis/marketingApis";
import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import { LoadingSpinner } from "@/components/BikeAdmin/common/LoadingSpinner";
import { BikeBrandEdit } from "@/components/BikeBrandAdmin/BikeBrandEdit";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { Brand } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const initValue: Brand = {
  name: '',
  slug: '',
  mediaItemId: null,
  mediaItem: null,
  isPopular: null,
  revision: ''
}
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

function BikeBrandUpdate() {
  const router = useRouter();
  const { id: brandId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [brand, setBrand] = useState<Brand>(initValue);

  useEffect(() => {
    if (brandId) {
      setIsLoading(true);
      fetch(`${baseApiUrl}/brands/${brandId}`)
        .then(res => res.json())
        .then(data => {
          setBrand(data.data)
          setIsLoading(false);
        })
        .catch(e => {
          console.error(e)
          setIsLoading(false);
        });
    }
  }, [brandId])

  return (
    <BookingLayout>
      <BikeAdminLayout title="Add New Brand">
        {isLoading ? <LoadingSpinner /> : (
          <BikeBrandEdit brand={brand} setBrand={setBrand} editId={brandId as string} />
        )}
      </BikeAdminLayout>
    </BookingLayout>
  );
}

export default withAuth(BikeBrandUpdate);
