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
import EditInsurancePlanModal from "@/components/BookingWizard/EditInsurancePlanModal";
import { useBooking } from "@/providers/BookingProvider";
import { BookingContextType } from "@/providers/types";
import { BikeInsurance } from "@/types";
import { SelectChangeEvent } from "@mui/material";

type Props = {
  bikeId: number;
};

function BikeInsuranceTable({ bikeId }: Props) {
  const { bikeInsurances } = useBooking() as BookingContextType;
  const [ageRange, setAgeRange] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [filteredInsurances, setFilteredInsurances] = useState<BikeInsurance[]>(
    []
  );
  const [selectedInsurance, setSelectedInsurance] = useState<BikeInsurance>();

  useEffect(() => {
    if (bikeInsurances?.length) {
      const newValues =
        ageRange === "all"
          ? Object.assign((bikeInsurances as BikeInsurance[]) || {})
          : bikeInsurances?.filter(
              (insurance) =>
                insurance.minAge < Number(ageRange) &&
                insurance.maxAge >= Number(ageRange)
            );
      setFilteredInsurances(newValues);
    }
    return () => {};
  }, [ageRange, bikeInsurances]);

  const onEditInsurance = (id: number) => {
    const insurance = bikeInsurances?.find((insurance) => insurance.id === id);
    setSelectedInsurance(insurance);
    setShowModal(true);
  };

  return (
    <DivBikeInsuranceTableContainer>
      <H3Title>Update Bike Insurance</H3Title>
      <DivInsuranceListWrapper>
        {filteredInsurances?.length ? (
          <>
            <PLabel>Insurance Plans</PLabel>
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
                  ${insurance.deposit} Deductable Age: {insurance.minAge} -{" "}
                  {insurance.maxAge}
                </PDescription>
              </div>
              <ButtonEdit onClick={() => onEditInsurance(insurance.id)}>
                Edit
              </ButtonEdit>
            </DivInsuranceListItem>
          ))}
      </DivInsuranceListWrapper>

      <EditInsurancePlanModal
        open={showModal}
        onClose={() => setShowModal(false)}
        insurance={selectedInsurance}
        bikeId={bikeId}
      />
    </DivBikeInsuranceTableContainer>
  );
}

export default BikeInsuranceTable;
