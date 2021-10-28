import React from 'react';
import styled, { keyframes } from 'styled-components';
// import nutImg from '../assets/nut.png';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  font-size: 30px;
  margin-top: 90px;
`;
const Ani = keyframes`
  0% {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
`;
const Img = styled.div`
  opacity: 0.6;
  animation: ${Ani} 1s;
  transform: translateX();
`;

const Loader = () => {
  return (
    <Container>
      <Img role="img" aria-label="Loading">
        {/* <img src={nutImg} /> */}
      </Img>
    </Container>
  );
};

export default Loader;
