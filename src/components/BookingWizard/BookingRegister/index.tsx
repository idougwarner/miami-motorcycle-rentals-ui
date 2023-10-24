import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, SelectChangeEvent, TextField } from "@mui/material";
import SelectInput from "@/components/common/SelectInput";
import {
  countryOptions,
  dayOptions,
  monthOptions,
  yearOptions,
} from "@/constants/options";
import {
  DivFormWrapper,
  DivInputWrapper,
  PLabel,
  PTitle,
} from "../common/styles";
import { useBooking } from "@/providers/BookingProvider";
import { BookingContextType } from "@/providers/types";
import { RegisterValues } from "@/types";
import { PErrorMsg } from "./styles";

function BookingRegister() {
  const {
    registerValues,
    setRegisterValues,
    registerErrors,
    validateRegisterValues,
    setIsVerified,
    validateBirthday,
    birthdayError,
  } = useBooking() as BookingContextType;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    validateBirthday();
  }, [registerValues]);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    let newValues: Record<string, string | number> = { ...registerValues };
    newValues[name] = value as string;
    setRegisterValues(newValues as unknown as RegisterValues);
    validateRegisterValues(name, value as string);
    setIsVerified(false);
  };

  return (
    <>
      <PTitle>Register for booking</PTitle>
      <DivFormWrapper>
        <Box component="form">
          <PLabel>Personal Details</PLabel>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="First Name"
              name="firstName"
              variant="outlined"
              required
              value={registerValues?.firstName || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.firstName)}
              helperText={registerErrors.firstName}
            />
            <TextField
              className="text-input"
              label="Last Name"
              name="lastName"
              variant="outlined"
              required
              value={registerValues?.lastName || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.lastName)}
              helperText={registerErrors.lastName}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              required
              value={registerValues?.email || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.email)}
              helperText={
                registerErrors.email
                  ? registerErrors.email
                  : "We will send a verification code on your email to verify it"
              }
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="Phone Number"
              name="phoneNumber"
              variant="outlined"
              required
              value={registerValues?.phoneNumber || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.phoneNumber)}
              helperText={registerErrors.phoneNumber}
            />
          </DivInputWrapper>
          <PLabel>Date of Birth</PLabel>
          <DivInputWrapper>
            <SelectInput
              className="text-input"
              label="Month"
              name="month"
              value={registerValues?.month}
              onChange={handleInputChange}
              options={monthOptions}
              error={Boolean(registerErrors.month)}
              helperText={registerErrors.month}
            />
            <SelectInput
              className="text-input"
              label="Day"
              name="day"
              value={registerValues?.day}
              onChange={handleInputChange}
              options={dayOptions}
              error={Boolean(registerErrors.day)}
              helperText={registerErrors.day}
            />
            <SelectInput
              className="text-input"
              label="Year"
              name="year"
              value={registerValues?.year}
              onChange={handleInputChange}
              options={yearOptions}
              error={Boolean(registerErrors.year)}
              helperText={registerErrors.year}
            />
          </DivInputWrapper>
          <PErrorMsg>{birthdayError}</PErrorMsg>
          <PLabel>Home Address</PLabel>
          <DivInputWrapper>
            <SelectInput
              className="text-input"
              label="Country"
              name="country"
              value={registerValues?.country}
              onChange={handleInputChange}
              options={countryOptions}
              error={Boolean(registerErrors.country)}
              helperText={registerErrors.country}
            />
          </DivInputWrapper>

          <DivInputWrapper>
            <TextField
              className="text-input"
              label="Street Address"
              name="streetAddress"
              variant="outlined"
              required
              value={registerValues?.streetAddress || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.streetAddress)}
              helperText={registerErrors.streetAddress}
            />
            <TextField
              className="text-input"
              label="Apt.Suite (Optional)"
              name="aptSuite"
              variant="outlined"
              value={registerValues?.aptSuite || ""}
              onChange={handleInputChange}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="City"
              name="city"
              variant="outlined"
              required
              value={registerValues?.city || ""}
              onChange={handleInputChange}
              error={Boolean(registerErrors.city)}
              helperText={registerErrors.city}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="State"
              name="state"
              variant="outlined"
              value={registerValues?.state || ""}
              onChange={handleInputChange}
            />
            <TextField
              className="text-input"
              label="Postal Code"
              name="postalCode"
              variant="outlined"
              value={registerValues?.postalCode || ""}
              onChange={handleInputChange}
            />
          </DivInputWrapper>
        </Box>
      </DivFormWrapper>
    </>
  );
}

export default BookingRegister;
