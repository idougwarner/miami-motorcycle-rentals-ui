import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import { BikeBrandEdit } from "@/components/BikeBrandAdmin/BikeBrandEdit";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { Brand } from "@/types";
import { useState } from "react";

const initValue: Brand = {
  name: '',
  slug: '',
  mediaItemId: null,
  mediaItem: null,
  isPopular: null,
  revision: ''
}

function BikeBrandCreate() {
  const [brand, setBrand] = useState<Brand>(initValue)

  return (
    <BookingLayout>
      <BikeAdminLayout title="Add New Brand">
        <BikeBrandEdit brand={brand} setBrand={setBrand} />
      </BikeAdminLayout>
    </BookingLayout>
  );
}

export default withAuth(BikeBrandCreate);
