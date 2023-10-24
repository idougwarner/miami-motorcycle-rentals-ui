import React, { useEffect } from "react";
import ActionBar from "@/components/BookingWizard/ActionBar";
import BookingProgressBar from "@/components/BookingWizard/BookingProgressBar";
import BookingRegister from "@/components/BookingWizard/BookingRegister";
import ReviewPayment from "@/components/BookingWizard/ReviewPayment";
import SelectDamageCoverage from "@/components/BookingWizard/SelectDamageCoverage";
import SelectGearAccessory from "@/components/BookingWizard/SelectGearAccessory";
import SelectPickupDropTime from "@/components/BookingWizard/SelectPickupDropTime";
import SelectRoadsideAssistance from "@/components/BookingWizard/SelectRoadsideAssistance";
import VerifyEmail from "@/components/BookingWizard/VerifyEmail";
import { BookingLayout } from "@/layout/BookingLayout";
import { useBooking } from "@/providers/BookingProvider";
import { useMarketing } from "@/providers/MarketingProvider";
import { BookingContextType, MarketingContextType } from "@/providers/types";
import {
  InitialOrderPayload,
  OnCheckoutPayload,
  StripePaymentPayload,
} from "@/types";
import { getDuration } from "@/utils/helpers";
import { useRouter } from "next/router";

function Booking() {
  const {
    bookingStep,
    setBookingStep,
    registerValues,
    validateRegisterValues,
    hasRegisterError,
    isVerified,
    initialOrder,
    rentalDetails,
    verifiedOrder,
    stripePaymentOrder,
    onCheckout,
    orderId,
    stripePaymentData,
    birthdayError,
    setDamageCoverageError,
    setPickUpTimeError,
    setDropOffTimeError,
    getBikeBookedDates,
  } = useBooking() as BookingContextType;
  const { setSelectedBikeId, selectedBike } =
    useMarketing() as MarketingContextType;
  const router = useRouter();
  const { bikeId } = router.query;
  const percent = (bookingStep / 7) * 100;
  const pickUpDay = `${rentalDetails.pickUpDate}: ${rentalDetails.pickUpTime}`;
  const dropOffDay = `${rentalDetails.dropOffDate}: ${rentalDetails.dropOffTime}`;
  const duration = getDuration(pickUpDay, dropOffDay) || 0;

  useEffect(() => {
    if (Number(bikeId)) {
      setSelectedBikeId(Number(bikeId));
      getBikeBookedDates(Number(bikeId));
    }
    return () => {};
  }, [bikeId]);

  useEffect(() => {
    if (stripePaymentData) {
      triggerOnCheckout();
    }
    return () => {};
  }, [stripePaymentData]);

  const getInitialOrderPayload = () => {
    const dateOfBirth = `${registerValues.year}-${String(
      registerValues.month
    ).padStart(2, "0")}-${String(registerValues.day).padStart(2, "0")}`;

    const payload: InitialOrderPayload = {
      bikeId: Number(bikeId),
      firstName: registerValues.firstName,
      lastName: registerValues.lastName,
      email: registerValues.email,
      phoneNumber: registerValues.phoneNumber,
      dateOfBirth: dateOfBirth,
      country: registerValues.country,
      city: registerValues.city,
      streetAddress: registerValues.streetAddress,
      aptSuite: registerValues.aptSuite,
      state: registerValues.state,
      postalCode: registerValues.postalCode,
    };
    return payload;
  };

  const triggerOnCheckout = () => {
    const requestBody: OnCheckoutPayload = {
      accessories: rentalDetails.addOns,
      dropOffDate: rentalDetails.dropOffDate,
      dropOffTime: rentalDetails.dropOffTime,
      duration: duration,
      insuranceName: rentalDetails.insuranceName,
      insurancePlanId: rentalDetails.insurancePlanId,
      pickUpDate: rentalDetails.pickUpDate,
      pickUpTime: rentalDetails.pickUpTime,
      roadAssistance: rentalDetails.roadAssistance,
      stripeCustomerId: stripePaymentData?.customer as string,
      stripePaymentId: stripePaymentData?.id as string,
      verificationCode: String(verifiedOrder?.verificationCode),
    };
    onCheckout(requestBody, orderId);
  };

  const triggerStripePayment = () => {
    const personName = `${registerValues.firstName} ${registerValues.lastName}`;
    const requestBody: StripePaymentPayload = {
      addOns: rentalDetails.addOns,
      bikeId: Number(bikeId),
      bikeInsuranceId: rentalDetails.insurancePlanId,
      bikePrice: Number(verifiedOrder?.dailyBikePrice),
      dropOffDate: rentalDetails.dropOffDate,
      dropOffTime: rentalDetails.dropOffTime,
      duration: duration,
      personName: personName,
      pickUpDate: rentalDetails.pickUpDate,
      pickUpTime: rentalDetails.pickUpTime,
      roadAssistance: rentalDetails.roadAssistance,
    };
    stripePaymentOrder(requestBody, orderId);
  };

  const onNext = () => {
    if (bookingStep === 1) {
      Object.entries(registerValues).forEach(([key, value]) => {
        validateRegisterValues(key, value as string);
      });
      if (hasRegisterError() || birthdayError) return;
      if (isVerified) setBookingStep(3);
      else {
        const requestBody = getInitialOrderPayload();
        initialOrder(requestBody);
      }
      return;
    }
    if (
      bookingStep === 3 &&
      (!rentalDetails.pickUpTime || !rentalDetails.dropOffTime)
    ) {
      if (!rentalDetails.pickUpTime) setPickUpTimeError(true);
      if (!rentalDetails.dropOffTime) setDropOffTimeError(true);
      return;
    }
    if (bookingStep === 4 && !rentalDetails.insuranceName) {
      setDamageCoverageError("Please select one Coverage option to proceed.");
      return;
    }

    if (bookingStep === 6) {
      triggerStripePayment();
    }
    setBookingStep((prev) => prev + 1);
  };

  const onBack = () => {
    if (bookingStep === 3 && isVerified) setBookingStep(1);
    else setBookingStep((prev) => prev - 1);
  };

  return (
    <BookingLayout>
      <BookingProgressBar percent={percent} bikeName={selectedBike?.name} />
      {bookingStep === 1 ? <BookingRegister /> : null}
      {bookingStep === 2 && !isVerified ? <VerifyEmail /> : null}
      {bookingStep === 3 ? <SelectPickupDropTime /> : null}
      {bookingStep === 4 ? <SelectDamageCoverage /> : null}
      {bookingStep === 5 ? <SelectRoadsideAssistance /> : null}
      {bookingStep === 6 ? <SelectGearAccessory /> : null}
      {bookingStep === 7 ? <ReviewPayment /> : null}
      <ActionBar onBack={onBack} onNext={onNext} />
    </BookingLayout>
  );
}

export default Booking;
