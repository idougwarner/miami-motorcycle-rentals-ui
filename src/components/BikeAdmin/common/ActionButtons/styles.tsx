import { Button } from "@mui/material";
import styled from "styled-components";

export const Wrapper = styled.div`
  margin-top: 39px;
  display: flex;
  justify-content: center;
`;

export const PinkButton = styled(Button)`
  &.pink {
    background-color: #EB42A8;
    color: #fff;
    box-shadow: none;
    width: 150px;
    height: 40px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 31px;
    text-transform: none;
    margin-left: 4px;
  
    &:hover {
      background-color: #FF6BCD;
    }
    
    &:active {
      background-color: #FF4E9E;
    }
  }
`;

export const GrayButton = styled(Button)`
  &.gray {
    background-color: transparent;
    color: rgba(52, 52, 52, 0.67);
    box-shadow: none;
    width: 150px;
    height: 40px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 31px;
    text-transform: none;
  
    &:hover {
      background-color: #F2F2F2;
      color: #343434;
    }
    
    &:active {
      background-color: #E6E6E6;
      color: #343434;
    }
  
    &.Mui-disabled {
      background-color: transparent;
    }
  }
`;