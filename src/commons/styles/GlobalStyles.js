import { createGlobalStyle } from 'styled-components';
// import reset from 'styled-reset'; /* ${reset}; */
import { generateMedia } from 'styled-media-query';

export const customMedia = generateMedia({
  desktop: '1200px',
  tablet: '800px',
  mobile: '600px',
});

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  a {
    text-decoration: none;
    color: inherit;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Noto Sans KR', sans-serif;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 210px; // h180+g30
    background-color: #F8F9FA; 
    ${customMedia.lessThan('tablet')`
      padding: 60px 0 0 0;
    `}
  }
`;

export default GlobalStyles;
