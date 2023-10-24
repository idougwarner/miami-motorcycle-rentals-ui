import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import { BikePositionUpdater } from "@/components/BikeAdmin/BikePosition";
import { LoadingSpinner } from "@/components/BikeAdmin/common/LoadingSpinner";
import { BikeBrandEdit } from "@/components/BikeBrandAdmin/BikeBrandEdit";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { Bike, Brand } from "@/types";
import { useEffect, useState } from "react";

function BikePositionEdit() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // track whether the component is mounted
  
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bikes`);
        const data = await response.json();
        if (isMounted) {
          setBikes(data.data);
          setLoading(false);
        }
      } catch (error) {
        // Handle error case here
        console.error("Failed to fetch bikes:", error);
        setLoading(false);
      }
    };
  
    fetchBikes();
  
    // Cleanup function
    return () => {
      isMounted = false; // set it to false if the component unmounts
    };
  }, []);

  return (
    <BookingLayout>
      <BikeAdminLayout title="Edit Bike Positions">
        {isLoading ? <LoadingSpinner /> : <BikePositionUpdater bikes={bikes}/>}
      </BikeAdminLayout>
    </BookingLayout>
  );
}

export default withAuth(BikePositionEdit);
