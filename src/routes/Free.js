import React from 'react';
import Board from '../components/Board';
import { useUser } from '../context';

const Free = () => {
  const loggedIn = Boolean(useUser());

  return (
    <div>
      <Board title="Free" loggedIn={loggedIn} />
    </div>
  );
};

export default Free;
