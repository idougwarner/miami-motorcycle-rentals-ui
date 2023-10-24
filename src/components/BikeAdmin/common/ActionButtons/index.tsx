import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { GrayButton, PinkButton, Wrapper } from "./styles";

export function SubmitButtons({onBack, disableBack}: {onBack: () => void; disableBack?: boolean}) {
  return (
    <Wrapper>
      <GrayButton className="gray" disabled={disableBack} onClick={onBack} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
      <PinkButton className="pink" type="submit" variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>
    </Wrapper>
  )
}