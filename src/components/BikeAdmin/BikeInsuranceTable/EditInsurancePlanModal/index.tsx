import React, { useEffect, useState } from "react";
import GeneralModal from "../../../common/GeneralModal";
import {
  DivContentWrapper,
  DivInputWrapper,
  H3Title,
  PDescription,
} from "./styles";
import { FormHelperText, TextField } from "@mui/material";
import { BikeInsurance, UpdateInsurancePayload } from "@/types";
import { HStack } from "../../common/styles";
import { GrayButton, PinkButton } from "../../common/ActionButtons/styles";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (value: BikeInsurance) => void;
  insurance: BikeInsurance | undefined;
};

function EditInsurancePlanModal({ open, onClose, insurance, onSave }: Props) {
  const [editedValues, setEditedValues] = useState({
    dailyRate: insurance?.dailyRate,
    deposit: insurance?.deposit,
    description: insurance?.description,
    popUpDescription: insurance?.popUpDescription,
  });

  const initializeValues = () => {
    setEditedValues({
      dailyRate: insurance?.dailyRate,
      deposit: insurance?.deposit,
      description: insurance?.description,
      popUpDescription: insurance?.popUpDescription,
    });
  };

  useEffect(() => {
    initializeValues();
  }, [insurance]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    key: string
  ) => {
    const { value } = e.target;
    let newValues = Object.assign(editedValues);
    newValues[key] = value;
    setEditedValues((prev) => ({ ...prev, ...newValues }));
  };

  const handleSave = () => {
    if (!editedValues.dailyRate || !editedValues.deposit) return;
    const insuranceId = insurance?.id || 0;
    const updateBody: UpdateInsurancePayload = {
      type: insurance?.type,
      minAge: insurance?.minAge,
      maxAge: insurance?.maxAge,
      dailyRate: Number(editedValues.dailyRate),
      deposit: Number(editedValues.deposit),
      description: editedValues.description,
      popUpDescription: editedValues.popUpDescription,
    };
    onSave({
      id: insuranceId,
      ...updateBody
    });
    onClose();
  };

  const closeModal = () => {
    initializeValues();
    onClose();
  };
  return (
    <>
      <GeneralModal open={open} onClose={closeModal} style={{maxWidth: '750px', minHeight: '830px'}}>
        <H3Title>Edit Insurance Plan</H3Title>
        <DivContentWrapper>
          <PDescription>
            Age Range: {insurance?.minAge} - {insurance?.maxAge}
          </PDescription>
          <PDescription>Coverage Type: {insurance?.type} Coverage</PDescription>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="Daily Rate"
              variant="outlined"
              required
              error={Boolean(!editedValues?.dailyRate)}
              type="number"
              value={editedValues?.dailyRate || ""}
              onChange={(e) => handleInputChange(e, "dailyRate")}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              className="text-input"
              label="Deposit"
              variant="outlined"
              required
              error={Boolean(!editedValues?.deposit)}
              type="number"
              value={editedValues?.deposit || ""}
              onChange={(e) => handleInputChange(e, "deposit")}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              multiline
              rows={4}
              label="Description"
              className="text-input"
              value={editedValues?.description || ""}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </DivInputWrapper>
          <DivInputWrapper>
            <TextField
              multiline
              rows={4}
              label="Popup description"
              className="text-input"
              value={editedValues?.popUpDescription || ""}
              onChange={(e) => handleInputChange(e, "popUpDescription")}
            />
          </DivInputWrapper>
          <FormHelperText style={{marginTop: '-26px'}}>This text is applied to all the motorcycles</FormHelperText>

          <HStack style={{justifyContent: 'center', marginTop: '47px'}}>
            <GrayButton className="gray" onClick={onClose}>Cancel</GrayButton>
            <PinkButton className="pink" onClick={handleSave}>Save</PinkButton>
          </HStack>
        </DivContentWrapper>
      </GeneralModal>
    </>
  );
}

export default EditInsurancePlanModal;
