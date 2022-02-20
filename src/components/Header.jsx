import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  AiOutlineQuestion,
  AiFillWechat,
  AiOutlineCodepen,
} from 'react-icons/ai';
import { MdNotifications } from 'react-icons/md';
import { useUser } from '../context';
import { useQuery } from 'react-query';
import { memberApi } from '../api';
import { useHistory } from 'react-router-dom';

const HeaderContainer = styled.div`
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
`;
const Logo = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
`;
const List = styled.ul``;
const Item = styled.li`
  width: 100%;
  height: 60px;
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
    padding: 0 10px;
    line-height: 1.2;
    text-align: center;
    :hover {
      text-decoration: underline;
    }
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
`;
const ButtonContainer = styled.div`
  width: 100%;
  font-size: 14px;
  margin-top: 20px;
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
`;
const AuthContainer = styled(UserContainer)`
  font-size: 14px;
  flex-direction: row;
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
const Icon = styled.div`
  margin-right: 18px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 50%;
  border: 1px solid white;
`;
const Text = styled.div`
  font-size: 15px;
`;

// 대충 할일목록 ->< 나중에 문제가 생기면 고치기 ^^

// 앱상태(폼, 다크모드, user preference) <-> 서버와 동기화 되는 상태

// react-query로 만든 custom hook
// 파일을 따로 분리!
// 컴포넌트 쪼개기, custom hook - 모든걸 커스텀훅 로직으로 만들어야함
// 역할을 잘 나누기 위해서!
// 역할을 잘 나눠서 빼기!!!~!!!식별해서 (화면을보여주는로직 vs 상태로직) 분리
// react query에게 적절한 캐시키와 api 함수를 넣어주는 것!
// 로직을 작게 쪼개기 위해서... 보너스로 좋은 점 중 하나임
// 중복의 제거?... 보너스로 좋은 점 중 하나임

// 서버에서 데이터를 가져와서 캐시 상태에 넣어두는 로직
// 상태 로직 / state, redux => 상태 로직
// react-query : 서버와 동기화 되는 상태를 캐시로 관리하는 라이브러리
// api 요청 함수 파일 <-> 요청한 것을 리액트 쿼리라는 상태관리 라이브러리에 넣은 것.
function useNotice(userId) {
  return useQuery('Notice', () =>
    memberApi.getNoticeCounts(userId).then((res) => res.data)
  );
}

//  화면을 보여주는 로직 view
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

const Header = () => {
  const user = useUser();
  const history = useHistory();
  console.log('Header user', user);

  const logout = () => {
    localStorage.removeItem('user');
    // state, history
    window.location.href = '/';
  };

  return (
    <HeaderContainer>
      <Logo>
        <SLink className="logo" to="/">
          Serenity
        </SLink>
      </Logo>
      <>
        {user ? (
          <UserContainer>
            <TopUser user={user} />
            <ButtonContainer>
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
          <AuthContainer>
            <SLink className="auth" to="/signup">
              회원가입
            </SLink>
            <SLink className="auth" to="/login">
              로그인
            </SLink>
          </AuthContainer>
        )}
      </>

      <List>
        <Item>
          <SLink
            to={{
              pathname: '/board/qna',
              state: { type: 'qna', sort: 'createdDate' },
              search: '?sort=createdDate&page=1',
            }}
          >
            <Icon>
              <AiOutlineQuestion />
            </Icon>
            <Text>Q&amp;A</Text>
          </SLink>
        </Item>
        <Item>
          <SLink
            to={{
              pathname: '/board/tech',
              state: { type: 'tech', sort: 'createdDate' },
              search: '?sort=createdDate&page=1',
            }}
          >
            <Icon>
              <AiOutlineCodepen />
            </Icon>
            <Text>Tech</Text>
          </SLink>
        </Item>
        <Item>
          <SLink
            to={{
              pathname: '/board/free',
              state: { type: 'free', sort: 'createdDate' },
              search: '?sort=createdDate&page=1',
            }}
          >
            <Icon>
              <AiFillWechat />
            </Icon>
            <Text>자유게시판</Text>
          </SLink>
        </Item>
      </List>
    </HeaderContainer>
  );
};

export default Header;
