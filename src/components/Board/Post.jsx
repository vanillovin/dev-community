import React from 'react';
import { AiOutlineLike, AiOutlineComment, AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import dateFormatter from '../../utils/dateFormatter';
import { customMedia } from '../../commons/styles/GlobalStyles';

const PostContainer = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-left: ${(props) =>
    props.cmt ? '4px solid #748ffc' : '4px solid #dbe4ff'};
  border-left: ${(props) => props.selected && '4px solid #94d82d'};
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  border-top: ${(props) => props.first && '1px solid lightgray'};
`;
const PostLeft = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 20px;
  .id {
    color: gray;
    font-size: 12px;
    padding-bottom: 4px;
  }
  .title {
    color: #5c7cfa;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.1;
    word-spacing: -1px;
    &:hover {
      text-decoration: underline;
    }
  }
  ${customMedia.lessThan('tablet')`
    .id {
        font-size: 10px;
      }
    .title {
      font-size: 12px;
    }
  `}
`;
const PostRight = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    margin-left: 10px;
    .username {
      padding-bottom: 2px;
      font-size: 12px;
      letter-spacing: -1px;
    }
    .date {
      color: gray;
      font-size: 10px;
    }
  }
  ${customMedia.lessThan('tablet')`
    .title {
      font-size: 12px;
    }
    .right .username {
      font-size: 11px;
      padding-bottom: 0px;
    }
    .right .date {
      font-size: 9px;
    }
  `}
`;
const Icon = styled.div`
  width: 46px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.len ? '#495057' : '#adb5bd')};
  span {
    font-size: 12px;
    margin-left: 2px;
  }
  ${customMedia.lessThan('tablet')`
    width: 36px;
    font-size: 11px;
    span {
      font-size: 11px;
    }
  `}
`;

const Post = ({ post, type, fci }) => {
  return (
    <PostContainer
      first={fci === post.id}
      cmt={post.commentSize > 0}
      selected={post.selected}
    >
      <PostLeft>
        <div className="id">#{post.id}</div>
        <Link to={`/board/${type}/${post.id}`} className="title">
          {post.title}
        </Link>
      </PostLeft>
      <PostRight>
        <div className="left">
          <Icon len={post.commentSize > 0}>
            <AiOutlineComment />
            <span>{post.commentSize}</span>
          </Icon>
          <Icon len={post.likes > 0}>
            <AiOutlineLike />
            <span>{post.likes}</span>
          </Icon>
          <Icon len={post.views > 0}>
            <AiOutlineEye style={{ fontSize: 15 }} />
            <span>{post.views}</span>
          </Icon>
        </div>
        <div className="right">
          <div className="username">{post.author}</div>
          <div className="date">
            {dateFormatter(post.createdDate, 'created')}
          </div>
        </div>
      </PostRight>
    </PostContainer>
  );
};

export default Post;
