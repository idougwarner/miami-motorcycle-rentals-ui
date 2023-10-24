import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Alert } from '@mui/material';
import { ButtonSubmit, FormCheckout } from "./styles";
import { useBooking } from "@/providers/BookingProvider";
import { BookingContextType } from "@/providers/types";
import { getDuration } from "@/utils/helpers";
import { OnCheckoutPayload } from "@/types";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    rentalDetails,
    stripePaymentData,
    verifiedOrder,
    orderId,
    completeOrder,
  } = useBooking() as BookingContextType;

  const pickUpDay = `${rentalDetails.pickUpDate}: ${rentalDetails.pickUpTime}`;
  const dropOffDay = `${rentalDetails.dropOffDate}: ${rentalDetails.dropOffTime}`;
  const duration = getDuration(pickUpDay, dropOffDay) || 0;

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      console.log(result.error.message);
      let errorMsg = '';
      switch (result.error.decline_code) {
        case 'insufficient_funds':
          errorMsg = 'The payment failed because of insufficient funds.';
          break;
      
        default:
          errorMsg = result.error.message || 'Unexpected Error!';
          break;
      }

      setErrorMessage(`${errorMsg} Please try a different payment method or contact your bank to release the funds before trying again.`);
    } else {
      setErrorMessage('');
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
      completeOrder(requestBody, orderId);
    }
  };

  return (
    <>
      <FormCheckout onSubmit={handleSubmit}>
        {errorMessage && <Alert severity="error" onClose={() => {setErrorMessage('')}}>{errorMessage}</Alert>}
        <PaymentElement />
        <ButtonSubmit disabled={!stripe}>Send reservation</ButtonSubmit>
      </FormCheckout>
    </>
  );
};

export default CheckoutForm;
