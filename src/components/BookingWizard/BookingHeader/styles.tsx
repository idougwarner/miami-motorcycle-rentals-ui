import Image from "next/image";
import styled from "styled-components";

export const DivBookingHeaderContainer = styled.div`
  padding: 0.5rem;
  padding-left: 5%;
  background: ${({ theme }) => theme.colors.white};
  position: relative;
`;

export const ImgLogo = styled(Image)`
  max-width: 152px;
  height: auto;
  cursor: pointer;
`;

export const MenuWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  & > :not(style) ~ :not(style) {
    margin-left: 16px;
  }
`;

export const MenuItem = styled.div`
  color: rgba(52, 52, 52, 0.67);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 0 20px 27px 20px;

  &.active {
    color: #343434;
    border-bottom: 2px solid #EB42A8;
  }
`;
