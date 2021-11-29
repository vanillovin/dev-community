import React from 'react';
import { useLocation, useParams } from 'react-router';

const T = () => {
  const location = useLocation();
  const param = useParams();
  console.log('T', location, param);

  return <div></div>;
};

export default T;
