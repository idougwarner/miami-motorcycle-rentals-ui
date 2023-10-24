import React, { useEffect, useState } from "react";
import {
  ButtonEdit,
  DivBikeInsuranceTableContainer,
  DivInputWrapper,
  DivInsuranceListItem,
  DivInsuranceListWrapper,
  H3Title,
  PDescription,
  PLabel,
} from "./styles";
import SelectInput from "@/components/common/SelectInput";
import { ageOptions } from "@/constants/options";
import { BikeInsurance } from "@/types";
import { HStack, WhiteButton } from "../common/styles";
import EditInsurancePlanModal from "./EditInsurancePlanModal";
import { BikeData } from "../Stepper";
import { GrayButton, PinkButton } from "../common/ActionButtons/styles";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";

type Props = {
  bikeId: number;
};

function BikeInsuranceTable({ 
  setActiveStep, 
  bikeData,
  setBikeData
}: { 
  setActiveStep: (value: any) => void; 
  bikeData: BikeData;
  setBikeData: (bikeData: BikeData) => void;
}) {
  const [ageRange, setAgeRange] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [filteredInsurances, setFilteredInsurances] = useState<BikeInsurance[]>(
    []
  );
  const [selectedInsurance, setSelectedInsurance] = useState<BikeInsurance>();

  useEffect(() => {
    if (bikeData?.insurancePlans.length) {
      const newValues =
        ageRange === "all"
          ? Object.assign((bikeData?.insurancePlans as BikeInsurance[]) || {})
          : bikeData?.insurancePlans?.filter(
              (insurance) =>
                insurance.minAge < Number(ageRange) &&
                insurance.maxAge >= Number(ageRange)
            );
      setFilteredInsurances(newValues);
    }
    return () => {};
  }, [ageRange, bikeData?.insurancePlans]);

  const onEditInsurance = (id: number) => {
    const insurance = bikeData?.insurancePlans?.find((insurance) => insurance.id === id);
    setSelectedInsurance(insurance);
    setShowModal(true);
  };

  const onSave = (newInsurance: BikeInsurance) => {
    const index = bikeData.insurancePlans.findIndex(el => el.id === selectedInsurance.id);
    const updateData = [...bikeData.insurancePlans];
    updateData[index] = newInsurance;
    setBikeData({
      ...bikeData,
      insurancePlans: updateData
    })
  }

  return (
    <DivBikeInsuranceTableContainer>
      <DivInsuranceListWrapper>
        {filteredInsurances?.length ? (
          <>
            <PLabel style={{fontSize: '20px', marginBottom: '20px'}}>Insurance Plans</PLabel>
            <DivInputWrapper>
              <SelectInput
                className="text-input"
                label="Age Range"
                value={ageRange}
                onChange={(e: SelectChangeEvent<any>) => setAgeRange(e.target.value)}
                options={ageOptions}
              />
            </DivInputWrapper>
          </>
        ) : (
          <>There is no insurance plan to display.</>
        )}

        {filteredInsurances.length &&
          filteredInsurances?.map((insurance) => (
            <DivInsuranceListItem key={insurance.id}>
              <div>
                <PLabel>
                  {insurance.type} Coverage - ${insurance.dailyRate} / Day
                  Charge
                </PLabel>
                <PDescription>
                  ${insurance.deposit} Deductible Age: {insurance.minAge} -{" "}
                  {insurance.maxAge}
                </PDescription>
              </div>
              <WhiteButton className="white" onClick={() => onEditInsurance(insurance.id)}>Edit</WhiteButton>
            </DivInsuranceListItem>
          ))}
      </DivInsuranceListWrapper>

      <EditInsurancePlanModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSave}
        insurance={selectedInsurance}
      />

      <HStack style={{justifyContent: 'center', marginTop: '47px'}}>
        <GrayButton className="gray" onClick={() => setActiveStep(3)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
        <PinkButton className="pink" onClick={() => setActiveStep(5)} variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>
      </HStack>
    </DivBikeInsuranceTableContainer>
  );
}

export default BikeInsuranceTable;
