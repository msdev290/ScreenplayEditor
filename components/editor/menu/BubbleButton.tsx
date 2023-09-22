import React, { ComponentProps, ReactNode } from "react";
import styled from "styled-components";

export interface BubbleButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

const Button = styled.button`
  padding: 5px;
  background-color: #fff;
  color: #000;
  &.p-2 {
    padding: 0.5rem;
  }
  &.text-zinc-600 {
    color: #000;
  }
  &.text-sm {
    font-size: 0.875rem;
  }
  &.flex {
    display: flex;
  }
  &.items-center {
    align-items: center;
  }
  &.gap-1.5 {
    gap: 0.375rem;
  }
  &.font-medium {
    font-weight: 500;
  }
  &.leading-none {
    line-height: 1;
  }
  &:hover {
    &.text-zubc-50 {
      color: #000;
    }
    &.hover:bg-zinc-100 {
      background-color: #f3f4f6;
    }
  }
  &[data-active="true"] {
    &.text-violet-400 {
      color: #9333ea;
    }
  }
`;

const BubbleButton = (props: BubbleButtonProps) => {
  return (
    <Button {...props} />
    // <button
    //   //   style={{ padding: "5px", color: "#fff", textColor: "#000" }}
    //   className="p-2 text-zinc-600 text-sm flex items-center gap-1.5 font-medium leading-none hover:text-zubc-50 hover:bg-zinc-100 data-[active=true]:text-violet-400"
    //   {...props}
    // />
  );
};

export default BubbleButton;
