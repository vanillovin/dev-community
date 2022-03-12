import React from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';

import memberApi from '../apis/memberApi';
import { useUser } from '../contexts/UserContext';
import AuthForm from '../components/AuthForm';
import { customMedia } from '../commons/styles/GlobalStyles';

const Container = styled.div`
  ${customMedia.lessThan('tablet')`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Signup = () => {
  const user = useUser();
  const history = useHistory();

  const onSubmit = (ok, state) => {
    console.log('Signup onSubmit', ok, state);
    let body = {
      name: state.name,
      age: state.age,
      loginId: state.loginId,
      password: state.password,
      address: state.address,
    };
    ok &&
      memberApi
        .signup(body)
        .then((res) => {
          console.log('signup res', res);
          alert('가입이 완료됐습니다.');
          history.push('/login');
        })
        .catch((err) => {
          console.log('signup err', err.response.status, err.response.data);
          switch (err.response.status) {
            case 400:
              alert(err.response.data.message);
              return;
            case 401:
              alert('Unauthorized');
              return;
            case 403:
              alert('Forbidden');
              return;
            case 404:
              alert('Not Found');
              return;
            default:
          }
        });
  };

  const initialState = {
    name: '',
    age: '',
    loginId: '',
    password: '',
    address: '',
  };

  return (
    <>
      {!user ? (
        <Container>
          <Title>회원가입</Title>
          <AuthForm
            initialState={initialState}
            onSubmit={onSubmit}
            text="가입하기"
          />
        </Container>
      ) : (
        <>
          <Redirect to="/" />
        </>
      )}
    </>
  );
};

export default Signup;
