import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { memberApi } from '../api';
import AuthForm from '../components/AuthForm';
import { useT, useUser } from '../context';
import { withRouter } from 'react-router';

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
  .board {
    width: 85%;
    margin-right: 15px;
    border-radius: 2px;
    background-color: #fff;
    border: 1px solid lightgray;
  }
`;
const ToggleList = styled.ul`
  width: 15%;
`;
const Item = styled.li`
  padding: 8px;
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
  flex-direction: column;
  justify-content: center;
  border-bottom: ${(props) => (props.fci ? 'none' : '1px solid lightgray')};
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
    posts: [],
    comments: [],
  });
  const { loading, userInfo, posts, comments } = state;
  const [toggle, setToggle] = useState({
    editT: false,
    postT: true,
    cmtT: false,
  });
  const { editT, postT, cmtT } = toggle;

  const fetchData = async () => {
    const id = memberId ? memberId : user.id;
    try {
      const { data: userInfo } = await memberApi.getUser(id);
      console.log('userGet', userInfo);
      const {
        data: { contents: posts },
      } = await memberApi.getUserPosts(id, 1);
      const {
        data: { contents: comments },
      } = await memberApi.getUserComments(id, 1);
      setState({
        ...state,
        userInfo,
        loading: false,
        posts,
        comments,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
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
          <div>name: {userInfo.name}</div>
          <div>age: {userInfo.age}</div>
          <div>id: {userInfo.loginId}</div>
          <div>address: {userInfo.address}</div>
          {user && user.id === memberId && (
            <div>
              <button onClick={() => onToggle('edit')}>회원정보수정</button>
              {editT && (
                <AuthForm
                  initialState={initialState}
                  onSubmit={onSubmit}
                  text="저장하기"
                />
              )}
              <button onClick={quitMember}>회원탈퇴</button>
            </div>
          )}
        </UserInfo>
      )}

      {!loading ? (
        <UserActivity>
          <div className="board">
            {postT ? (
              <Comp arr={posts} name="게시물" />
            ) : (
              <Comp arr={comments} name="댓글" />
            )}
          </div>
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
