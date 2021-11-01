import React, { useState, useEffect } from 'react';
import { boardApi, memberApi } from '../api';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useUser } from '../context';

const Container = styled.div``;
const Header = styled.div`
  display: flex;
  padding: 0 2px;
  align-items: center;
  justify-content: space-between;
  div:first-child {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  div:last-child {
    cursor: pointer;
    font-size: 12px;
    :hover {
      font-weight: bold;
    }
  }
`;
const PostContainer = styled.div`
  padding: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  border-bottom: ${(props) => (props.lc ? 'none' : '1px solid lightgray')};
  .post-left {
    /* border: 1px solid black; */
    width: 70%;
    cursor: pointer;
    color: royalblue;
    line-height: 1.2;
    :hover {
      text-decoration: underline royalblue;
    }
  }
  .post-right {
    /* border: 1px solid black; */
    width: 30%;
    text-align: end;
    .username {
      font-size: 11px;
    }
    .date {
      color: gray;
      font-size: 10px;
      margin-left: 4px;
    }
  }
`;

const HomeBoard = ({ title, type }) => {
  const user = useUser();
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    posts: [],
    err: null,
  });
  const { loading, posts, err } = state;

  const fetchPosts = async () => {
    try {
      let response;
      if (type === 'user') {
        response = await memberApi.getUserPosts(user.id);
        console.log('Board getPosts res', response.data);
        setState({
          ...state,
          loading: false,
          posts: response.data._embedded.boardRetrieveOneResponseDtoList.slice(
            0,
            9
          ),
        });
      } else {
        response = await boardApi.getPosts(1, type);
        console.log('Board getPosts res', response.data);
        setState({
          ...state,
          loading: false,
          posts: response.data.contents.slice(0, 9),
        });
      }
    } catch (err) {
      console.log(err);
      setState({ ...state, error: err });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  function displayedAt(createdAt) {
    const dateStr = `${createdAt.split('T')[0]} ${
      createdAt.split('T')[1].split('.')[0]
    }`;
    const date = new Date(dateStr);
    const milliSeconds = new Date() - date.getTime();
    const seconds = milliSeconds / 1000;
    if (seconds < 60) return `방금 전`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;
    const weeks = days / 7;
    if (weeks < 5) return `${Math.floor(weeks)}주 전`;
    const months = days / 30;
    if (months < 12) return `${Math.floor(months)}개월 전`;
    const years = days / 365;
    return `${Math.floor(years)}년 전`;
  }

  const morePost = () => {
    if (type === 'user') history.push(`profile`);
    else history.push(`board/${type}`);
  };

  return (
    <Container>
      <Header>
        <div>{title}</div>
        <div onClick={morePost}>더 보기</div>
      </Header>
      <div>
        {!loading ? (
          <div style={{ border: '1px solid lightgray' }}>
            {posts &&
              posts.map((post) => (
                <PostContainer
                  key={post.id}
                  lc={posts[posts.length - 1].id === post.id}
                >
                  <div
                    onClick={() => history.push(`/board/${type}/${post.id}`)}
                    className="post-left"
                  >
                    {`${post.title} [${post.comments}]`}
                  </div>
                  <div className="post-right">
                    <span className="username">{post.author}</span>
                    <span className="date">
                      {displayedAt(post.createdDate)}
                    </span>
                  </div>
                </PostContainer>
              ))}
          </div>
        ) : (
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            {user ? '' : 'loading...'}
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomeBoard;
