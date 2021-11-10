import React from 'react';
import { AiOutlineLike, AiOutlineComment, AiOutlineEye } from 'react-icons/ai';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const PostContainer = styled.div`
  width: 750px;
  /* width: 800px; */
  height: 65px;
  padding: 6px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
  border-top: ${(props) => props.first && '1px solid lightgray'};
`;
const PostLeft = styled.div`
  /* border: 1px solid red; */
  padding-right: 15px;
  width: 65%;
  width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .id {
    color: gray;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .title {
    padding-right: 10px;
    color: #5c7cfa;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.1;
    word-spacing: -1px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const PostRight = styled.div`
  /* border: 1px solid red; */
  width: 35%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    /* border: 1px solid blue; */
    display: flex;
    align-items: center;
  }
  .right {
    /* border: 1px solid red; */
    .username {
      font-size: 12px;
      letter-spacing: -1px;
      margin-bottom: 3px;
    }
    .date {
      color: gray;
      font-size: 10px;
    }
  }
`;
const Like = styled.div`
  /* border: 1px solid red; */
  width: 48px;
  color: gray;
  font-size: 13px;
  display: flex;
  align-items: center;
  span {
    font-size: 11px;
    margin-left: 4px;
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
        <div className="id">#{post.id}</div>
        <div className="title" onClick={detailPost}>
          {post.title}
        </div>
      </PostLeft>
      <PostRight>
        <div className="left">
          <Like>
            <AiOutlineComment />
            <span>{post.commentSize}</span>
          </Like>
          <Like>
            <AiOutlineLike />
            <span>{post.likes}</span>
          </Like>
          <Like>
            <AiOutlineEye style={{ fontSize: 15 }} />
            <span>{post.views}</span>
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
