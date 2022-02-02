import React, { useState, useEffect } from 'react';
import { boardApi } from '../api';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context';

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
  border-left: ${(props) => props.selected && '3px solid #94d82d'};
  width: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: 75% 25%;
  font-size: 13px;
  background-color: #fff;
  border-bottom: ${(props) => (props.lc ? 'none' : '1px solid lightgray')};
  /* border-radius: ${(props) => props.fc && '1px 1px 0 0'};
  border-radius: ${(props) => props.lc && ' 0 0 1px 1px'}; */
  .post-left {
    color: black;
    margin: auto 0;
    cursor: pointer;
    line-height: 1;
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

const HomeBoard = ({ title, type }) => {
  // console.log('HomeBoard', title, type);
  const user = useUser();

  const [state, setState] = useState({
    loading: true,
    posts: [],
    err: null,
  });
  const { loading, posts } = state;

  const fetchPosts = async () => {
    try {
      let response;
      if (type === 'best') {
        response = await boardApi.getBestPosts();
        console.log('Board getBestPosts res', type, response.data);
        setState({
          ...state,
          loading: false,
          posts: response.data.contents.slice(0, 10),
        });
        return;
      }
      response = await boardApi.getPosts(1, 'createdDate', type);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // history.push({
  //   pathname: `profile/${user.id}`,
  //   state: { memberId: user.id },
  // });

  return (
    <Container>
      <Header>
        <div className="title">{title}</div>
        <Link
          className="more"
          to={{
            pathname: `board/${type}`,
            state: { type, sort: 'id' },
          }}
        >
          {!(type === 'best') && '더 보기'}
        </Link>
      </Header>
      <div>
        {!loading ? (
          <div
            style={{
              border: '1px solid lightgray',
              borderLeft: 0,
            }}
          >
            {posts?.map((post) => (
              <PostContainer
                key={post.id}
                fc={posts[0].id === post.id}
                lc={posts[posts.length - 1].id === post.id}
                cmt={post.commentSize > 0}
                selected={post.selected}
              >
                <Link to={`/board/${type}/${post.id}`} className="post-left">
                  <span>{post.title}</span>
                </Link>
                <div className="post-right">
                  <span className="username" title={post.author}>
                    {post.author}
                  </span>
                  <span className="date" title={post.createdDate}>
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
