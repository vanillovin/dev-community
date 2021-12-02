import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { boardApi } from '../api';
import Post from './Post';
import PageList from './PageList';

const BoardContainer = styled.div`
  width: 750px;
`;

const Board = ({ type }) => {
  // const {
  //   state: { sort = 'id', keyword = '', cond = 0 },
  // } = useLocation();
  const location = useLocation();
  const sort = location.state?.sort || 'id';
  const keyword = location.state?.keyword || '';
  const cond = location.state?.cond || 0;
  const [page, setPage] = useState([1, 2, 3, 4, 5]);
  console.log('Board type', type, 'location', location);

  const sortStr =
    (sort === 'id' && 'createdDate') ||
    (sort === 'viewCount' && 'views') ||
    (sort === 'noteCount' && 'commentSize') ||
    (sort === 'likeCount' && 'likes');

  const [board, setBoard] = useState({
    loading: true,
    totalPages: null,
    currentPage: null,
    totalElements: null,
    posts: [],
    err: null,
  });
  const { loading, totalPages, currentPage, totalElements, posts } = board;

  const fetchPosts = async (num) => {
    console.log(`fetchPosts type:${type} sort:${sortStr} keyword:${keyword}`);
    let response;
    try {
      if (keyword) {
        response = await boardApi.searchPosts(keyword, num, cond, type);
        console.log('searchPosts res', response);
      } else {
        response = await boardApi.getPosts(num, sortStr, type);
        console.log('fetchPosts res', response);
      }
      setBoard({
        ...board,
        loading: false,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalElements: response.data.totalElements,
        posts: response.data.contents,
      });
    } catch (err) {
      console.log(err);
      setBoard({ ...board, error: err });
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [type, sort, keyword, cond]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BoardContainer>
      {!loading ? (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} type={type} fci={posts[0].id} />
          ))}
          {totalElements > 0 ? (
            <PageList
              page={page}
              setPage={setPage}
              fetchContents={fetchPosts}
              totalPages={totalPages}
              currentPage={currentPage}
              sort={sortStr}
            />
          ) : (
            <div style={{ marginTop: 150, textAlign: 'center' }}>
              아직 게시물이 없습니다.
            </div>
          )}
        </>
      ) : (
        <div>loading..</div>
      )}
    </BoardContainer>
  );
};

export default Board;
