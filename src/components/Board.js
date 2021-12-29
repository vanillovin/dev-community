import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import Post from './Post';

const BoardContainer = styled.div`
  width: 750px;
`;

const Board = ({ loading, posts, type }) => {
  // console.log('Board / loading:', loading);
  return (
    <BoardContainer>
      {!loading ? (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} type={type} fci={posts[0].id} />
          ))}
        </>
      ) : (
        <div>loading..</div>
      )}
    </BoardContainer>
  );
};

export default Board;
