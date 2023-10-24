import * as React from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { DivGeneralModalContainer, DivModalBox } from "./styles";

type Props = {
  children?: any;
  open: boolean;
  onClose: () => void;
  style?: React.CSSProperties
};

function GeneralModal({ children, open, onClose, style = {} }: Props) {
  return (
    <DivGeneralModalContainer open={open} onClose={onClose}>
      <DivModalBox style={style}>
        <RiCloseCircleLine className="close-icon" onClick={onClose} />
        {children}
      </DivModalBox>
    </DivGeneralModalContainer>
  );
}

export default GeneralModal;
