import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { memberApi } from '../api';
import AuthForm from '../components/AuthForm';
import { useT, useUser } from '../context';
import { Route, Switch, useLocation } from 'react-router';
import UserInfoBoard from '../components/UserInfoBoard';
import PageList from '../components/PageList';
import NoticeBoard from '../components/NoticeBoard';

const Container = styled.div`
  width: 750px;
  ul,
  li {
    list-style: none;
  }
`;
const UserInfo = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  background-color: #fff;
  border: 1px solid lightgray;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mid {
    color: #adb5bd;
    font-size: 12px;
    margin: 5px 0 10px 1px;
  }
  .bot {
    display: flex;
    & > div {
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
  border: 1px solid #dee2e6;
`;
const Info = styled.div`
  flex: 1;
`;
const UserActivity = styled.div`
  width: 100%;
  display: flex;
`;
const Activity = styled.div`
  width: 85%;
  margin-right: 20px;
`;
const ToggleList = styled.ul`
  margin: 0;
  padding: 0;
  width: 15%;
`;
const Item = styled.li`
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
const Button = styled.button`
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 2px;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
`;

const Profile = () => {
  const t = useT();
  const user = useUser();
  const location = useLocation();
  const id = location.pathname.split('/')[3] || location.state?.memberId;
  const isCurrentUser = user.id === Number(id);

  const [toggle, setToggle] = useState(false);
  const [state, setState] = useState({
    loading: true,
    userInfo: {},
    posts: {
      contents: [],
      commentsLength: null,
      totalPages: null,
      currentPage: null,
      totalElements: null,
    },
  });
  const { loading, userInfo, posts } = state;

  const fetchData = async (num) => {
    console.log('fetchData num', num);
    try {
      const { data: userInfo } = await memberApi.getUser(id);
      // console.log('userGet', userInfo);
      const { data: p } = await memberApi.getUserPosts(id, num);
      // console.log('Profile posts', p);
      const { data: c } = await memberApi.getUserComments(id, 1);
      // console.log('Profile comments', c);

      setState({
        ...state,
        userInfo,
        loading: false,
        posts: {
          ...posts,
          contents: p.contents,
          commentsLength: c.totalElements,
          totalPages: p.totalPages,
          currentPage: p.currentPage,
          totalElements: p.totalElements,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

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
    loginId: user && user.data.loginId,
    name: user && user.data.name,
    age: user && user.data.age,
    password: '',
    address: '',
  };

  return (
    <Container>
      {userInfo && (
        <UserInfo>
          <Image>
            {userInfo.name && userInfo.name.length > 6
              ? userInfo.name.substring(0, 6)
              : userInfo.name}
          </Image>
          <Info>
            <div className="top">
              <div style={{ fontSize: 25, letterSpacing: 2 }}>
                {userInfo.name}
              </div>
              {isCurrentUser && (
                <div>
                  <Button onClick={() => setToggle(!toggle)}>
                    {!toggle ? '회원정보수정' : '취소하기'}
                  </Button>
                  <Button onClick={quitMember}>회원탈퇴</Button>
                </div>
              )}
            </div>

            {!toggle ? (
              <>
                <div className="mid">
                  <span>
                    {user &&
                      `나이: ${userInfo.age} / 주소: ${userInfo.address}`}
                  </span>
                </div>

                <div className="bot">
                  <div style={{ marginLeft: -18 }}>
                    <span>활동 점수</span>
                    <span className="num">{userInfo.activeScore}</span>
                  </div>
                  <div>
                    <span>게시물 수</span>
                    <span className="num">{posts.totalElements}</span>
                  </div>
                  <div>
                    <span>댓글 수</span>
                    <span className="num">{posts.commentsLength}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ margin: '15px 0' }}>
                <AuthForm
                  text="저장하기"
                  onSubmit={onSubmit}
                  initialState={initialState}
                />
              </div>
            )}
          </Info>
        </UserInfo>
      )}

      {!loading ? (
        <UserActivity>
          <Activity>
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
          </Activity>

          <ToggleList>
            {isCurrentUser && (
              <Item active={location.pathname.includes('notices')}>
                <Link
                  to={{
                    pathname: `/user/info/${id}/notices`,
                    state: { memberId: id },
                  }}
                >
                  알림
                </Link>
              </Item>
            )}
            <Item active={location.pathname.includes('posts')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/posts`,
                  state: { memberId: id },
                }}
              >
                게시물
              </Link>
            </Item>
            <Item active={location.pathname.includes('comments')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/comments`,
                  state: { memberId: id },
                }}
              >
                댓글
              </Link>
            </Item>
            <Item active={location.pathname.includes('scrapped')}>
              <Link
                to={{
                  pathname: `/user/info/${id}/scrapped`,
                  state: { memberId: id },
                }}
              >
                스크랩
              </Link>
            </Item>
          </ToggleList>
        </UserActivity>
      ) : (
        <div>?</div>
      )}
    </Container>
  );
};

export default Profile;
