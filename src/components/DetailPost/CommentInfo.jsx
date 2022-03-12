import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Comment from './Comment';
import boardApi from '../../apis/boardApi';
import commentApi from '../../apis/commentApi';
import { useT, useUser } from '../../contexts/UserContext';
import { useMutation, useQueryClient } from 'react-query';

const CommentContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  background: white;
  border: 1px solid lightgray;
  .commentSize {
    background-color: #e9ecef;
    padding: 10px;
    font-size: 0.9rem;
    border-bottom: 1px solid lightgray;
  }
`;
const CommentForm = styled.form`
  width: 100%;
  height: 80px;
  display: flex;
`;
const CommentInput = styled.textarea`
  width: 80%;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
`;
const CommentButton = styled.button`
  width: 20%;
  height: 100%;
  border: none;
  font-size: 14px;
  border-left: 1px solid lightgray;
  cursor: pointer;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
`;

const isOk = (msg) => window.confirm(msg);

const CommentInfo = ({ comments, commentSize, isSelected, isPostUser }) => {
  const t = useT();
  const user = useUser();
  const history = useHistory();
  const postId = history.location.pathname.split('/')[3];
  const queryClient = useQueryClient();

  const [commentInput, setCommentInput] = useState('');

  // send
  const sendComment = ({ postId, data, t }) => {
    return commentApi.sendComment(postId, data, t);
  };
  const { mutate: sendCommentMutate } = useMutation(sendComment, {
    onSuccess: (data, variables, context) => {
      // console.log('useSendComment success', data, variables);
      // variables ▷ {postId: '', data: '', t: '', clear: ƒ}
      queryClient.invalidateQueries(['Detail', postId]);
      variables.clear();
    },
    onError: (err, variables, context) => {
      console.log('useSendComment error', err, variables);
    },
  });
  const handleSendComment = () => {
    if (!user) {
      isOk('로그인 하시겠습니까?') && history.push('/login');
      return;
    }
    if (commentInput.trim().length < 2) {
      alert('댓글은 2자 이상 입력해주세요.');
      return;
    }
    sendCommentMutate({
      postId,
      data: { content: commentInput },
      t,
      clear: () => setCommentInput(''),
    });
  };

  // delete
  const deleteComment = ({ postId, commentId, t }) => {
    return commentApi.deleteComment(postId, commentId, t);
  };
  // 서버에 요청날리고 기다리지 않음 프로미스를 반환하지 않음
  // async - onSuccess가 끝날 때까지 기다림
  const { mutate: deleteCommentMutate } = useMutation(deleteComment, {
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['Detail', postId], (old) => ({
        ...old,
        comments: old.comments.filter(
          (comment) => comment.id !== variables.commentId
        ),
      }));
      // invalidate 시키지만 refetch 하지 않음
      queryClient.invalidateQueries({
        queryKey: ['Detail', postId],
        refetchActive: false,
      });
    },
    onError: (err, variables, context) => {
      console.log('deleteCommentMutate error', err);
    },
  });
  const handleDeleteComment = async (commentId) => {
    isOk('댓글을 삭제하시겠습니까?') &&
      deleteCommentMutate({ postId, commentId, t });
  };

  // select
  const selectComment = ({ postId, cId, t }) => {
    return boardApi.selectComment(postId, cId, t);
  };
  const { mutate: selectCommentMutate } = useMutation(selectComment, {
    onSuccess: (data, variables, context) => {
      console.log('selectCommentMutate success', data, variables);
      queryClient.setQueryData(['Detail', postId], (old) => ({
        ...old,
        selected: true,
        comments: old.comments.map((comment) =>
          comment.id === variables.cId
            ? { ...comment, selected: true }
            : comment
        ),
      }));
      queryClient.invalidateQueries({
        queryKey: ['Detail', postId],
        refetchActive: false,
      });
    },
    onError: (err, variables, context) => {
      console.log('selectCommentMutate error', err, variables);
      alert(err.response.data.message);
    },
  });
  const handleSelectComment = (cId) => {
    isOk('댓글을 채택하시겠습니까?') && selectCommentMutate({ postId, cId, t });
  };

  // like
  const likeComment = ({ postId, cId, t }) => {
    return commentApi.likeComment(postId, cId, t);
  };
  const { mutate: likeCommentMutate } = useMutation(likeComment, {
    onSuccess: (data, variables, context) => {
      console.log('likeCommentMutate success', data, variables);
      queryClient.setQueryData(['Detail', postId], (old) => ({
        ...old,
        comments: old.comments.map((comment) =>
          comment.id === variables.cId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        ),
      }));
      queryClient.invalidateQueries({
        queryKey: ['Detail', postId],
        refetchActive: false,
      });
    },
    onError: (err, variables, context) => {
      console.log('likeCommentMutate error', err, variables);
    },
  });
  const handleLikeComment = (cId) => {
    if (!user) {
      isOk('로그인 하시겠습니까?') && history.push('/login');
      return;
    }
    likeCommentMutate({ postId, cId, t });
  };

  // fix
  const fixComment = ({ postId, cId, data, t }) => {
    return commentApi.fixComment(postId, cId, data, t);
  };
  const { mutate: fixCommentMutate } = useMutation(fixComment, {
    onSuccess: (data, variables, context) => {
      console.log('fixCommentMutate success', data, variables);
      queryClient.setQueryData(['Detail', postId], (old) => ({
        ...old,
        comments: old.comments.map((comment) =>
          comment.id === variables.cId
            ? { ...comment, content: variables.data.content }
            : comment
        ),
      }));
      queryClient.invalidateQueries({
        queryKey: ['Detail', postId],
        refetchActive: false,
      });
    },
    onError: (err, variables, context) => {
      console.log('fixCommentMutate error', err, variables);
      alert(err.response.data.message);
    },
  });
  const handleFixComment = (cId, text, setText) => {
    fixCommentMutate({ postId, cId, data: { content: text }, t });
  };

  return (
    <CommentContainer>
      <div className="commentSize">댓글 {commentSize}</div>
      {comments.map((cmt) => (
        <Comment
          key={cmt.id}
          cmt={cmt}
          isSelected={isSelected}
          isPostUser={isPostUser}
          handleDeleteComment={handleDeleteComment}
          handleFixComment={handleFixComment}
          handleLikeComment={handleLikeComment}
          handleSelectComment={handleSelectComment}
        />
      ))}
      <CommentForm>
        <CommentInput
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글 달기"
        />
        <CommentButton
          type="submit"
          title="댓글 등록"
          onClick={(e) => {
            e.preventDefault();
            handleSendComment();
          }}
        >
          등록
        </CommentButton>
      </CommentForm>
    </CommentContainer>
  );
};

export default CommentInfo;
