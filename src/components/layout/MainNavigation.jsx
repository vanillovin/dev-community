import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MdNotifications } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import memberApi from '../../apis/memberApi';
import { useSetUser, useUser } from '../../contexts/UserContext';
import { customMedia } from '../../commons/styles/GlobalStyles';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import NavigationMenu from './NavigationMenu';

const HeaderContainer = styled.header`
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;
  background-color: #4c6ef5;
  z-index: 100;
  ul,
  li {
    padding: 0;
    list-style: none;
  }
  ${customMedia.lessThan('tablet')`
    width: 100%;
    height: 60px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  `}
`;
const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${customMedia.lessThan('tablet')`
    order: 2;
    margin: 0;
    font-size: 1.1rem;
    height: 60px;
  `}
`;
const UserContainer = styled.div`
  width: 100%;
  height: 150px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .username {
    padding: 4px 8px;
    line-height: 1.2;
    text-align: center;
  }
  .topUser {
    display: flex;
    align-items: center;
  }
  .bot {
    display: flex;
    .noticeCircle {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #fa5252;
    }
  }
  ${customMedia.lessThan('tablet')`
    all: unset;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  `}
`;
const ButtonContainer = styled.div`
  width: 100%;
  font-size: 14px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  .btn {
    all: unset;
    width: 50%;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    :first-child {
      border-right: 1px solid rgba(255, 255, 255, 0.6);
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  ${customMedia.lessThan('tablet')`
    border: 0;
    width: 50%;
    .btn { border: 0 }
  `}
`;
const AuthContainer = styled(UserContainer)`
  font-size: 14px;
  flex-direction: row;
  ${customMedia.lessThan('tablet')`
    all: unset;
    order: 3;
  `}
`;
const Toggle = styled.div`
  ${customMedia.lessThan('tablet')`
    order: 3;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .usercon {
      font-size: 13px;
      width: 100%;
      margin-right: 10px; 
      min-width: 200px;
    }
    .content {
      margin: 0;
    }
    .authcon {
      font-size: 13px;
      min-width: 100px;
      display: flex;
      width: 50%;
      margin-right: 10px; 
    }
    .usercon .content {
      font-size: 13px;
      margin-left: 5px;
    }
    .authcon a:first-child,
    .usercon .btn {
      border: 0;
    }
  `}
`;
const SLink = styled(Link)`
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.1s linear;
  &:hover:not(.logo) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &.logo {
    height: 70px;
    font-size: 24px;
    justify-content: center;
  }
  &.auth {
    padding: 0;
    height: 30px;
    justify-content: center;
    :first-child {
      border-right: 1px solid rgba(255, 255, 255, 0.6);
    }
  }
`;

function useNotice(userId) {
  return useQuery('Notice', () =>
    memberApi.getNoticeCounts(userId).then((res) => res.data)
  );
}

// 화면에 보여주는 로직 - view
function TopUser({ user }) {
  // 유저가있을때 로그인했을때
  const { data } = useNotice(user?.id);
  return (
    <Link
      className="topUser"
      to={{
        pathname: `/user/info/${user.id}`,
        state: { memberId: user?.id },
      }}
    >
      <div className="username">{user.name}</div>
      <div className="bot">
        <MdNotifications />
        {data?.count > 0 && <div className="noticeCircle"></div>}
      </div>
    </Link>
  );
}

const MainNavigation = () => {
  const user = useUser();
  const setUser = useSetUser();
  const history = useHistory();
  const { width } = useWindowDimensions();

  const logout = () => {
    localStorage.removeItem('user');
    setUser({
      loading: true,
      t: null,
      user: null,
      error: null,
    });
    history.push('/');
  };

  return (
    <HeaderContainer>
      <Logo>
        <Link className="logo" to="/">
          Serenity
        </Link>
      </Logo>

      <Toggle>
        {/* <button className="dropbtn">
          <AiFillSetting />
        </button> */}
        {user ? (
          <UserContainer className="usercon">
            <TopUser user={user} />
            <ButtonContainer className="content">
              <button
                className="btn"
                onClick={() => {
                  history.push({ pathname: '/write', state: { type: '' } });
                }}
              >
                글쓰기
              </button>
              <button className="btn" onClick={logout}>
                로그아웃
              </button>
            </ButtonContainer>
          </UserContainer>
        ) : (
          <AuthContainer className="authcon">
            <SLink className="auth" to="/signup">
              회원가입
            </SLink>
            <SLink className="auth" to="/login">
              로그인
            </SLink>
          </AuthContainer>
        )}
      </Toggle>

      <NavigationMenu width={width} />
    </HeaderContainer>
  );
};

export default MainNavigation;
