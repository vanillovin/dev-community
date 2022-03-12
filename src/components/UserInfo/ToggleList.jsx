import React from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

export const List = styled.ul`
  margin: 0;
  padding: 0;
  width: 15%;
`;
export const Item = styled.li`
  list-style: none;
  padding: 6px 14px;
  cursor: pointer;
  &:hover {
    background-color: #e9ecef;
  }
  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      border-left: 3px solid #adb5bd;
    `}
`;

const ToggleList = ({ isCurrentUser, memberId }) => {
  const location = useLocation();

  return (
    <List>
      {isCurrentUser && (
        <Item active={location.pathname.includes('notices')}>
          <Link
            to={{
              pathname: `/user/info/${memberId}/notices`,
              state: { memberId },
              search: '?page=1',
            }}
          >
            알림
          </Link>
        </Item>
      )}
      {[
        ['게시물', 'posts'],
        ['댓글', 'comments'],
        ['스크랩', 'scrapped'],
      ].map(([text, name]) => (
        <Item key={name} active={location.pathname.includes(name)}>
          <Link
            to={{
              pathname: `/user/info/${memberId}/${name}`,
              state: { memberId },
              search: '?page=1',
            }}
          >
            {text}
          </Link>
        </Item>
      ))}
    </List>
  );
};

export default ToggleList;
