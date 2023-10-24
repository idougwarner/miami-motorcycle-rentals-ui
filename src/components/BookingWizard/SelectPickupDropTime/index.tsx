import React, { useEffect, useState } from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import DiscountDetailsModal from "../DiscountDetailsModal";
import SelectInput from "@/components/common/SelectInput";
import { timeOptions } from "@/constants/options";
import DatePicker from "@/components/common/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useBooking } from "@/providers/BookingProvider";
import { BookingContextType, MarketingContextType } from "@/providers/types";
import {
  ButtonDetail,
  DivDiscountInfoWrapper,
  DivDiscountWrapper,
  ImgIcon,
  PDescription,
  SpanCurrentPrice,
  SpanHelp,
  SpanLastPrice,
} from "./styles";
import {
  DivFormWrapper,
  DivInputWrapper,
  PLabel,
  PTitle,
} from "../common/styles";
import {
  formattedDate,
  formattedDayjs,
  getDiscountPrice,
  getDuration,
  isAfterSecondFromFirstDay,
  isBeforeSecondFromFirstDay,
  isDateInRange,
  isInFixedPriceRange,
  parseDiscountPercentages,
} from "@/utils/helpers";
import { RentalDetails } from "@/types";
import { dateFormatString, dateTimeFormatString } from "@/constants/services";
import { useMarketing } from "@/providers/MarketingProvider";
dayjs.extend(isBetween);

function SelectPickupDropTime() {
  const {
    rentalDetails,
    setRentalDetails,
    verifiedOrder,
    pickUpTimeError,
    dropOffTimeError,
    setPickUpTimeError,
    setDropOffTimeError,
    bikeBookedDates,
  } = useBooking() as BookingContextType;
  const { selectedBike } =
    useMarketing() as MarketingContextType;

  const [showModal, setShowModal] = useState(false);
  const today = dayjs().add(1, "hour").format(dateTimeFormatString);
  const pickUpDay = `${rentalDetails.pickUpDate}: ${rentalDetails.pickUpTime}`;
  const dropOffDay = `${rentalDetails.dropOffDate}: ${rentalDetails.dropOffTime}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    validateDropOffTime();
  }, [rentalDetails]);

  const invalidPickUpTime = (optionDay: string) => {
    return (
      isBeforeSecondFromFirstDay(
        dayjs().format(dateTimeFormatString),
        optionDay
      ) ||
      Boolean(
        bikeBookedDates?.some(
          (bookedDate) =>
            isAfterSecondFromFirstDay(
              formattedDayjs(
                `${bookedDate.pickUpDate}: ${bookedDate.pickUpTime}`
              )
                .subtract(30, "minute")
                .format(dateTimeFormatString),
              optionDay
            ) &&
            isBeforeSecondFromFirstDay(
              formattedDayjs(
                `${bookedDate.dropOffDate}: ${bookedDate.dropOffTime}`
              )
                .add(30, "minute")
                .format(dateTimeFormatString),
              optionDay
            )
        )
      )
    );
  };

  const invalidDropOffTime = (optionDay: string) => {
    return (
      invalidPickUpTime(optionDay) ||
      Boolean(
        bikeBookedDates?.some(
          (bookedDate) =>
            isAfterSecondFromFirstDay(
              `${rentalDetails.pickUpDate}: ${rentalDetails.pickUpTime}`,
              `${bookedDate.dropOffDate}: ${bookedDate.dropOffTime}`
            ) &&
            isBeforeSecondFromFirstDay(
              optionDay,
              `${bookedDate.dropOffDate}: ${bookedDate.dropOffTime}`
            )
        )
      )
    );
  };

  const isValidPickUpDay = (date: string) => {
    const newOptions = timeOptions.map((option) => {
      let newOption = { ...option };
      const optionDay = `${date}: ${option.value}`;

      newOption.valid = true;

      if (!dayjs(date).isValid()) {
        newOption.valid = false;
      } else if (invalidPickUpTime(optionDay)) {
        newOption.valid = false;
      }
      return newOption;
    });

    return Boolean(newOptions.filter((option) => option.valid).length);
  };

  const isValidDropOffDay = (date: string) => {
    const newOptions = timeOptions.map((option) => {
      let newOption = { ...option };
      const optionDay = `${date}: ${option.value}`;

      newOption.valid = true;

      if (!dayjs(date).isValid()) {
        newOption.valid = false;
      } else if (invalidDropOffTime(optionDay)) {
        newOption.valid = false;
      } else if (isBeforeSecondFromFirstDay(pickUpDay, optionDay)) {
        newOption.valid = false;
      }
      return newOption;
    });

    return Boolean(newOptions.filter((option) => option.valid).length);
  };

  const validateDropOffTime = () => {
    let newValues: RentalDetails = Object.assign(rentalDetails);
    if (
      isBeforeSecondFromFirstDay(pickUpDay, dropOffDay) ||
      formattedDate(dropOffDay).isBefore(formattedDate(pickUpDay), "day")
    ) {
      newValues.dropOffTime = "";
      if (
        formattedDate(dropOffDay).isBefore(formattedDate(pickUpDay), "day") ||
        !isValidDropOffDay(rentalDetails.dropOffDate)
      )
        newValues.dropOffDate = "";
      setRentalDetails((prev) => ({ ...prev, ...newValues }));
    } else if (invalidDropOffTime(dropOffDay)) {
      newValues.dropOffDate = "";
      newValues.dropOffTime = "";
      setRentalDetails((prev) => ({ ...prev, ...newValues }));
    }
  };

  const isTimeInRange = (date: string, time: string, startTime: string, endTime: string) => {
    const format = 'YYYY-MM-DD HH:mm A';
    const dayjsDateTime = dayjs(`${date} ${time}`, format);
    const dayjsStartDateTime = dayjs(startTime, format).subtract(30, 'minute');
    const dayjsEndDateTime = dayjs(endTime, format).add(30, 'minute');
  
    if (dayjsDateTime.isBetween(dayjsStartDateTime, dayjsEndDateTime, null, '[]')) {
      return true;
    }
    return false;
  };

  const pickUpTimeOptions = timeOptions.map((option) => {
    let newOption = { ...option };
    const optionDay = `${rentalDetails.pickUpDate} ${option.value}`;
  
    newOption.valid = true;
  
    if (!dayjs(rentalDetails.pickUpDate).isValid()) {
      newOption.valid = false;
    } else if (isBeforeSecondFromFirstDay(today, optionDay)) {
      newOption.valid = false;
    } else if (invalidPickUpTime(optionDay)) {
      newOption.valid = false;
    } else if (
      Boolean(
        selectedBike.bikeOffDays?.some((offDay) =>
          isTimeInRange(rentalDetails.pickUpDate, option.value, `${offDay.fromDate} ${offDay.fromTime}`, `${offDay.toDate} ${offDay.toTime}`)
        )
      )
    ) {
      newOption.valid = false;
    }
    return newOption;
  });

  const dropOffTimeOptions = timeOptions.map((option) => {
    let newOption = { ...option };
    const optionDay = `${rentalDetails.dropOffDate} ${option.value}`;
    newOption.valid = true;
    if (
      !rentalDetails.pickUpTime ||
      !dayjs(rentalDetails.dropOffDate).isValid()
    ) {
      newOption.valid = false;
    } else if (isBeforeSecondFromFirstDay(pickUpDay, optionDay)) {
      newOption.valid = false;
    } else if (invalidDropOffTime(optionDay)) {
      newOption.valid = false;
    } else if (
      Boolean(
        selectedBike.bikeOffDays?.some((offDay) =>
          isTimeInRange(rentalDetails.dropOffDate, option.value, `${offDay.fromDate} ${offDay.fromTime}`, `${offDay.toDate} ${offDay.toTime}`)
        )
      )
    ) {
      newOption.valid = false;
    }
    return newOption;
  });

  const pickUpDiableDates = (date: Dayjs) => {
    const disableFromDay = dayjs().subtract(1, "day");
    let shouldDisable = false;

    if (!isValidPickUpDay(date.format(dateFormatString))) {
      shouldDisable = true;
    }

    if (
      isBeforeSecondFromFirstDay(
        disableFromDay?.format(dateFormatString),
        date.format(dateFormatString)
      )
    ) {
      shouldDisable = true;
    }

    return (
      shouldDisable ||
      Boolean(
        selectedBike.bikeOffDays?.some((offDay) =>
          isDateInRange(date, offDay.fromDate, offDay.toDate)
        )
      )
    );
  };

  const dropOffDiableDates = (date: Dayjs) => {
    const disableFromDay = formattedDayjs(pickUpDay).day()
      ? formattedDayjs(pickUpDay).subtract(1, "day")
      : dayjs().subtract(1, "day");
    let shouldDisable = false;

    if (!isValidDropOffDay(date.format(dateFormatString))) {
      shouldDisable = true;
    }

    if (
      isBeforeSecondFromFirstDay(
        disableFromDay?.format(dateFormatString),
        date.format(dateFormatString)
      )
    ) {
      shouldDisable = true;
    }
  
    return (
      shouldDisable ||
      Boolean(
        selectedBike.bikeOffDays?.some((offDay) =>
          isDateInRange(date, offDay.fromDate, offDay.toDate)
        )
      )
    );
  };

  const handleDateChange = (value: Dayjs | null, key: string) => {
    let newValues = Object.assign(rentalDetails);
    const date = dayjs(value).format(dateFormatString);
    newValues[key] = date;
    if (key === "pickUpDate") newValues.pickUpTime = "";
    if (key === "dropOffDate") newValues.dropOffTime = "";
    setRentalDetails((prev) => ({ ...prev, ...newValues }));
  };

  const handleTimeChange = (e: SelectChangeEvent<string>, key: string) => {
    const { value } = e.target;
    let newValues = Object.assign(rentalDetails);
    newValues[key] = value;
    setRentalDetails((prev) => ({ ...prev, ...newValues }));
    if (key === "pickUpTime") setPickUpTimeError(false);
    if (key === "dropOffTime") setDropOffTimeError(false);
  };

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
      Number(verifiedOrder?.dailyBikePrice),
      parseDiscountPercentages(selectedBike.discountPercentage)
    );
  };
  const totalPrice = () => {
    const fixedPrice = selectedBike.bikeBasePrices.find((basePrice) => isInFixedPriceRange(basePrice, rentalDetails));
    if (fixedPrice) {
      return parseFloat(
        String(Number(fixedPrice.pricePerDay) * duration)
      ).toFixed(2)
    }
    return parseFloat(
      String(Number(verifiedOrder?.dailyBikePrice) * duration)
    ).toFixed(2)
  };
  const discountTotal = parseFloat(
    String(Number(discountPrice()) * duration)
  ).toFixed(2);
  const savedPrice = parseFloat(
    String(Number(totalPrice()) - Number(discountTotal))
  ).toFixed(2);

  return (
    <>
      <PTitle>Select your Pickup Date/Time and Drop off Date/Time</PTitle>
      <DivFormWrapper>
        <Box component="form">
          <PLabel>Pick-up date & time</PLabel>
          <DivInputWrapper>
            <DatePicker
              className="text-input"
              onChange={(value) => handleDateChange(value, "pickUpDate")}
              value={
                rentalDetails.pickUpDate
                  ? dayjs(rentalDetails.pickUpDate)
                  : null
              }
              disableDates={pickUpDiableDates}
            />
            <SelectInput
              className="text-input"
              label="Time"
              value={rentalDetails.pickUpTime}
              error={pickUpTimeError}
              onChange={(e: SelectChangeEvent<any>) => handleTimeChange(e, "pickUpTime")}
              options={pickUpTimeOptions}
            />
          </DivInputWrapper>
          <PLabel>Return date & time</PLabel>
          <DivInputWrapper>
            <DatePicker
              className="text-input"
              onChange={(value) => handleDateChange(value, "dropOffDate")}
              value={
                rentalDetails.dropOffDate
                  ? dayjs(rentalDetails.dropOffDate)
                  : null
              }
              disableDates={dropOffDiableDates}
            />
            <SelectInput
              className="text-input"
              label="Time"
              value={rentalDetails.dropOffTime}
              error={dropOffTimeError}
              onChange={(e: SelectChangeEvent<any>) => handleTimeChange(e, "dropOffTime")}
              options={dropOffTimeOptions}
            />
          </DivInputWrapper>
        </Box>

        <DivDiscountWrapper>
          <ImgIcon src="/images/discount_details_icon.svg" alt="icon" />
          <div>
            <PDescription>
              You get discount when you book for more than 1 day.
            </PDescription>
            <ButtonDetail onClick={() => setShowModal(true)}>
              View Discount Details
            </ButtonDetail>
          </div>
        </DivDiscountWrapper>

        <DivDiscountInfoWrapper>
          {duration > 0 ? (
            <div>
              <SpanCurrentPrice>
                ${discountPrice()} x {duration} Days
              </SpanCurrentPrice>
              <SpanHelp>{selectedBike.bikeBasePrices.find((basePrice) => isInFixedPriceRange(basePrice, rentalDetails)) ? 'You are in the fixed price date range.' : `You saved $${savedPrice}`}</SpanHelp>
            </div>
          ) : (
            <SpanCurrentPrice>
              Bike price per day: ${discountPrice()}
            </SpanCurrentPrice>
          )}
          {duration > 0 ? (
            <div>
              <SpanLastPrice> ${totalPrice()} </SpanLastPrice>
              <SpanCurrentPrice>${discountTotal}</SpanCurrentPrice>
            </div>
          ) : null}
        </DivDiscountInfoWrapper>
      </DivFormWrapper>

      <DiscountDetailsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        bikePrice={verifiedOrder?.dailyBikePrice}
        bikeDiscountPercentage={parseDiscountPercentages(selectedBike?.discountPercentage)}
      />
    </>
  );
}

export default SelectPickupDropTime;
