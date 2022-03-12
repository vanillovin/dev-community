import React, { useState } from 'react';
import { AiOutlineLike, AiOutlineSetting } from 'react-icons/ai';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import boardApi from '../../apis/boardApi';
import { useT, useUser } from '../../contexts/UserContext';

const Container = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  div {
    border-radius: 2px;
    border: 1px solid lightgray;
  }
  .setbtn {
    color: #495057;
    font-size: 20px;
    cursor: pointer;
    margin-left: 6px;
    :hover {
      color: #adb5bd;
    }
  }
`;
const SettingButton = styled.button`
  user-select: none;
  color: #495057;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  background-color: transparent;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  &:hover {
    background-color: #f1f3f5;
  }
  &:nth-child(1) {
    border-left: 1px solid lightgray;
    border-radius: 2px 0 0 2px;
  }
  &:nth-child(2) {
    border-radius: 0 2px 2px 0;
  }
`;
const LikeButton = styled.button`
  all: unset;
  color: #495057;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  align-items: center;
  user-select: none;
  & > div {
    margin-left: 5px;
    font-size: 16px;
  }
  &:hover {
    opacity: 0.7;
  }
`;

const isOk = (msg) => window.confirm(msg);

const Bottom = ({ title, content, likes, isPostUser }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const t = useT();
  const user = useUser();
  const history = useHistory();
  const type = history.location.pathname.split('/')[2];
  const id = history.location.pathname.split('/')[3];
  const [toggle, setToggle] = useState(false);

  // const { mutate } = useMutation(() => boardApi.scrapPost(postId, t), {
  //   onSuccess: () => {
  //     // console.log('scrapPost onSuccess', data);
  //     alert('게시글 스크랩 성공.');
  //   },
  //   onError: (error) => {
  //     // console.log('scrapPost error', error);
  //     alert(error?.response?.data.message);
  //   },
  // });
  const likePost = () => {
    if (!user) {
      isOk('로그인 하시겠습니까?') && history.push('/login');
    } else {
      boardApi
        .likePost(id, t)
        .then((res) => {
          console.log('likePost', res);
          setLikeCount((prev) => prev + 1);
        })
        .catch((err) => {
          console.log('likePost', err.response);
          alert(err.response.data.message);
        });
    }
  };

  const goToEditor = () =>
    history.push({
      pathname: '/edit',
      state: {
        type,
        id,
        title,
        content,
      },
    });

  const delPost = () => {
    isOk('삭제하시겠습니까?') &&
      boardApi
        .deletePost(id, t)
        .then((res) => {
          console.log('deletePost res', res);
          history.push(`/board/${type}?sort=createdDate&page=1`); // goBack?
        })
        .catch((err) => {
          console.log('deletePost err', err);
          alert(err.response.data.message);
        });
  };

  return (
    <Container>
      <LikeButton type="submit" title="게시글 좋아요" onClick={likePost}>
        <AiOutlineLike />
        <div>{likeCount}</div>
      </LikeButton>

      {isPostUser && (
        <SettingContainer>
          {toggle && (
            <>
              <SettingButton onClick={goToEditor}>수정</SettingButton>
              <SettingButton onClick={delPost}>삭제</SettingButton>
            </>
          )}
          <AiOutlineSetting
            title="게시글 설정"
            className="setbtn"
            onClick={() => setToggle(!toggle)}
          />
        </SettingContainer>
      )}
    </Container>
  );
};

export default Bottom;
