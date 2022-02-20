import React, { useState } from 'react';
import { useLocation } from 'react-router';

import * as S from './style';
import { memberApi } from '../../api';
import { useSetUser, useT, useUser } from '../../context';
import AuthForm from '../../components/AuthForm';

const UserInfoProfile = () => {
  const t = useT();
  const user = useUser();
  const setUser = useSetUser();
  const location = useLocation();
  const id = location.pathname.split('/')[3] || location.state?.memberId;
  const isCurrentUser = +user?.id === +id;
  const [toggle, setToggle] = useState(false);
  console.log('UserInfoProfile user', user, +user?.id === +id);

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
          })
          .catch((err) => {
            console.log('fixUser', err);
          })
      : alert('모두 입력해 주세요');
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
    <S.UserInfo>
      <S.Image>{user?.name}</S.Image>
      <S.Info>
        <S.Top>
          <div>{user?.name}</div>
          {isCurrentUser && (
            <div>
              <S.Button onClick={() => setToggle(!toggle)}>
                {!toggle ? '회원정보수정' : '취소하기'}
              </S.Button>
              <S.Button onClick={quitMember}>회원탈퇴</S.Button>
            </div>
          )}
        </S.Top>

        {!toggle ? (
          <>
            <S.Middle>
              <span>{`나이: ${user?.age} / 주소: ${user?.address}`}</span>
            </S.Middle>

            <S.Bottom>
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
            </S.Bottom>
          </>
        ) : (
          <AuthForm
            text="저장하기"
            onSubmit={onSubmit}
            initialState={initialState}
          />
        )}
      </S.Info>
    </S.UserInfo>
  );
};

export default UserInfoProfile;
