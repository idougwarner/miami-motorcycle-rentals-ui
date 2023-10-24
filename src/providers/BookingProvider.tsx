import React, { useContext, useEffect, useState } from "react";
import { BookingContextType, MarketingContextType } from "./types";
import {
  BikeInsurance,
  BikeInsurancesResponse,
  CheckoutOrderData,
  InitialOrderPayload,
  OnCheckoutPayload,
  RegisterValues,
  RentalDetails,
  StripePaymentData,
  StripePaymentPayload,
  UpdateInsurancePayload,
  VerifiedOrder,
  VerifyOrderPayload,
} from "@/types";
import {
  defaultRegisterValues,
  defaultRentalDetails,
  errorLabels,
} from "@/constants/options";
import { getInsuranceListApi, updateInsuranceByIdApi } from "@/apis/adminApis";
import { validEmail, validPhoneNumber } from "@/utils/helpers";
import {
  completeOrderApi,
  getBookedDatesApi,
  initialOrderApi,
  onCheckoutOrderApi,
  resendVerificationCodeApi,
  verifyOrderApi,
} from "@/apis/bookingApis";
import { stripePaymentApi } from "@/apis/bookingApis";
import Router from "next/router";
import dayjs from "dayjs";
import { useMarketing } from "./MarketingProvider";
import { BookedDate } from "@/types/booking";

const BookingContext = React.createContext<BookingContextType | null>(null);

export function useBooking() {
  return useContext(BookingContext);
}

type Props = {
  children: any;
};

export function BookingProvider({ children }: Props) {
  const { selectedBikeId } = useMarketing() as MarketingContextType;
  const [bookingStep, setBookingStep] = useState(1);
  const [registerValues, setRegisterValues] = useState<RegisterValues>(
    defaultRegisterValues
  );
  const [rentalDetails, setRentalDetails] =
    useState<RentalDetails>(defaultRentalDetails);
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {}
  );
  const [bikeInsurances, setBikeInsurances] = useState<
    BikeInsurance[] | undefined
  >(undefined);
  const [updatedInsurance, setUpdatedInsurance] = useState<BikeInsurance>();
  const [orderId, setOrderId] = useState(0);
  const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder>();
  const [verifyCodeError, setVerifyCodeError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCodeSuccess, setResendCodeSuccess] = useState(true);
  const [stripePaymentData, setStripePaymentData] =
    useState<StripePaymentData>();
  const [checkoutOrderData, setCheckoutOrderData] =
    useState<CheckoutOrderData>();
  const [birthdayError, setBirthdayError] = useState("");
  const [damageCoverageError, setDamageCoverageError] = useState("");
  const [pickUpTimeError, setPickUpTimeError] = useState(false);
  const [dropOffTimeError, setDropOffTimeError] = useState(false);
  const [bikeBookedDates, setBikeBookedDates] = useState<BookedDate[]>();

  const initializeBooking = () => {
    setBookingStep(1);
    setRegisterValues(defaultRegisterValues);
    setRentalDetails(defaultRentalDetails);
    setIsVerified(false);
    setStripePaymentData(undefined);
  };

  useEffect(() => {
    if (selectedBikeId) {
      getBikeInsurances(selectedBikeId);
      initializeBooking();
    }
    return () => {};
  }, [selectedBikeId]);

  useEffect(() => {
    if (isVerified) setBookingStep(3);
  }, [isVerified]);

  const validateRegisterValues = (name: string, value: string) => {
    let newErrors = Object.assign(registerErrors);
    const labels: Record<string, string> = errorLabels;
    newErrors[name] = "";
    if (!String(value).trim() && labels[name]) {
      newErrors[name] = `${labels[name]} is required.`;
    } else if (name === "email") {
      newErrors[name] = validEmail(value);
    } else if (name === "phoneNumber") {
      newErrors[name] = validPhoneNumber(value);
    }
    setRegisterErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const validateBirthday = () => {
    setBirthdayError("");
    const birthday = dayjs(
      `${registerValues.year || dayjs().year}-${
        registerValues.month || dayjs().month
      }-${registerValues.day || dayjs().day}`
    );
    const age = dayjs().diff(birthday, "year");
    if (age && age < 21) {
      setBirthdayError("You must be over the age of 21");
    }
  };

  const hasRegisterError = () => {
    let isError = false;
    const labels: Record<string, string> = errorLabels;
    Object.entries(registerErrors).forEach(([key, value]) => {
      if (value && labels[key]) isError = true;
    });
    return isError;
  };

  const getBikeInsurances = (bikeId: number) => {
    getInsuranceListApi(bikeId)
      .then((res: BikeInsurancesResponse) =>
        setBikeInsurances(res.data.insurances)
      )
      .catch((err) => console.log(err.message));
  };

  const getBikeBookedDates = (bikeId: number) => {
    getBookedDatesApi(bikeId)
      .then((res) => setBikeBookedDates(res.data))
      .catch((err) => console.log(err.message));
  };

  const updateBikeInsuranceById = (
    body: UpdateInsurancePayload,
    bikeId: number,
    insuranceId: number
  ) => {
    updateInsuranceByIdApi(body, bikeId, insuranceId).then((res) =>
      setUpdatedInsurance(res.data)
    );
  };

  const initialOrder = (body: InitialOrderPayload) => {
    setIsVerified(false);
    setRentalDetails({
      addOns: [],
      dropOffDate: "",
      dropOffTime: "",
      duration: 0,
      insuranceName: "",
      insurancePlanId: 0,
      pickUpDate: "",
      pickUpTime: "",
      roadAssistance: false,
    });
    setOrderId(0);
    initialOrderApi(body)
      .then((res) => {
        setOrderId(res.data.id);
        setBookingStep(2);
      })
      .catch((err) => console.log(err.message));
  };

  const verifyOrder = (body: VerifyOrderPayload, orderId: number) => {
    setVerifyCodeError("");
    verifyOrderApi(body, orderId)
      .then((res) => {
        setVerifiedOrder(res.data);
        setIsVerified(true);
      })
      .catch((err) => {
        console.log(err.message);
        setVerifyCodeError(
          `Email ${body.email} and verification code ${body.verificationCode} not found.`
        );
        setIsVerified(false);
      });
  };

  const resendCode = (orderId: number) => {
    resendVerificationCodeApi(orderId)
      .then((_) => setResendCodeSuccess(true))
      .catch((err) => {
        console.log(err.message);
        setResendCodeSuccess(false);
      });
  };

  const stripePaymentOrder = (body: StripePaymentPayload, orderId: number) => {
    setStripePaymentData(undefined);
    stripePaymentApi(body, orderId)
      .then((res) => setStripePaymentData(res.data))
      .catch((err) => console.log(err.message));
  };

  const onCheckout = (body: OnCheckoutPayload, orderId: number) => {
    setCheckoutOrderData(undefined);
    onCheckoutOrderApi(body, orderId)
      .then((res) => setCheckoutOrderData(res.data))
      .catch((err) => console.log(err.message));
  };

  const completeOrder = (body: OnCheckoutPayload, orderId: number) => {
    setCheckoutOrderData(undefined);
    completeOrderApi(body, orderId)
      .then((res) => {
        setCheckoutOrderData(res.data);
        Router.push("/booking/success");
      })
      .catch((err) => console.log(err.message));
  };

  const value: BookingContextType = {
    bookingStep,
    setBookingStep,
    registerValues,
    setRegisterValues,
    registerErrors,
    setRegisterErrors,
    validateRegisterValues,
    hasRegisterError,
    rentalDetails,
    setRentalDetails,
    bikeInsurances,
    setBikeInsurances,
    getBikeInsurances,
    updatedInsurance,
    updateBikeInsuranceById,
    orderId,
    initialOrder,
    verifiedOrder,
    setVerifiedOrder,
    verifyOrder,
    verifyCodeError,
    setVerifyCodeError,
    isVerified,
    setIsVerified,
    resendCodeSuccess,
    resendCode,
    stripePaymentOrder,
    onCheckout,
    stripePaymentData,
    checkoutOrderData,
    completeOrder,
    birthdayError,
    validateBirthday,
    damageCoverageError,
    setDamageCoverageError,
    pickUpTimeError,
    setPickUpTimeError,
    dropOffTimeError,
    setDropOffTimeError,
    initializeBooking,
    bikeBookedDates,
    getBikeBookedDates,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}
