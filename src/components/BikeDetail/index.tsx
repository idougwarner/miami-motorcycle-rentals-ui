import { useMarketing } from "@/providers/MarketingProvider";
import { MarketingContextType } from "@/providers/types";
import { Bike } from "@/types";
import { MdOutlinePlayCircle } from "react-icons/md";
import BikeCard from "../BikeCard";
import CardCarousel from "../CardCarousel";
import {
  DivBikeDetailContainer,
  DivDescription,
  DivFeatureGroup,
  H3SubTitle,
  LiFeatureItem,
  PTitle,
  UlFeatureList,
} from "./styles";

type Props = {
  bike: Bike | undefined;
};

function BikeDetail({ bike }: Props) {
  const { allBikes } = useMarketing() as MarketingContextType;

  // Temporary approach: display Naked-bikes for Sport-bikes or Standard-bike
  const featuredBikes = bike.relatedBikes.length ? bike.relatedBikes.map(el => el.relatedBike) :
    bike?.typeId === 1 || bike?.typeId === 2
      ? allBikes?.filter((item) => item.typeId === 6 && item.id !== bike.id)
      : allBikes?.filter(
          (item) => item.typeId === bike?.typeId && item.id !== bike.id
        );
  const items =
    featuredBikes?.map((bike, idx) => <BikeCard key={idx} bike={bike} />) || [];


  return (
    <>
      <DivBikeDetailContainer>
        <DivFeatureGroup>
          <MdOutlinePlayCircle className="title-icon" />
          <div>
            <PTitle>Highlights:</PTitle>
            <UlFeatureList>
              {bike?.highlights?.map((item, idx) => (
                <LiFeatureItem key={idx}>{item}</LiFeatureItem>
              ))}
            </UlFeatureList>
          </div>
        </DivFeatureGroup>
        <DivFeatureGroup>
          <MdOutlinePlayCircle className="title-icon" />
          <div>
            <PTitle>Description:</PTitle>
            <DivDescription
              dangerouslySetInnerHTML={{
                __html: bike?.description?.replace(/(\r\n|\r|\n)/g, "<br>")!,
              }}
            />
          </div>
        </DivFeatureGroup>
        <DivFeatureGroup>
          <MdOutlinePlayCircle className="title-icon" />
          <div>
            <PTitle>Distance Included:</PTitle>
            <DivDescription
              dangerouslySetInnerHTML={{ __html: bike?.distanceIncluded! }}
            />
          </div>
        </DivFeatureGroup>

        <DivFeatureGroup>
          <MdOutlinePlayCircle className="title-icon" />
          <div>
            <PTitle>Features:</PTitle>
            <UlFeatureList>
              {bike?.features?.map((item, idx) => (
                <LiFeatureItem key={idx}>{item}</LiFeatureItem>
              ))}
            </UlFeatureList>
          </div>
        </DivFeatureGroup>

        <DivFeatureGroup>
          <MdOutlinePlayCircle className="title-icon" />
          <div>
            <PTitle>Extras:</PTitle>
            <UlFeatureList>
              {bike?.extras?.map((item, idx) => (
                <LiFeatureItem key={idx}>{item}</LiFeatureItem>
              ))}
            </UlFeatureList>
          </div>
        </DivFeatureGroup>

        <H3SubTitle>You may also like</H3SubTitle>

        <CardCarousel items={items} />
      </DivBikeDetailContainer>
    </>
  );
}

export default BikeDetail;
