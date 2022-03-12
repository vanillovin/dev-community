import React from 'react';
import { Route, Switch, useLocation } from 'react-router';
import styled from 'styled-components';

import { useUser } from '../contexts/UserContext';
import UserInfoProfile from '../components/UserInfo/UserInfoProfile';
import UserInfoBoard from '../components/UserInfo/UserInfoBoard';
import NoticeBoard from '../components/UserInfo/NoticeBoard';
import ToggleList from '../components/UserInfo/ToggleList';
import { customMedia } from '../commons/styles/GlobalStyles';

const Container = styled.div`
  width: 800px;
  ul,
  li {
    list-style: none;
  }
  ${customMedia.lessThan('tablet')`
    width: 100%;
    padding: 15px;
  `}
`;
const UserActivity = styled.div`
  width: 100%;
  display: flex;
`;
const Activity = styled.div`
  width: 85%;
  margin-right: 20px;
`;

const UserInfo = () => {
  const location = useLocation();
  const memberId = location.pathname.split('/')[3] || location.state?.memberId;
  const user = useUser();
  const isCurrentUser = +user?.id === +memberId;

  return (
    <Container>
      <UserInfoProfile />

      <UserActivity>
        <Activity>
          <Switch>
            <Route exact path={`/user/info/${memberId}`}>
              {isCurrentUser ? (
                <NoticeBoard id={memberId} />
              ) : (
                <UserInfoBoard id={memberId} name="boards" />
              )}
            </Route>
            {isCurrentUser && (
              <Route exact path={`/user/info/${memberId}/notices`}>
                <NoticeBoard id={memberId} />
              </Route>
            )}
            <Route exact path={`/user/info/${memberId}/posts`}>
              <UserInfoBoard id={memberId} name="boards" />
            </Route>
            <Route exact path={`/user/info/${memberId}/comments`}>
              <UserInfoBoard id={memberId} name="comments" />
            </Route>
            <Route exact path={`/user/info/${memberId}/scrapped`}>
              <UserInfoBoard id={memberId} name="scraps" />
            </Route>
          </Switch>
        </Activity>

        <ToggleList isCurrentUser={isCurrentUser} memberId={memberId} />
      </UserActivity>
    </Container>
  );
};

export default UserInfo;
