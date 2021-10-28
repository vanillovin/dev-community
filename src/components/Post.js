import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const PostContainer = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  padding: 6px;
  border-bottom: 1px solid lightgray;
  border-top: ${(props) => props.first && '1px solid lightgray'};
`;
const PostLeft = styled.div`
  /* border: 1px solid lightgray; */
  padding-right: 40px;
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PostRight = styled.div`
  /* border: 1px solid lightgray; */
  width: 25%;
  height: 100%;
  /* padding-left: 10px; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;
const Title = styled.h1`
  color: #748ffc;
  color: #5c7cfa;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    text-decoration: underline;
  }
`;

const Post = ({ post, type, fci }) => {
  // console.log('Post', post);
  const history = useHistory();

  const detailPost = (id) => {
    history.push(`/board/${type}/${id}`);
  };

  return (
    <PostContainer first={fci === post.id}>
      {/* onClick or Link? detail link to='/id/?' */}
      <PostLeft>
        <div style={{ fontSize: 12, marginBottom: 8, color: 'gray' }}>
          #{post.id}
        </div>
        <Title onClick={() => detailPost(post.id)}>{post.title}</Title>
      </PostLeft>
      <PostRight>
        <div style={{ fontSize: 13, marginBottom: 5 }}>{post.author}</div>
        <div style={{ fontSize: 11, color: 'gray' }}>{`${
          post.createdDate.split('T')[0]
        } ${post.createdDate.split('T')[1].substring(0, 8)}`}</div>
      </PostRight>
    </PostContainer>
  );
};

export default Post;
