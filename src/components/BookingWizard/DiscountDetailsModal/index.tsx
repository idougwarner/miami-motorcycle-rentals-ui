import GeneralModal from "@/components/common/GeneralModal";
import React from "react";
import { DivPricingWrapper, H3Title, PDescription } from "./styles";
import { BikeDiscountPercentage } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  bikePrice: number | undefined;
  bikeDiscountPercentage: BikeDiscountPercentage;
};

function DiscountDetailsModal({ open, onClose, bikePrice, bikeDiscountPercentage }: Props) {
  const discounts = [
    {
      label: "1 Day",
      value: bikePrice,
    },
    {
      label: `2 Days (${bikeDiscountPercentage?.two}% discount)`,
      value: (bikePrice! * (1 - (bikeDiscountPercentage?.two / 100))).toFixed(2),
    },
    {
      label: `3 Days (${bikeDiscountPercentage?.three}% discount)`,
      value: (bikePrice! * (1 - (bikeDiscountPercentage?.three / 100))).toFixed(2),
    },
    {
      label: `4 Days (${bikeDiscountPercentage?.four}% discount)`,
      value: (bikePrice! * (1 - (bikeDiscountPercentage?.four / 100))).toFixed(2),
    },
    {
      label: `+5 Days (${bikeDiscountPercentage?.five}% discount)`,
      value: (bikePrice! * (1 - (bikeDiscountPercentage?.five / 100))).toFixed(2),
    },
  ];

  return (
    <GeneralModal open={open} onClose={onClose}>
      <H3Title>Discount Details</H3Title>
      <PDescription>
        The longer your trip the greater your discount!
      </PDescription>

      <DivPricingWrapper className="pricing-header">
        <span>Rental Days (24-hour periods)</span>
        <span>Daily Rates</span>
      </DivPricingWrapper>

      {discounts.map((discount, idx) => (
        <DivPricingWrapper key={idx}>
          <span>{discount.label}</span>
          <span>${discount.value} / Day</span>
        </DivPricingWrapper>
      ))}
    </GeneralModal>
  );
}

export default DiscountDetailsModal;
