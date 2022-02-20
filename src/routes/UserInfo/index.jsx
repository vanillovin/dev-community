import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { memberApi } from '../../api';
import AuthForm from '../../components/AuthForm';
import { useT, useUser } from '../../context';
import { Route, Switch, useLocation } from 'react-router';
import { FaSlideshare } from 'react-icons/fa';

import * as S from './style';
import UserInfoProfile from './UserInfoProfile';
import NoticeBoard from './NoticeBoard';
import UserInfoBoard from './UserInfoBoard';

const UserInfo = () => {
  const t = useT();
  const user = useUser();
  const location = useLocation();
  const id = location.pathname.split('/')[3] || location.state?.memberId;
  const isCurrentUser = +user?.id === +id;
  const [toggle, setToggle] = useState(false);
  console.log('UserInfo isCurrentUser?', isCurrentUser);

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
          .then((res) => {
            console.log('fixUser', res);
            window.location.reload();
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
    <S.Container>
      <UserInfoProfile />

      {true ? (
        <S.UserActivity>
          <S.Activity>
            <Switch>
              <Route exact path={`/user/info/${id}`}>
                {isCurrentUser ? (
                  <NoticeBoard id={id} />
                ) : (
                  <UserInfoBoard id={id} name="boards" />
                )}
              </Route>
              {isCurrentUser && (
                <Route exact path={`/user/info/${id}/notices`}>
                  <NoticeBoard id={id} />
                </Route>
              )}
              <Route exact path={`/user/info/${id}/posts`}>
                <UserInfoBoard id={id} name="boards" />
              </Route>
              <Route exact path={`/user/info/${id}/comments`}>
                <UserInfoBoard id={id} name="comments" />
              </Route>
              <Route exact path={`/user/info/${id}/scrapped`}>
                <UserInfoBoard id={id} name="scraps" />
              </Route>
            </Switch>
          </S.Activity>

          <S.ToggleList>
            {isCurrentUser && (
              <S.Item active={location.pathname.includes('notices')}>
                <Link
                  to={{
                    pathname: `/user/info/${id}/notices`,
                    state: { memberId: id },
                  }}
                >
                  알림
                </Link>
              </S.Item>
            )}
            <S.Item active={location.pathname.includes('posts')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/posts`,
                  state: { memberId: id },
                }}
              >
                게시물
              </Link>
            </S.Item>
            <S.Item active={location.pathname.includes('comments')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/comments`,
                  state: { memberId: id },
                }}
              >
                댓글
              </Link>
            </S.Item>
            <S.Item active={location.pathname.includes('scrapped')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/scrapped`,
                  state: { memberId: id },
                }}
              >
                스크랩
              </Link>
            </S.Item>
          </S.ToggleList>
        </S.UserActivity>
      ) : (
        <div>loading...</div>
      )}
    </S.Container>
  );
};

export default UserInfo;
