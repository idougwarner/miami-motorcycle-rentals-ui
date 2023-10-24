import { DivLoadingBar } from "@/components/HomeBikeList/styles";
import Image from "next/image";

export function LoadingSpinner() {
  return (
    <DivLoadingBar style={{display: 'flex', justifyContent: 'center'}}>
      <Image
        src="/images/spinner.gif"
        alt="logo"
        width={70}
        height={70}
        quality={100}
        loading="eager"
      />
    </DivLoadingBar>
  )
}