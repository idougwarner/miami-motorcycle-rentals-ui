import React from "react";
import {
  ButtonContinue,
  DivBookingBarContainer,
  DivButtonWrapper,
  DivPrice,
} from "./styles";
import { Bike } from "@/types";
// import Router from "next/router";
// import { useBooking } from "@/providers/BookingProvider";
// import { BookingContextType } from "@/providers/types";
import { currentPriceByDiscount, parseDiscountPercentages } from "@/utils/helpers";

type Props = {
  bike: Bike | undefined;
};

function BookingBar({ bike }: Props) {
  // const { initializeBooking } = useBooking() as BookingContextType;
  // const bookingLink = `/booking?bikeId=${bike?.id}`;
  // const onContinue = () => {
  //   Router.push(bookingLink);
  //   initializeBooking();
  // };

  return (
    <DivBookingBarContainer>
      <DivPrice>${currentPriceByDiscount(bike?.regularPrice, parseDiscountPercentages(bike?.discountPercentage)).toFixed(2)}/Day</DivPrice>
      <DivButtonWrapper>
        <ButtonContinue
          // onClick={onContinue}
          disabled={true}
        >Continue</ButtonContinue>
      </DivButtonWrapper>
    </DivBookingBarContainer>
  );
}

export default BookingBar;
