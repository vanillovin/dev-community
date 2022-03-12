import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  AiOutlineQuestion,
  AiFillWechat,
  AiOutlineCodepen,
  AiOutlineMenu,
} from 'react-icons/ai';

const List = styled.ul``;
const Item = styled.li`
  width: 100%;
  height: 60px;
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
const Text = styled.div`
  font-size: 15px;
`;
const ToggleMenu = styled.div`
  height: 60px;
  order: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  a {
    float: left;
    font-size: 16px;
    color: white;
    text-align: center;
    padding: 14px 16px;
  }
  .dropdown {
    float: left;
    overflow: hidden;
  }
  .dropdown .dropbtn {
    height: 100%;
    cursor: pointer;
    font-size: 1.2rem;
    border: none;
    outline: none;
    color: white;
    padding: 16px 24px;
    background-color: inherit;
    font-family: inherit;
    margin: 0;
  }
  .dropdown-content {
    z-index: 1;
    display: none;
    min-width: 160px;
    position: absolute;
    background-color: white;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  }
  .dropdown-content a {
    float: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
  }
  .dropdown-content a:hover {
    background-color: #e9e9e9;
  }
  .dropdown:hover .dropdown-content {
    display: block;
  }
`;

export default function NavigationMenu({ width }) {
  return width > 800 ? (
    <List>
      <Item>
        <SLink
          to={{
            pathname: '/board/qna',
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
  ) : (
    <ToggleMenu>
      <div className="dropdown">
        <button className="dropbtn">
          <AiOutlineMenu />
        </button>
        <div className="dropdown-content">
          <Link to="/board/qna">Q&amp;A</Link>
          <Link to="/board/tech">Tech</Link>
          <Link to="/board/free">자유게시판</Link>
        </div>
      </div>
    </ToggleMenu>
  );
}
