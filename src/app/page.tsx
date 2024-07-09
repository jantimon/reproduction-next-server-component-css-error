import { Metadata } from "next";
import { Button } from "./button";
import { styled } from "next-yak";

export const metadata: Metadata = {
  title: '...',
}

const Title = styled.h1`
  color: blue;
`;

export default function Home() {
  return (<>
    <Title>Hello</Title>
    <Button>Click me</Button>
  </>);
}
