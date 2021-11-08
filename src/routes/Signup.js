import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import { memberApi } from '../api';
import { useUser } from '../context';
import AuthForm from '../components/AuthForm';

// const SignupContainer = styled.div`
//   width: 400px;
// `;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`;
// const SignupForm = styled.form`
//   display: flex;
//   flex-direction: column;
// `;
// const Text = styled.h3`
//   font-size: 14px;
//   font-weight: bold;
//   padding-left: 2px;
//   margin-bottom: 8px;
// `;
// const Input = styled.input`
//   padding: 10px;
//   margin-bottom: 4px;
//   border-radius: 2px;
//   border: 1px solid lightgray;
// `;
// const Select = styled.select`
//   padding: 10px;
//   margin-bottom: 4px;
//   border-radius: 2px;
//   border: 1px solid lightgray;
// `;
// const Button = styled.button`
//   border: none;
//   height: 40px;
//   cursor: pointer;
//   margin-top: 14px;
//   border-radius: 2px;
//   background-color: #bac8ff;
//   &:hover {
//     background-color: #91a7ff;
//   }
//   &:active {
//     background-color: #748ffc;
//   }
//   transition: all 0.1s linear;
// `;
// const CheckText = styled.p`
//   color: #5c7cfa;
//   font-size: 14px;
//   margin: 0 0 14px 2px;
// `;

// 회원가입 회원수정 INPUT ONCHANGE USESTATE
const Signup = () => {
  const user = useUser();
  const history = useHistory();

  const onSubmit = (ok, state) => {
    console.log(ok, state);
    let body = {
      name: state.name,
      age: state.age,
      loginId: state.loginId,
      password: state.password,
      address: state.address,
    };
    ok
      ? memberApi
          .signup(body)
          .then((res) => {
            console.log('signup res', res);
            alert('가입이 완료됐습니다.');
            history.push('/login');
          })
          .catch((err) => {
            console.log('signup err', err || err.response.data);
          })
      : alert('모두 입력');
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
        <>
          <Title>회원가입</Title>
          <AuthForm
            initialState={initialState}
            onSubmit={onSubmit}
            text="가입하기"
          />
        </>
      ) : (
        <>
          <Redirect to="/" />
        </>
      )}
    </>
  );
};

export default Signup;
