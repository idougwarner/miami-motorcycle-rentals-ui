import { Button } from "@mui/material";
import styled from "styled-components";

export const VStack = styled.div<{spacing?: string}>`
  display: flex;
  flex-direction: column;
  & > :not(style) ~ :not(style) {
    margin-top: ${props => props.spacing ? props.spacing : '16px' }
  }
`;

export const HStack = styled.div<{spacing?: string}>`
  display: flex;
  & > :not(style) ~ :not(style) {
    margin-left: ${props => props.spacing ? props.spacing : '16px' }
  }
`;

export const Flex = styled.div<{flex?: number}>`
  flex: 1;: ${props => props.flex ? props.flex  : 1 }
`;

export const TitleOfStep = styled.p`
  color: var(--Primary, #343434);
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  margin-bottom: 16px;
`;

export const TPLabel = styled.p`
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 25px;
  margin-bottom: 4px;
`;

export const WhiteButton = styled(Button)`
  &.white {
    background-color: #fff;
    color: #EB42A8;
    width: 115px;
    height: 40px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 31px;
    text-transform: none;
    border-radius: 3px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20);
  }
`;