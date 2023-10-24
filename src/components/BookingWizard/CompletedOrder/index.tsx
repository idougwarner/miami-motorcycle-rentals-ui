import React, { useState } from "react";
import { BookingContextType, MarketingContextType } from "@/providers/types";
import { useBooking } from "@/providers/BookingProvider";
import { DivFormWrapper, Divider } from "../common/styles";
import { MdPersonOutline } from "react-icons/md";
import dayjs from "dayjs";
import { TbCalendarTime } from "react-icons/tb";
import { formattedDayjs, getDiscountPrice, getDuration, isInFixedPriceRange, parseDiscountPercentages } from "@/utils/helpers";
import { PriceItem } from "@/types";
import DiscountDetailsModal from "../DiscountDetailsModal";
import { GoTriangleDown } from "react-icons/go";

import {
  ButtonTakeHome,
  DivCompletedOrderContainer,
  DivDropdown,
  DivHeaderSection,
  DivInfoWrapper,
  DivMainContent,
  DivPriceBar,
  H1Title,
  H3SubTitle,
  ImgBike,
  ImgSuccess,
  PDescription,
  PSectionTitle,
  SpanAlert,
} from "./styles";
import Router from "next/router";
import {
  contactNumber,
  dateTimeFormatString,
  pickUpLocation,
} from "@/constants/services";
import { useMarketing } from "@/providers/MarketingProvider";

function CompletedOrder() {
  const { checkoutOrderData, initializeBooking, rentalDetails } =
    useBooking() as BookingContextType;
  const { selectedBike } =
    useMarketing() as MarketingContextType;
    
  const [showDiscountDetailsModal, setShowDiscountDetailsModal] =
    useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pickUpDay = `${checkoutOrderData?.pickUpDate.split("T")[0]}: ${
    checkoutOrderData?.pickUpTime
  }`;
  const dropOffDay = `${checkoutOrderData?.dropOffDate.split("T")[0]}: ${
    checkoutOrderData?.dropOffTime
  }`;
  const pickUpDateTime = formattedDayjs(pickUpDay).format(dateTimeFormatString);
  const dropOffDateTime =
    formattedDayjs(dropOffDay).format(dateTimeFormatString);
  const duration = getDuration(pickUpDay, dropOffDay) || 0;

  const discountPrice = () => {
    const fixedPrice = selectedBike.bikeBasePrices.find((basePrice) => isInFixedPriceRange(basePrice, rentalDetails));
    if (fixedPrice) {
      return parseFloat(
        String(Number(fixedPrice.pricePerDay))
      ).toFixed(2)
    }

    return getDiscountPrice(
      duration,
      Number(checkoutOrderData?.dailyBikePrice),
      parseDiscountPercentages(selectedBike.discountPercentage)
    ); 
  }

  const bikePrice = {
    label: `$${discountPrice} x ${duration} Days`,
    value: Number(discountPrice) * duration,
    buttonText: "Discount Details",
    buttonAction: () => setShowDiscountDetailsModal(true),
  };
  const damageCoveragePrice = {
    label: `${checkoutOrderData?.insuranceName} $${checkoutOrderData?.insuranceDailyRate} x ${duration} Days`,
    value: Number(checkoutOrderData?.insuranceDailyRate) * duration,
    description: `($${checkoutOrderData?.insuranceDailyRate} Deductible)`,
  };
  const roadAssistancePrice = {
    label: `$12 x ${duration} Days`,
    value: (checkoutOrderData?.roadAssistance ? 12 : 0) * duration,
  };
  const addOnsPrices = checkoutOrderData?.accessories.map((accessory) => {
    return {
      label: `${accessory.name} ($${accessory.price} x ${duration} Days)`,
      value: accessory.price * duration,
    };
  });
  const addOnValues = addOnsPrices?.map((price) => price.value) || [];
  const subTotal =
    bikePrice.value +
    damageCoveragePrice.value +
    roadAssistancePrice.value +
    addOnValues?.reduce((a, b) => a + b, 0);
  const subTotalPrice = {
    label: "Sub Total",
    value: subTotal,
  };
  const salesTaxPrice = {
    label: "Sales Tax 7%",
    value: subTotal * 0.07,
  };
  const totalPrice = {
    label: "Trip Total",
    value: subTotalPrice.value + salesTaxPrice.value,
  };
  const temporaryAuthorizationPrice = {
    label: "Temporary Authorization",
    value: Number(checkoutOrderData?.insuranceDeposit),
  };

  const displayPriceBar = (priceItem: PriceItem) => {
    const priceValue = `$${parseFloat(String(priceItem.value)).toFixed(2)}`;
    return (
      <DivPriceBar key={priceItem.label} hasMargin={priceItem.hasMargin}>
        <p>
          {priceItem.label}

          {priceItem?.buttonText ? (
            <button onClick={priceItem?.buttonAction}>
              {priceItem.buttonText}
            </button>
          ) : null}
          {priceItem.description ? (
            <>
              <br />
              <span>{priceItem.description}</span>
            </>
          ) : null}
        </p>
        <p>{priceValue}</p>
      </DivPriceBar>
    );
  };

  const takeMeHome = () => {
    Router.push("/");
    initializeBooking();
  };

  return (
    <DivCompletedOrderContainer>
      <DivMainContent>
        <DivFormWrapper>
          <DivHeaderSection>
            <ImgSuccess src="/images/clock_icon.svg" />
            <H1Title>Your appointment has been scheduled!</H1Title>
            <PDescription>Here are your appointment details</PDescription>
            <ImgBike src={checkoutOrderData?.bikeImage} alt="bike" />
            <H3SubTitle>
              {checkoutOrderData?.bikeBrand} {checkoutOrderData?.bikeModel}
            </H3SubTitle>
          </DivHeaderSection>

          <div>
            <PSectionTitle>
              <p>
                <MdPersonOutline className="section-icon" />
                <span>Personal info and home address</span>
              </p>
              <GoTriangleDown
                onClick={() => setShowDropdown(!showDropdown)}
                className={`dropdown-icon ${showDropdown && "show"}`}
              />
            </PSectionTitle>

            <DivDropdown className={`${showDropdown && "show"}`}>
              <DivInfoWrapper>
                <span>
                  {checkoutOrderData?.firstName} {checkoutOrderData?.lastName}
                </span>
                <span>
                  {checkoutOrderData?.email}{" "}
                  {checkoutOrderData?.isVerified ? (
                    <strong>(Verified)</strong>
                  ) : (
                    "(Not Verified)"
                  )}
                </span>
                <span>{checkoutOrderData?.phoneNumber}</span>
              </DivInfoWrapper>
              <DivInfoWrapper>
                <p className="info-label">Date of birth</p>
                <span>
                  {dayjs(String(checkoutOrderData?.dateOfBirth)).format(
                    "MMM DD, YYYY"
                  )}{" "}
                  (
                  {dayjs().diff(String(checkoutOrderData?.dateOfBirth), "year")}{" "}
                  Years old)
                </span>
              </DivInfoWrapper>
              <DivInfoWrapper>
                <p className="info-label">Home address</p>
                <span>
                  {checkoutOrderData?.streetAddress} {checkoutOrderData?.city},{" "}
                  {checkoutOrderData?.postalCode} , {checkoutOrderData?.state}
                </span>
                <span>{checkoutOrderData?.country}</span>
              </DivInfoWrapper>
            </DivDropdown>

            <Divider />
          </div>

          <div>
            <PSectionTitle>
              <p>
                <TbCalendarTime className="section-icon" />
                <span>Pickup & Drop-off Date & Time</span>
              </p>
              <span>{duration} Days</span>
            </PSectionTitle>
            <DivInfoWrapper>
              <p>
                {pickUpDateTime} - {dropOffDateTime}
              </p>
            </DivInfoWrapper>
            <DivInfoWrapper>
              <p>Pickup Location: {pickUpLocation}</p>
            </DivInfoWrapper>
            <DivInfoWrapper>
              <p>Our Contact: {contactNumber}</p>
            </DivInfoWrapper>

            <SpanAlert>Please be on time for your appointment</SpanAlert>
            <Divider />
          </div>

          <div>
            <PSectionTitle>Price breakdown</PSectionTitle>
            {displayPriceBar(bikePrice)}
            <PSectionTitle>Damage Coverage</PSectionTitle>
            {displayPriceBar(damageCoveragePrice)}
            {roadAssistancePrice.value ? (
              <>
                <PSectionTitle>Roadside Assistance</PSectionTitle>
                {displayPriceBar(roadAssistancePrice)}
              </>
            ) : null}
            {addOnsPrices?.length ? (
              <>
                <PSectionTitle>Add-ons</PSectionTitle>
                {addOnsPrices?.map((addOnPrice) => displayPriceBar(addOnPrice))}
              </>
            ) : null}
            <Divider />
          </div>

          <div>
            {displayPriceBar(subTotalPrice)}
            {displayPriceBar(salesTaxPrice)}
            {displayPriceBar(totalPrice)}
            {displayPriceBar(temporaryAuthorizationPrice)}
          </div>
        </DivFormWrapper>
      </DivMainContent>

      <ButtonTakeHome onClick={takeMeHome}>Take me home</ButtonTakeHome>
      <DiscountDetailsModal
        open={showDiscountDetailsModal}
        onClose={() => setShowDiscountDetailsModal(false)}
        bikePrice={checkoutOrderData?.dailyBikePrice}
        bikeDiscountPercentage={parseDiscountPercentages(selectedBike?.discountPercentage)}
      />
    </DivCompletedOrderContainer>
  );
}

export default CompletedOrder;
