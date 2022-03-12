import React from 'react';
import HomeBoard from '../components/HomeBoard';
import styled from 'styled-components';
import { customMedia } from '../commons/styles/GlobalStyles';

const Grid = styled.div`
  display: grid;
  margin-top: 20px;
  grid-gap: 40px 20px;
  grid-template-columns: repeat(2, 400px);
  ${customMedia.lessThan('tablet')`
    padding: 10px;
    width: 100%;
    grid-template-columns: repeat(2, auto);
  `}
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
