import styled from "styled-components/macro";

export const RoundButton = styled.button`
  width: 5rem;
  height: 5rem;
  border: 2px solid white;
  background: var(--color);
  border-radius: 100%;
  margin: 4px;
  box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.36);
  outline: none;

  &.selected {
    border: 2px solid black;
  }
`;