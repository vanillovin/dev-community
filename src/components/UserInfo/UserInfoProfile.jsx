import React, { useState } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';

import memberApi from '../../apis/memberApi';
import { useSetUser, useT, useUser } from '../../contexts/UserContext';
import AuthForm from '../../components/AuthForm';

const UserInfo = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  background-color: #fff;
  border: 1px solid lightgray;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Middle = styled.div`
  color: #adb5bd;
  font-size: 12px;
  margin: 5px 0 10px 1px;
`;
const Bottom = styled.div`
  display: flex;
  div {
    :first-child {
      margin-left: -19px;
    }
    width: 100px;
    color: #868e96;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 10px;
  }
  .num {
    margin-top: 5px;
    font-size: 20px;
    color: royalblue;
    font-weight: bold;
  }
`;
const Image = styled.div`
  width: 150px;
  height: 150px;
  font-size: 25px;
  letter-spacing: 2px;
  margin-right: 30px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #dee2e6;
`;
const Info = styled.div`
  flex: 1;
`;
const Button = styled.button`
  border: none;
  cursor: pointer;
  padding: 7px 10px;
  margin-left: 10px;
  border-radius: 2px;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
`;

const UserInfoProfile = () => {
  const t = useT();
  const user = useUser();
  const setUser = useSetUser();
  const location = useLocation();
  const id = location.pathname.split('/')[3] || location.state?.memberId;
  const isCurrentUser = +user?.id === +id;
  const [toggle, setToggle] = useState(false);

  const onSubmit = (ok, state) => {
    console.log('UserInfoProfile onSubmit', ok, state);
    let body = {
      name: state.name,
      age: state.age,
      loginId: state.loginId,
      password: state.password,
      address: state.address,
    };
    ok &&
      memberApi
        .fixUser(user.id, body, t)
        .then(({ data }) => {
          console.log('fixUser', data);
          setUser((prev) => {
            console.log('setUser prev', prev);
            return {
              ...prev,
              user: { ...prev.user, ...data },
            };
          });
          setToggle(false);
        })
        .catch((err) => {
          console.log('fixUser', err);
        });
  };

  const quitMember = () => {
    console.log('quitMember', user.id, t);
    const ok = window.confirm('회원을 탈퇴하시겠습니까?');
    ok &&
      memberApi
        .quitUser(user.id, t)
        .then((res) => {
          console.log('fixUser', res);
          localStorage.removeItem('user');
          window.location.href = '/';
        })
        .catch((err) => {
          console.log('fixUser', err);
        });
  };

  const initialState = {
    loginId: user?.loginId,
    name: user?.name,
    age: user?.age,
    password: '',
    address: '',
  };

  return (
    <UserInfo>
      <Image>{user?.name}</Image>
      <Info>
        <Top>
          <div>{user?.name}</div>
          {isCurrentUser && (
            <div>
              <Button onClick={() => setToggle(!toggle)}>
                {!toggle ? '회원정보수정' : '취소하기'}
              </Button>
              <Button onClick={quitMember}>회원탈퇴</Button>
            </div>
          )}
        </Top>

        {!toggle ? (
          <>
            <Middle>
              <span>{`나이: ${user?.age} / 주소: ${user?.address}`}</span>
            </Middle>

            <Bottom>
              <div>
                <span>활동 점수</span>
                <span className="num">{user?.activeScore}</span>
              </div>
              <div>
                <span>게시물 수</span>
                <span className="num">{1}</span>
              </div>
              <div>
                <span>댓글 수</span>
                <span className="num">{1}</span>
              </div>
            </Bottom>
          </>
        ) : (
          <AuthForm
            text="저장하기"
            onSubmit={onSubmit}
            initialState={initialState}
          />
        )}
      </Info>
    </UserInfo>
  );
};

export default UserInfoProfile;
