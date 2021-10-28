import React from 'react';
import { useUser } from '../context';
import Board from '../components/Board';

const Tech = () => {
  const loggedIn = Boolean(useUser());

  return <Board title="Tech" loggedIn={loggedIn} />;
};

export default Tech;
