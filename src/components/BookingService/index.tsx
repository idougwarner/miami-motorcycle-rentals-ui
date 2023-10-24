import { bookingServices } from "@/constants/services";
import {
  DivBookingServiceContainer,
  DivServiceCard,
  DivServiceList,
  H2Title,
  ServiceDescription,
  ServiceImg,
  ServiceTitle
} from "./styles";

function BookingService() {

  return (
    <>
  
      <DivBookingServiceContainer>
        <H2Title>Fast Booking With Enhanced Safety Measures</H2Title>

        <DivServiceList>
          {bookingServices.map((service, idx) => (
            <DivServiceCard key={idx}>
              <ServiceImg
                src={service.image.src}
                alt={service.image.alt}
                width={50}
                height={50}
                rel="dns-prefetch"
              />
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </DivServiceCard>
          ))}
        </DivServiceList>
      </DivBookingServiceContainer>
    </>
  );
}

export default BookingService;
