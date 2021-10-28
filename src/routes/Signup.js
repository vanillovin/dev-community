import React, { useState } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import { memberApi } from '../api';
import { useUser } from '../context';

const SignupContainer = styled.div`
  width: 400px;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`;
const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const Text = styled.h3`
  font-size: 14px;
  font-weight: bold;
  padding-left: 2px;
  margin-bottom: 6px;
`;
const Input = styled.input`
  padding: 10px;
  outline: none;
  margin-bottom: 4px;
  /* border-radius: 2px; */
  border: 1px solid #e9ecef;
`;
const Button = styled.button`
  border: none;
  height: 40px;
  cursor: pointer;
  margin-top: 14px;
  /* border-radius: 2px; */
  background-color: #bac8ff;
  &:hover {
    background-color: #91a7ff;
  }
  &:active {
    background-color: #748ffc;
  }
  transition: all 0.1s linear;
`;
const CheckText = styled.p`
  color: #ff5858;
  font-size: 14px;
  margin: 0 0 14px 2px;
`;

const Signup = () => {
  const user = useUser();

  const [login, setLogin] = useState({
    name: '',
    age: '',
    loginId: '',
    password: '',
    address: '',
  });
  const { name, age, loginId, password, address } = login;

  const onChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const checkName = () => {
    if (!name) return;
    if (name === '') return;
    if (name.length < 2 || name.length > 20) {
      return '이름은 2자 이상, 20자 이하로 입력해 주세요.';
    }
    return true;
  };

  const checkID = () => {
    // const pattern_num = /[0-9]/; // 숫자
    // const pattern_eng = /[a-zA-Z]/; // 문자
    const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    const pattern_chr = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (!loginId) return;
    if (loginId === '') return;
    if (
      loginId.length < 4 ||
      pattern_chr.test(loginId) ||
      pattern_spc.test(loginId)
    ) {
      return '아이디는 4-12자의 영문과 숫자로 입력해 주세요.';
    }
    return true;
  };

  const checkAge = () => {
    if (age === '') return;
    return true;
  };

  const checkPW = () => {
    if (!password) return;
    if (password === '') return;
    if (password.length < 4 || password.length > 20) {
      return '비밀번호는 4자 이상, 20자 이하로 입력해 주세요.';
    }
    return true;
  };

  const fetchSignUp = () => {
    let body = {
      address,
      name,
      age,
      loginId,
      password,
    };
    memberApi
      .signup(body)
      .then((res) => {
        console.log('signup res', res);
        // window.location.href = '/login';
      })
      .catch((err) => {
        console.log('signup err', err || err.response.data);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(name, age, loginId, password, address);

    // if (name === '') {
    //   alert('이름을 입력해 주세요');
    //   return;
    // } else if (age === '') {
    //   alert('나이를 입력해 주세요');
    //   return;
    // } else if (loginId === '' || loginId < 2) {
    //   alert('아이디는 2자 이상 영문으로 입력해 주세요');
    //   return;
    // }

    if (
      checkName() === true &&
      checkID() === true &&
      checkAge() === true &&
      checkPW() === true
    ) {
      alert('가입이 완료됐습니다.');
      fetchSignUp();
    } else {
      alert('모두 입력해 주세요.');
    }
  };

  return (
    <>
      {!user ? (
        <SignupContainer>
          <Title>회원가입</Title>
          <SignupForm onSubmit={onSubmit}>
            <Text>이름</Text>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              maxLength="20"
              placeholder="이름을 입력해주세요"
            />
            <CheckText>{checkName()}</CheckText>
            <Text>나이</Text>
            <Input
              type="number"
              name="age"
              value={age}
              min="1"
              max="110"
              onChange={onChange}
              placeholder="나이를 입력해주세요"
            />
            <CheckText>{checkAge()}</CheckText>
            <Text>아이디</Text>
            <Input
              type="text"
              name="loginId"
              maxLength="12"
              value={loginId}
              onChange={onChange}
              placeholder="아이디를 입력해주세요"
            />
            <CheckText>{checkID()}</CheckText>
            <Text>비밀번호</Text>
            <Input
              type="password"
              name="password"
              maxLength="20"
              value={password}
              onChange={onChange}
              placeholder="비밀번호를 입력해주세요"
            />
            <CheckText>{checkPW()}</CheckText>
            <Text>주소</Text>
            <Input
              type="text"
              name="address"
              value={address}
              onChange={onChange}
              placeholder="주소를 입력해주세요"
            />
            <CheckText></CheckText>
            <Button type="submit" onSubmit={onSubmit}>
              가입하기
            </Button>
          </SignupForm>
        </SignupContainer>
      ) : (
        <>
          <Redirect to="/" />
        </>
      )}
    </>
  );
};

export default Signup;
