import {
  Bike,
  BikeInsurance,
  BikeType,
  Brand,
  CheckoutOrderData,
  InitialOrderPayload,
  MediaItem,
  OnCheckoutPayload,
  RegisterValues,
  RentalDetails,
  StripePaymentData,
  StripePaymentPayload,
  UpdateInsurancePayload,
  VerifiedOrder,
  VerifyOrderPayload,
} from "@/types";
import { BookedDate } from "@/types/booking";

export type BookingContextType = {
  bookingStep: number;
  setBookingStep: React.Dispatch<React.SetStateAction<number>>;
  registerValues: RegisterValues;
  setRegisterValues: React.Dispatch<React.SetStateAction<RegisterValues>>;
  registerErrors: Record<string, string>;
  setRegisterErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  validateRegisterValues: (name: string, value: string) => void;
  hasRegisterError: () => boolean;
  rentalDetails: RentalDetails;
  setRentalDetails: React.Dispatch<React.SetStateAction<RentalDetails>>;
  bikeInsurances: BikeInsurance[] | undefined;
  setBikeInsurances: React.Dispatch<
    React.SetStateAction<BikeInsurance[] | undefined>
  >;
  getBikeInsurances: (bikeId: number) => void;
  updatedInsurance: BikeInsurance | undefined;
  updateBikeInsuranceById: (
    body: UpdateInsurancePayload,
    bikeId: number,
    insuranceId: number
  ) => void;
  orderId: number;
  initialOrder: (body: InitialOrderPayload) => void;
  verifiedOrder: VerifiedOrder | undefined;
  setVerifiedOrder: React.Dispatch<
    React.SetStateAction<VerifiedOrder | undefined>
  >;
  verifyCodeError: string;
  setVerifyCodeError: React.Dispatch<React.SetStateAction<string>>;
  verifyOrder: (body: VerifyOrderPayload, orderId: number) => void;
  isVerified: boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  resendCodeSuccess: boolean;
  resendCode: (orderId: number) => void;
  stripePaymentOrder: (body: StripePaymentPayload, orderId: number) => void;
  onCheckout: (body: OnCheckoutPayload, orderId: number) => void;
  stripePaymentData: StripePaymentData | undefined;
  checkoutOrderData: CheckoutOrderData | undefined;
  completeOrder: (body: OnCheckoutPayload, orderId: number) => void;
  birthdayError: string;
  validateBirthday: () => void;
  damageCoverageError: string;
  setDamageCoverageError: React.Dispatch<React.SetStateAction<string>>;
  pickUpTimeError: boolean;
  setPickUpTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  dropOffTimeError: boolean;
  setDropOffTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  initializeBooking: () => void;
  bikeBookedDates: BookedDate[] | undefined;
  getBikeBookedDates: (bikeId: number) => void;
};

export type MarketingContextType = {
  selectedBlogTitle: string;
  setSelectedBlogTitle: React.Dispatch<React.SetStateAction<string>>;
  screenSize: {
    width: number;
    height: number;
  };
  allBikes: Bike[] | undefined;
  selectedBikeId: number;
  setSelectedBikeId: React.Dispatch<React.SetStateAction<number>>;
  selectedBike: Bike | undefined;
  selectedBikeMediaItems: MediaItem[] | undefined;
  allBikeTypes: BikeType[] | undefined;
  allBrands: Brand[] | undefined;
  selectedBikeTypeId: number;
  setSelectedBikeTypeId: React.Dispatch<React.SetStateAction<number>>;
  bikesByType: Bike[] | undefined;
  bikesByBrand: Bike[] | undefined;
  getAllBikes: () => void;
  getAllBikeTypes: () => void;
  getAllBrands: () => void;
  isGetAllBikesLoading: boolean;
  setAllBrands: React.Dispatch<React.SetStateAction<Brand[] | undefined>>;
  setAllBikes: React.Dispatch<React.SetStateAction<Bike[] | undefined>>;
  setAllBikeTypes: React.Dispatch<React.SetStateAction<BikeType[] | undefined>>;
};
