import LoginForm from "@/components/BookingWizard/LoginForm";
import { BookingLayout } from "@/layout/BookingLayout";
import React from "react";

function Login() {
  return (
    <BookingLayout>
      <LoginForm />
    </BookingLayout>
  );
}

export default Login;
