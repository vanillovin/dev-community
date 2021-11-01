import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
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
  margin-bottom: 8px;
`;
const Input = styled.input`
  padding: 10px;
  margin-bottom: 4px;
  border-radius: 2px;
  border: 1px solid #e9ecef;
  /* outline: ${(props) => props}; */
`;
const Button = styled.button`
  border: none;
  height: 40px;
  cursor: pointer;
  margin-top: 14px;
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
const CheckText = styled.p`
  color: #5c7cfa;
  font-size: 14px;
  margin: 0 0 14px 2px;
`;

const Signup = () => {
  const user = useUser();
  const history = useHistory();

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
    const pattern_space = /\s/;
    if (pattern_space.exec(name)) {
      setLogin({
        ...login,
        name: name.replace(' ', ''),
      });
      return;
    }
    if (!name) return;
    if (name.trim() === '') return;
    if (name.trim().length < 2 || name.trim().length > 20) {
      return '이름은 2자 이상, 20자 이하로 입력해 주세요.';
    }
    return true;
  };

  const checkID = () => {
    const pattern_space = /\s/;
    if (pattern_space.exec(loginId)) {
      setLogin({
        ...login,
        loginId: loginId.replace(' ', ''),
      });
      return;
    }
    // const pattern_num = /[0-9]/; // 숫자
    // const pattern_eng = /[a-zA-Z]/; // 문자
    const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    const pattern_chr = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (!loginId) return;
    if (loginId.trim() === '') return;
    if (
      loginId.trim().length < 4 ||
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
    const pattern_space = /\s/;
    if (pattern_space.exec(password)) {
      setLogin({
        ...login,
        password: password.replace(' ', ''),
      });
      return;
    }
    if (!password) return;
    if (password.trim() === '') return;
    if (password.trim().length < 4 || password.trim().length > 20) {
      return '비밀번호는 4자 이상, 20자 이하로 입력해 주세요.';
    }
    return true;
  };

  const checkAddress = () => {
    if (!address) return;
    if (address.trim() === '' || address.trim().length < 1) return;
    return true;
  };

  const fetchSignUp = () => {
    let body = {
      address: address.trim(),
      name,
      age,
      loginId,
      password,
    };
    memberApi
      .signup(body)
      .then((res) => {
        console.log('signup res', res);
        alert('가입이 완료됐습니다.');
        history.push('/login');
      })
      .catch((err) => {
        console.log('signup err', err || err.response.data);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(
      `name:${name} age:${age} loginId:${loginId} password:${password} address:${address}`
    );

    if (
      checkName() === true &&
      checkID() === true &&
      checkAge() === true &&
      checkPW() === true &&
      checkAddress() === true
    ) {
      fetchSignUp();
      // alert('가입완료');
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
              required
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
              required
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
              required
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
              required
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
              required
              type="text"
              name="address"
              value={address}
              onChange={onChange}
              placeholder="주소를 입력해주세요 ex) 경기도, 서울특별시"
            />
            <CheckText>{checkAddress()}</CheckText>
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
