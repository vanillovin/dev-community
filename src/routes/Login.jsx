import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router';
import styled from 'styled-components';
import { memberApi } from '../api';
import { useUser } from '../context';

const LoginContainer = styled.div`
  width: 400px;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 2px;
  border: 1px solid #e9ecef;
`;
const Button = styled.button`
  border: none;
  height: 40px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 2px;
  background-color: #bac8ff;
  &:hover {
    background-color: #91a7ff;
  }
  &:active {
    background-color: #748ffc;
  }
  transition: all 0.1s linear;
`;

const Login = () => {
  const user = useUser();

  const [login, setLogin] = useState({
    loginId: '',
    password: '',
  });
  const { loginId, password } = login;

  const onChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    memberApi
      .login({ loginId, password })
      .then((res) => {
        console.log('login res', res, res.status);
        localStorage.setItem('user', JSON.stringify(res.data));
        window.location.href = '/';
      })
      .catch((err) => {
        console.log('login err', err, err.response.status);
        switch (err.response.status) {
          case 400:
            alert('로그인 실패 or 잘못된 요청 or 검증 실패');
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
            console.log('default');
        }
      });
  };

  return (
    <>
      {!user ? (
        <LoginContainer>
          <Title>로그인</Title>
          <LoginForm onSubmit={onSubmit}>
            <Input
              required
              type="text"
              name="loginId"
              value={loginId}
              onChange={onChange}
              placeholder="아이디"
            />
            <Input
              required
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="비밀번호"
            />
            <Button type="submit" onSubmit={onSubmit}>
              로그인
            </Button>
          </LoginForm>
        </LoginContainer>
      ) : (
        <>
          <Redirect to="/" />
        </>
      )}
    </>
  );
};

export default withRouter(Login);
