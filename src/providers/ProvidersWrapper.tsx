import React from "react";
import { BookingProvider } from "./BookingProvider";
import { MarketingProvider } from "./MarketingProvider";

type Props = {
  children: any;
};

function ProvidersWrapper({ children }: Props) {
  return (
    <MarketingProvider>
      <BookingProvider>{children}</BookingProvider>
    </MarketingProvider>
  );
}

export default ProvidersWrapper;
