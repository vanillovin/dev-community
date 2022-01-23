import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  AiOutlineQuestion,
  AiFillWechat,
  AiOutlineCodepen
} from 'react-icons/ai';
import { MdNotifications } from 'react-icons/md';
import { useUser } from '../context';
import { useQuery } from 'react-query';
import { memberApi } from '../api';

const HeaderContainer = styled.div`
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;
  background-color: #4c6ef5;
  z-index: 100;
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

const Header = () => {
  const user = useUser();
  const history = useHistory();
  // console.log('Header user', user);
  
  // 유저가있을때 로그인했을때
  const { data } = useQuery('Notice', () =>
    memberApi.getNoticeCounts(user?.id).then(res => res.data));

  const logout = () => {
    localStorage.removeItem('user');
    // state, history
    window.location.href = '/';
  };  

  return (
    <HeaderContainer>
      <Logo>
        <SLink className="logo" to="/">
          LOGO
        </SLink>
      </Logo>
      <>
        {user ? (
          <UserContainer>
            <Link
              className='topUser'
              to = {{
                pathname: `/user/info/${user.id}`,
                state: { memberId: user.id },
              }}

            >
              <div className="username">{user.data.name}</div>
              <div className='bot'>
                <MdNotifications />
                {data?.count > 0 && <div className='noticeCircle'></div>}
              </div>
            </Link>
            <ButtonContainer>
              <button
                className="btn"
                onClick={() =>
                  history.push({
                    pathname: '/write',
                    state: { type: '' },
                  })
                }
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
              state: { type: 'qna', sort: 'id' },
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
              state: { type: 'tech', sort: 'id' },
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
              state: { type: 'free', sort: 'id' },
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
