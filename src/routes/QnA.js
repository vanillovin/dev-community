import React from 'react';
import Board from '../components/Board';
import { useUser } from '../context';

const QnA = () => {
  const loggedIn = Boolean(useUser());

  return <Board title="Q&amp;A" loggedIn={loggedIn} />;
};

export default QnA;
