import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { memberApi } from '../api';
import AuthForm from '../components/AuthForm';
import { useT, useUser } from '../context';
import { withRouter } from 'react-router';
import PageList from '../components/PageList';

const Container = styled.div`
  width: 750px;
`;
const UserInfo = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 30px;
  background-color: #fff;
  border: 1px solid lightgray;
`;
const UserActivity = styled.div`
  width: 100%;
  display: flex;
  border-radius: 2px;
`;
const Activity = styled.div`
  width: 85%;
  margin-right: 20px;
`;
const ToggleList = styled.ul`
  width: 15%;
`;
const Item = styled.li`
  padding: 10px 14px;
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
const Post = styled.div`
  padding: 10px;
  display: flex;
  background-color: white;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: ${(props) => props.fci && '1px solid lightgray'};
  .bot {
    margin-top: 10px;
  }
  .type {
    cursor: pointer;
    font-size: 12px;
    padding: 2px 3px;
    margin-right: 5px;
    border-radius: 2px;
    background-color: #bac8ff;
    :hover {
      background-color: #91a7ff;
    }
  }
  .id {
    color: gray;
    font-size: 13px;
    margin-right: 10px;
  }
  .date {
    font-size: 11px;
    color: lightgray;
  }
  .title {
    font-size: 13px;
    cursor: pointer;
    color: royalblue;
    :hover {
      text-decoration: underline;
    }
  }
`;
const Button = styled.button`
  margin-top: 15px;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 10px;
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

const Comp = ({ arr, name }) => {
  return arr && arr.length > 0 ? (
    arr.map((item) => (
      <Post key={item.id} fci={arr[arr.length - 1].id === item.id}>
        <div>
          <Link
            to={`/board/${
              (item.boardType === 'QNA' && 'qna') ||
              (item.boardType === 'TECH' && 'tech') ||
              (item.boardType === 'FREE' && 'free')
            }`}
            className="type"
          >
            {(item.boardType === 'QNA' && 'Q&A') ||
              (item.boardType === 'TECH' && 'Tech') ||
              (item.boardType === 'FREE' && 'Free')}
          </Link>
          <span className="id">
            {name === '게시물'
              ? `에 #${item.id} 게시물을 작성하였습니다.`
              : `#${item.id} 게시물에 댓글을 남겼습니다.`}
          </span>
          <span className="date">
            {`${item.createdDate.split('T')[0]} ${item.createdDate
              .split('T')[1]
              .substring(0, 8)}`}
          </span>
        </div>
        <div className="bot">
          <Link
            to={`/board/${
              (item.boardType === 'QNA' && 'qna') ||
              (item.boardType === 'TECH' && 'tech') ||
              (item.boardType === 'FREE' && 'free')
            }/${item.id}`}
            className="title"
          >
            {item.title}
          </Link>
        </div>
      </Post>
    ))
  ) : (
    <div>작성한 {name}이 없습니다.</div>
  );
};

const Profile = ({
  location: {
    state: { memberId },
  },
}) => {
  const t = useT();
  const user = useUser();

  const [state, setState] = useState({
    loading: true,
    userInfo: {},
    posts: {
      totalPage: null,
      currentPage: null,
      totalElements: null,
      contents: [],
    },
    comments: {
      totalPage: null,
      currentPage: null,
      totalElements: null,
      contents: [],
    },
  });
  const { loading, userInfo, posts, comments } = state;
  const [toggle, setToggle] = useState({
    editT: false,
    postT: true,
    cmtT: false,
  });
  const { editT, postT, cmtT } = toggle;

  const fetchContents = async (num) => {
    const id = memberId ? memberId : user.id;
    try {
      const { data: userInfo } = await memberApi.getUser(id);
      console.log('userGet', userInfo);

      const { data: p } = await memberApi.getUserPosts(id, num);
      console.log('Profile posts', p);

      const { data: c } = await memberApi.getUserComments(id, num);
      console.log('Profile comments', c);

      setState({
        ...state,
        userInfo,
        loading: false,
        posts: {
          ...posts,
          totalPage: p.totalPage,
          currentPage: p.currentPage,
          totalElements: p.totalElements,
          contents: p.contents,
        },
        comments: {
          ...comments,
          totalPage: c.totalPage,
          currentPage: c.currentPage,
          totalElements: c.totalElements,
          contents: c.contents,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchContents(1);
  }, [memberId]);

  const onToggle = (txt) =>
    (txt === 'posts' && setToggle({ ...toggle, postT: true, cmtT: false })) ||
    (txt === 'cmts' && setToggle({ ...toggle, postT: false, cmtT: true })) ||
    (txt === 'edit' && setToggle((prev) => ({ ...prev, editT: !editT })));

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
            window.location.href = `/profile/${user.id}`;
          })
          .catch((err) => {
            console.log('fixUser', err);
          })
      : alert('모두 입력해 주세요');
  };

  const quitMember = () => {
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
          <div>이름: {userInfo.name}</div>
          <div>나이: {userInfo.age}</div>
          <div>아이디: {userInfo.loginId}</div>
          <div>주소: {userInfo.address}</div>
          {user && user.id === memberId && (
            <div>
              <Button onClick={() => onToggle('edit')}>회원정보수정</Button>
              <Button onClick={quitMember}>회원탈퇴</Button>
              {editT && (
                <div style={{ marginTop: 15 }}>
                  <AuthForm
                    initialState={initialState}
                    onSubmit={onSubmit}
                    text="저장하기"
                  />
                </div>
              )}
            </div>
          )}
        </UserInfo>
      )}

      {!loading ? (
        <UserActivity>
          <Activity>
            {postT ? (
              <>
                <Comp arr={posts.contents} name="게시물" />
                {posts.totalElements > 0 && (
                  <PageList
                    fetchContents={fetchContents}
                    totalPage={posts.totalPage}
                    currentPage={posts.currentPage}
                  />
                )}
              </>
            ) : (
              <>
                <Comp arr={comments.contents} name="댓글" />
                {comments.totalElements > 0 && (
                  <PageList
                    fetchContents={fetchContents}
                    totalPage={comments.totalPage}
                    currentPage={comments.currentPage}
                  />
                )}
              </>
            )}
          </Activity>
          <ToggleList>
            <Item active={postT} onClick={() => onToggle('posts')}>
              게시물
            </Item>
            <Item active={cmtT} onClick={() => onToggle('cmts')}>
              댓글
            </Item>
          </ToggleList>
        </UserActivity>
      ) : (
        <div></div>
      )}
    </Container>
  );
};

export default withRouter(Profile);
