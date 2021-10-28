import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const globalStyles = createGlobalStyle`
  ${reset};
  a {
    text-decoration: none;
    color: inherit;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Nanum Gothic', sans-serif;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 210px; // h180+g30
    background-color: #F8F9FA; 
  }
`;

export default globalStyles;
