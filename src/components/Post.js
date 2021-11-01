import React from 'react';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const PostContainer = styled.div`
  width: 100%;
  height: 65px;
  padding: 6px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
  border-top: ${(props) => props.first && '1px solid lightgray'};
`;
const PostLeft = styled.div`
  /* border: 1px solid lightgray; */
  padding-right: 25px;
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PostRight = styled.div`
  /* border: 1px solid lightgray; */
  width: 35%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Like = styled.div`
  /* border: 1px solid lightgray; */
  color: gray;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 25px;
  span {
    margin-left: 6px;
  }
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
  // console.log('Post Component', post, type);
  const history = useHistory();

  const detailPost = () => {
    // history.push({
    //   pathname: `/board/${type}/${post.id}`,
    //   state: {
    //     type,
    //     id: post.id,
    //   },
    // });
    history.push(`/board/${type}/${post.id}`);
  };

  return (
    <PostContainer first={fci === post.id}>
      {/* onClick or Link? detail link to='/id/?' */}
      <PostLeft>
        <div style={{ fontSize: 12, marginBottom: 8, color: 'gray' }}>
          #{post.id}
        </div>
        <Title onClick={detailPost}>{post.title}</Title>
      </PostLeft>
      <PostRight>
        <Like>
          <AiOutlineComment />
          <span>{post.comments}</span>
        </Like>
        <Like>
          <AiOutlineLike />
          <span>{post.likes}</span>
        </Like>
        <div>
          <div style={{ fontSize: 13, marginBottom: 5 }}>{post.author}</div>
          <div style={{ fontSize: 11, color: 'gray' }}>{`${
            post.createdDate.split('T')[0]
          } ${post.createdDate.split('T')[1].substring(0, 8)}`}</div>
        </div>
      </PostRight>
    </PostContainer>
  );
};

export default Post;
