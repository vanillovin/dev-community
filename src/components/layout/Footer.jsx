import React from 'react';
import styled from 'styled-components';
import { GiPeaceDove } from 'react-icons/gi';

const Container = styled.div`
  user-select: none;
  width: 800px;
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  color: lightgray;
  margin-top: 40px;
  border-top: 1px solid lightgray;

  .icon {
    font-size: 50px;
    padding: 5px 15px 0 0;
  }

  div:nth-child(3) {
    margin-top: -10px;
  }

  a {
    margin-left: 5px;
    text-decoration: underline;
  }

  p {
    display: inline-block;
    margin-right: 5px;
    /* :nth-child(2) {
      margin-left: 4px;
    } */
  }
`;

const Footer = () => {
  return (
    <Container>
      <div className="icon">
        <GiPeaceDove />
      </div>

      <div>
        <p>
          BE 김상운 :
          <a
            href="https://github.com/issiscv/dev-communitiy"
            target="_blank"
            rel="noreferrer"
          >
            깃허브
          </a>
          <a href="mailto:issiscv46@gmail.com">메일</a>
        </p>
        <p>
          / FE 이민지 :
          <a
            href="https://github.com/vanillovin/dev-community"
            target="_blank"
            rel="noreferrer"
          >
            깃허브
          </a>
          <a href="mailto:vanillovin@gamil.com">메일</a>
        </p>
        <div>@ 2022</div>
      </div>
    </Container>
  );
};

export default Footer;
