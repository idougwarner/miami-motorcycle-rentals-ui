import { BikeDashboard } from "@/components/BikeAdmin/BikeDashboard";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { Bike } from "@/types";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/BikeAdmin/common/LoadingSpinner";
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

function BikeAdmin() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // track whether the component is mounted
  
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseApiUrl}/bikes`);
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <BikeDashboard bikes={bikes} />
      )}
    </BookingLayout>
  );
}

export default withAuth(BikeAdmin);
