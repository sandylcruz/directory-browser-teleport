import styled from 'styled-components';

interface ButtonProps {
  hue: 'primaryHue' | 'secondaryHue';
}

const Button = styled.button<ButtonProps>`
  background-color: ${({ hue, theme }) => theme.colors[theme[hue]][700]};
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  font-weight: bold;
  color: white;
  margin-top: 20px;
  margin-right: 10px;
  padding-left: 25px;
  padding-right: 25px;
  height: 40px;
  outline: none;
  transition: border-color 0.25s ease-in-out 0s, box-shadow 0.1s ease-in-out 0s,
    background-color 0.25s ease-in-out 0s, color 0.25s ease-in-out 0s;

  &:hover {
    background-color: ${({ hue, theme }) => theme.colors[theme[hue]][800]};
    cursor: pointer;
  }
  &:active {
    background-color: ${({ hue, theme }) => theme.colors[theme[hue]][900]};
  }
  &:focus {
    box-shadow: ${({ hue, theme }) => theme.colors[theme[hue]][300]} 0px 0px 0px
      3px;
  }
`;

export default Button;
