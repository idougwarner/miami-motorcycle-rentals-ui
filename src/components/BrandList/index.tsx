import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import CardCarousel from "../CardCarousel";
import CategoryCard from "../CategoryCard";
import { DivBrandListContainer, H2Title } from "./styles";

function BrandList() {
  const { allBrands } = useMarketing() as MarketingContextType;

  const items = allBrands?.map((brand, idx) => (
    <CategoryCard key={idx} category={{...brand}} fromBrand />
  ));


  return (
    <>

      <DivBrandListContainer>
        <H2Title>Popular Motorcycle Brands</H2Title>

        <CardCarousel items={items} />
      </DivBrandListContainer>
    </>
  );
}

export default BrandList;
