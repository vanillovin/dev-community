import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  AiOutlineQuestion,
  AiFillWechat,
  AiOutlineCodepen,
} from 'react-icons/ai';
import { useUser } from '../context';

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
const List = styled.ul`
  /* border: 1px solid white; */
`;
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
  /* border: 1px solid white; */
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
  margin-right: 22px;
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
  const history = useHistory();
  const user = useUser();
  console.log('Header', user);

  const logout = () => {
    localStorage.removeItem('user');
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
            <Link to="/profile">
              <div>{user.name}님</div>
            </Link>
            <ButtonContainer>
              <button className="btn" onClick={() => history.push('/write')}>
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
          <SLink to="/board/qna">
            <Icon>
              <AiOutlineQuestion />
            </Icon>
            <Text>Q&amp;A</Text>
          </SLink>
        </Item>
        <Item>
          <SLink to="/board/tech">
            <Icon>
              <AiOutlineCodepen />
            </Icon>
            <Text>Tech</Text>
          </SLink>
        </Item>
        <Item>
          <SLink to="/board/free">
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
