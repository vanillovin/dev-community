import React, { useState } from 'react';
import styled from 'styled-components';

function focusElem(id) {
  const elem = document.getElementById(id);
  elem.focus();
}

const AuthForm = ({ initialState, onSubmit, text }) => {
  console.log('AuthForm initialState', initialState);
  const [state, setstate] = useState({
    name: initialState.name,
    age: initialState.age,
    loginId: initialState.loginId,
    password: initialState.password,
    address: initialState.address,
  });
  const { name, age, loginId, password, address } = state;

  const onChange = ({ target: { name, value } }) =>
    setstate({
      ...state,
      [name]: value,
    });

  const checkName = () => {
    const pattern_space = /\s/;
    if (pattern_space.exec(name)) {
      setstate({
        ...state,
        name: name.replace(' ', ''),
      });
      return;
    }
    if (!name) return;
    if (name.trim() === '') return;
    if (name.trim().length < 2 || name.trim().length > 8) {
      return '이름은 2자 이상, 8자 이하로 입력해 주세요.';
    }
    return true;
  };

  const checkID = () => {
    const pattern_space = /\s/;
    if (pattern_space.exec(loginId)) {
      setstate({
        ...state,
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

  const checkAge = () => (age === '' ? false : true);

  const checkPW = () => {
    const pattern_space = /\s/;
    if (pattern_space.exec(password)) {
      setstate({
        ...state,
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

  const checkAddress = () => (address === '' ? false : true);

  // 아예 버튼을 못 누르게, 버튼 눌렀을 때 밑에 에러, ..
  const validation = () =>
    [
      [checkName, 'authNameInput'],
      [checkAge, 'authAgeInput'],
      [checkID, 'authIDInput'],
      [checkPW, 'authPWInput'],
      [checkAddress, 'authAddrSelect'],
    ].every(([fn, id]) => {
      console.log('AuthForm validation test', fn(), id);
      if (fn() !== true) focusElem(id);
      return fn() === true;
    });

  return (
    <AuthContainer>
      <SignupForm onSubmit={onSubmit}>
        <Text>이름</Text>
        <Input
          id="authNameInput"
          required
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          minLength="2"
          maxLength="8"
          placeholder="이름을 입력해주세요"
        />
        <CheckText>{checkName()}</CheckText>
        <Text>나이</Text>
        <Input
          id="authAgeInput"
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
        {text === '가입하기' && (
          <>
            <Text>아이디</Text>
            <Input
              id="authIDInput"
              required
              type="text"
              name="loginId"
              maxLength="12"
              value={loginId}
              onChange={onChange}
              placeholder="아이디를 입력해주세요"
            />
          </>
        )}
        <CheckText margin={text === '저장하기'}>{checkID()}</CheckText>
        <Text>비밀번호</Text>
        <Input
          id="authPWInput"
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
        <Select id="authAddrSelect" required name="address" onChange={onChange}>
          <option value="" defaultValue>
            시/도 선택
          </option>
          <option value="서울특별시">서울특별시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="대전광역시">대전광역시</option>
          <option value="부산광역시">부산광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="인천광역시">인천광역시</option>
          <option value="경기도">경기도</option>
          <option value="강원도">강원도</option>
          <option value="경상남도">경상남도</option>
          <option value="경상북도">경상북도</option>
          <option value="전라남도">전라남도</option>
          <option value="전라북도">전라북도</option>
          <option value="충청남도">충청남도</option>
          <option value="충청북도">충청북도</option>
          <option value="제주특별자치도">제주특별자치도</option>
        </Select>
        <Button
          onClick={(e) => {
            e.preventDefault();
            validation();
            onSubmit(validation(), state);
          }}
        >
          {text}
        </Button>
      </SignupForm>
    </AuthContainer>
  );
};

export default AuthForm;

const AuthContainer = styled.div`
  width: 400px;
`;
const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const Text = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  padding-left: 2px;
  margin-bottom: 8px;
`;
const Input = styled.input`
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 4px;
  border: 1px solid lightgray;
`;
const Select = styled.select`
  padding: 10px;
  margin-bottom: 4px;
  border-radius: 2px;
  border: 1px solid lightgray;
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
  margin-bottom: ${(props) => props.margin && '0px'};
`;
