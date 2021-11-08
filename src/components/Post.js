import React from 'react';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const PostContainer = styled.div`
  width: 750px;
  height: 65px;
  padding: 6px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
  border-top: ${(props) => props.first && '1px solid lightgray'};
`;
const PostLeft = styled.div`
  /* border: 1px solid red; */
  padding-right: 10px;
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PostRight = styled.div`
  /* border: 1px solid red; */
  width: 300px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    /* border: 1px solid red; */
    width: 150px;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .right {
    /* border: 1px solid red; */
    width: 150px;
    .username {
      font-size: 12px;
      letter-spacing: -1px;
      margin-bottom: 3px;
    }
    .date {
      color: gray;
      font-size: 11px;
    }
  }
`;
const Like = styled.div`
  /* border: 1px solid red; */
  width: 50%;
  color: gray;
  font-size: 14px;
  display: flex;
  align-items: center;
  span {
    margin-left: 6px;
  }
`;
const Title = styled.h1`
  /* color: #748ffc; */
  color: #5c7cfa;
  cursor: pointer;
  font-size: 15px;
  line-height: 1.1;
  word-spacing: -1px;
  &:hover {
    text-decoration: underline;
  }
`;

const Post = ({ post, type, fci }) => {
  const history = useHistory();

  const detailPost = () => {
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
        <div className="left">
          <Like>
            <AiOutlineComment />
            <span>{post.comments}</span>
          </Like>
          <Like>
            <AiOutlineLike />
            <span>{post.likes}</span>
          </Like>
        </div>
        <div className="right">
          <div className="username">{post.author}</div>
          <div className="date">{`${
            post.createdDate.split('T')[0]
          } ${post.createdDate.split('T')[1].substring(0, 8)}`}</div>
        </div>
      </PostRight>
    </PostContainer>
  );
};

export default Post;
