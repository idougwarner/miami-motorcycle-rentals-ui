import React from "react";
import { Body, Title, Wrapper } from "./styles";

export function BikeAdminLayout({
  title, 
  children,
  style
}: {
  title: string; 
  children: JSX.Element[] | JSX.Element
  style?: React.CSSProperties
}) {
  return (
    <Wrapper style={style}>
      <Title>{title}</Title>
      <Body>{children}</Body>
    </Wrapper>
  )
}