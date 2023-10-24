import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Bike } from "@/types";
import { useEffect, useRef, useState } from 'react';
import BikeCard from "../BikeCard";
import BikeNotFound from "../BikeNotFound";
import { DivBikeListContainer } from "./styles";

type Props = {
  bikes: Bike[] | undefined;
};

function BikeList({ bikes }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false);
  const dividedBikeList = bikes ? [[...bikes].slice(0, 6), [...bikes].slice(6, bikes.length)] : [];
  const entry = useIntersectionObserver(ref, {})
  
  useEffect(() => {
    if (visible === true) return;
    setVisible(entry?.isIntersecting || false);
  }, [entry]);

  return (
    <>
      {bikes?.length ? (
        <DivBikeListContainer>
          
          {
            dividedBikeList[0].map((bike, index) => (
              <div ref={index === dividedBikeList[0].length - 1 ? ref : null} key={bike.id}>
                  <BikeCard  bike={bike} priority={index === 0} />
              </div>
            ))
          }   
          
          {
           dividedBikeList[1].map((bike, index) => (
              <BikeCard key={bike.id} bike={bike} priority={false} />
            ))
          }

        </DivBikeListContainer>
      ) : (
        <BikeNotFound />
      )}
    </>
  );
}

export default BikeList;
