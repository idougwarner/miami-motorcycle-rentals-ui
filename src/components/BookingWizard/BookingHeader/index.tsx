import React, { useEffect, useState } from "react";
import { DivBookingHeaderContainer, ImgLogo, MenuItem, MenuWrapper } from "./styles";
import Router from "next/router";
import { useBooking } from "@/providers/BookingProvider";
import { BookingContextType } from "@/providers/types";
import Link from "next/link";
import { useRouter } from 'next/router'; 

function BookingHeader() {
  const router = useRouter();
  const { initializeBooking } = useBooking() as BookingContextType;
  const [activeMenu, setActiveMenu] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Function to determine the active menu item based on the URL
    const determineActiveMenu = () => {
      const pathSegments = router.asPath.split('/'); // Split the path into segments
      const menuSegment = pathSegments[2]; // Getting the second segment (e.g., 'bike' or 'brand')

      setActiveMenu(menuSegment); // Set the active menu based on the segment
    };

    const determineShowMenu = () => {
      const pathSegments = router.asPath.split('/'); // Split the path into segments
      const menuSegment = pathSegments[1]; // Getting the first segment

      setShowMenu(menuSegment === 'admin' && pathSegments[2] !== 'login');
    };

    determineActiveMenu();
    determineShowMenu();

    // Listen for route changes to re-determine the active menu
    router.events.on('routeChangeComplete', determineActiveMenu);

    // Clean up the listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', determineActiveMenu);
    };
  }, [router]);

  const takeMeHome = () => {
    Router.push("/");
    initializeBooking();
  };
  return (
    <DivBookingHeaderContainer>
      <ImgLogo
        onClick={takeMeHome}
        src="/images/miami_logo.png"
        alt="logo"
        width={160}
        height={50}
        quality={100}
        rel="dns-prefetch"
        priority
      />

      {showMenu && <MenuWrapper>
        <Link href={'/admin/brand'}>
          <MenuItem className={activeMenu === 'brand' ? 'active' : ''}>Brands</MenuItem>
        </Link>
        <Link href={'/admin/bike'}>
          <MenuItem className={activeMenu === 'bike' ? 'active' : ''}>Motorcycles</MenuItem>
        </Link>
      </MenuWrapper>}
    </DivBookingHeaderContainer>
  );
}

export default BookingHeader;
