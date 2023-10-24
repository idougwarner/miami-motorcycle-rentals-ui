import { BikeAdminLayout } from "@/components/BikeAdmin/BikeAdminLayout";
import StepperComponent from "@/components/BikeAdmin/Stepper";
import withAuth from "@/hocs/withAuth";
import { BookingLayout } from "@/layout/BookingLayout";

function BikeAdmin() {
  return (
    <BookingLayout>
      <BikeAdminLayout title="Add New Motorcycle">
        <StepperComponent />
      </BikeAdminLayout>
    </BookingLayout>
  );
}

export default withAuth(BikeAdmin);
