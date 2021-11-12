import React, { useState, useEffect } from 'react';
import { boardApi, memberApi } from '../api';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useT, useUser } from '../context';

const Container = styled.div``;
const Header = styled.div`
  display: flex;
  padding: 0 2px;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .more {
    cursor: pointer;
    font-size: 12px;
    :hover {
      font-weight: bold;
    }
  }
`;
const PostContainer = styled.div`
  border-left: ${(props) =>
    props.cmt ? '3px solid #91a7ff' : '3px solid #dbe4ff'};
  width: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: 75% 25%;
  font-size: 13px;
  background-color: #fff;
  border-bottom: ${(props) => (props.lc ? 'none' : '1px solid lightgray')};
  .post-left {
    color: black;
    margin: auto 0;
    cursor: pointer;
    line-height: 1.2;
    overflow-wrap: break-word;
    span:first-child {
      :hover {
        text-decoration: underline;
      }
    }
    span:last-child {
      color: royalblue;
    }
  }
  .post-right {
    margin: auto 0;
    font-size: 10px;
    text-align: end;
    .username {
      /* cursor: pointer;
      color: royalblue;
      :hover {
        text-decoration: underline;
      } */
    }
    .date {
      color: gray;
      margin-left: 4px;
    }
  }
`;

const HomeBoard = ({ title, type }) => {
  // console.log('HomeBoard', title, type);
  const t = useT();
  const user = useUser();
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    posts: [],
    err: null,
  });
  const { loading, posts } = state;

  const fetchPosts = async () => {
    try {
      let response;
      if (type === 'user') {
        response = await memberApi.getUserPosts(user.id, 1);
        console.log('Board getUserPosts res', type, response.data);
        setState({
          ...state,
          loading: false,
          posts: response.data.contents.slice(0, 10),
        });
        return;
      }
      if (type == 'best') {
        response = await boardApi.getBestPosts();
        console.log('Board getBestPosts res', type, response.data);
        setState({
          ...state,
          loading: false,
          posts: response.data.contents.slice(0, 10),
        });
        return;
      }
      response = await boardApi.getPosts(1, type);
      console.log('Board getPosts res', type, response.data);
      setState({
        ...state,
        loading: false,
        posts: response.data.contents.slice(0, 10),
      });
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
    if (type === 'user')
      history.push({
        pathname: `profile/${user.id}`,
        state: { memberId: user.id },
      });
    else history.push(`board/${type}`);
  };

  return (
    <Container>
      <Header>
        <div className="title">{title}</div>
        <div className="more" onClick={morePost}>
          {!(type === 'best') && '더 보기'}
        </div>
      </Header>
      <div>
        {!loading ? (
          <div style={{ border: '1px solid lightgray', borderLeft: 'none' }}>
            {posts &&
              posts.map((post) => (
                <PostContainer
                  key={post.id}
                  lc={posts[posts.length - 1].id === post.id}
                  cmt={post.commentSize > 0}
                >
                  <div
                    onClick={() => history.push(`/board/${type}/${post.id}`)}
                    className="post-left"
                  >
                    <span>{post.title}</span>
                  </div>
                  <div className="post-right">
                    <span
                      className="username"
                      // onClick={() =>
                      //   history.push({
                      //     pathname: `/profile/${post.memberId}`,
                      //     state: {
                      //       memberId: post.memberId,
                      //     },
                      //   })
                      // }
                    >
                      {post.author}
                    </span>
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
