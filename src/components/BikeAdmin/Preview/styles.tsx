import styled from "styled-components";

export const CarouselWrapper = styled.div`
  & {
    .swiper-wrapper {
      min-height: 200px;
    }
    
    .swiper-pagination-clickable {
      margin-top: 16px;
    }
  }
`;

export const Contents = styled.div`
  margin-top: 16px;
`;

export const Title = styled.div`
  color: var(--primary);
  font-size: 20px;
  font-weight: 600;
  height: 37px;
  left: 0;
  letter-spacing: 0;
  line-height: 37px;
  top: 0;
  white-space: nowrap;
`;

export const Price = styled.div`
  color: #343434;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
`;

export const DetailWrapper = styled.div`
  border-top: solid 1px rgba(52, 52, 52, 0.20);;
  padding: 20px 0;
`;

export const DetailTitle = styled.div`
  color: #343434;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const DetailSubTitle = styled.div`
  color: #343434;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  margin-top: 10px;
  text-transform: capitalize;
`;

export const DetailContents = styled.div`
  color: rgba(52, 52, 52, 0.67);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 10px;
`;