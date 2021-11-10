import React from 'react';
import HomeBoard from '../components/HomeBoard';
import styled from 'styled-components';
import { useUser } from '../context';

const Grid = styled.div`
  /* border: 1px solid black; */
  display: grid;
  margin-top: 20px;
  grid-gap: 45px 25px;
  grid-template-columns: repeat(2, 450px);
`;

const Home = () => {
  const loggedIn = !!useUser();

  return (
    <Grid>
      <HomeBoard title="Best" type="best" />
      <HomeBoard title="Q&amp;A" type="qna" />
      <HomeBoard title="Tech" type="tech" />
      <HomeBoard title="자유게시판" type="free" />
    </Grid>
  );
};

export default Home;
