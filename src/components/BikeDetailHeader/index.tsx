import { Bike } from "@/types";
import NavBar from "../NavBar";
import {
  DivBikeDetailHeaderContainer,
  DivPricingWrapper,
  H1Title,
  PCategory,
  PCurrentPrice,
  PLastPrice,
  PName,
} from "./styles";
import { currentPriceByDiscount, parseDiscountPercentages } from "@/utils/helpers";

type Props = {
  bike: Bike | undefined;
};

function BikeDetailHeader({ bike }: Props) {

  return (
    <>
      <DivBikeDetailHeaderContainer>
        <H1Title>{bike?.name}</H1Title>
        <NavBar nextLinks={["Motorcycle Rental", bike?.name!]} />
        <DivPricingWrapper>
          <PCategory>{bike?.brand.name}</PCategory>
          <PLastPrice>${bike?.regularPrice}</PLastPrice>
        </DivPricingWrapper>
        <DivPricingWrapper>
          <PName>{bike?.model}</PName>
          <PCurrentPrice>${currentPriceByDiscount(bike?.regularPrice, parseDiscountPercentages(bike?.discountPercentage) || 0).toFixed(2)}/ Day</PCurrentPrice>
        </DivPricingWrapper>
      </DivBikeDetailHeaderContainer>
    </>
  );
}

export default BikeDetailHeader;
