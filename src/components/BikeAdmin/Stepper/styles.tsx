import styled from "styled-components";
import { Stepper, Step, StepLabel } from '@mui/material';
import {CancelOutlined} from '@mui/icons-material';

export const StepperWrapper = styled.div`
  max-width: 590px;
  margin: 0 auto;
  padding-top: 45px;
  padding-bottom: 60px;
`;

export const MuiStepper = styled(Stepper)`
  margin-bottom: 40px;
  & > .MuiStepConnector-root > span {
    border-top-width: 3px;
  }
  & > .MuiStepConnector-root.Mui-active > span {
    border-color: #00C3CE;
  }
`;

export const MuiStep = styled(Step)`
  padding: 0;
`;

export const MuiStepLabel = styled(StepLabel)`
  & > .MuiStepLabel-iconContainer {
    padding-right: 0;
    & > svg {
      width: 1.875rem;
      height: 1.875rem;
    }
    & > svg.Mui-active, & > svg.Mui-completed {
      color: #00C3CE;
    }
  }
`;

export const DatesWrapper = styled.div<{borderBottom?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: solid 1px rgba(52, 52, 52, 0.20);
  padding: 20px 0;
  border-bottom: ${({ borderBottom }) => borderBottom ? 'solid 1px rgba(52, 52, 52, 0.20)' : 'none'};
`;

export const DateLabel = styled.p`
  color: #343434;
  font-size: 14px;
  font-weight: 400;
  height: 25px;
  left: 0;
  letter-spacing: 0;
  line-height: 25px;
  top: 0;
  white-space: nowrap;
  position: relative;
`;

export const DateDash = styled.span`
  content: "";
  height: 1px;
  width: 22px;
  background: #00C3CE;
  display: block;
  position: absolute;
  right: -36px;
  top: 12px;
`;

export const CancelIcon = styled(CancelOutlined)`
  font-size: 16px;
  font-color: rgba(52, 52, 52, 0.20);
  cursor: pointer;
`
