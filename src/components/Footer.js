import React from 'react';
import styled from 'styled-components';
import { GiGiftOfKnowledge } from 'react-icons/gi';

const Container = styled.div`
  margin: 40px 0 20px 0;
  border-top: 1px solid lightgray;
`;

const Footer = () => {
  return (
    <Container>
      <div>
        <GiGiftOfKnowledge />
      </div>

      <div>
        <div>About OOOO | Github</div>
        <div>
          <p>상호명: ㅇㅇ | 제작자: ㅇㅇ | 문의: address@gmail.com</p>
          <p>@ 2021</p>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
