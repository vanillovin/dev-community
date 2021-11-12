import React from 'react';
import HomeBoard from '../components/HomeBoard';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  margin-top: 20px;
  grid-gap: 45px 25px;
  grid-template-columns: repeat(2, 450px);
`;

const Home = () => {
  return (
    <Grid>
      <HomeBoard title="👍 Best" type="best" />
      <HomeBoard title="❓ Q&amp;A" type="qna" />
      <HomeBoard title="💻 Tech" type="tech" />
      <HomeBoard title="자유게시판" type="free" />
    </Grid>
  );
};

export default Home;
