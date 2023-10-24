import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";
import { Brand } from "@/types";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/BikeAdmin/common/LoadingSpinner";
import { BikeBrandDashboard } from "@/components/BikeBrandAdmin/BikeBrandDashboard";
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

function BrandAdmin() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // track whether the component is mounted
  
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseApiUrl}/brands?isAll=1`);
        const data = await response.json();
        if (isMounted) {
          setBrands(data.data);
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
        <BikeBrandDashboard brands={brands} />
      )}
    </BookingLayout>
  );
}

export default withAuth(BrandAdmin);
