import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router';
import styled from 'styled-components';
import { BsBookmarkFill } from 'react-icons/bs';
import {
  AiOutlineSetting,
  AiOutlineLike,
  AiOutlineEye,
  AiOutlineComment,
} from 'react-icons/ai';

import * as S from './style.js';
import { boardApi, commentApi } from '../../api';
import { useT, useUser } from '../../context';
import Comment from '../../components/Comment';
import dateFormatter from '../../dateFormatter';

import { marked } from 'marked';
import parse from 'html-react-parser';

const Detail = ({ match }) => {
  const history = useHistory();
  const { type, id } = match.params;

  let title;
  if (type === 'qna') title = 'Q&A';
  if (type === 'tech') title = 'Tech';
  if (type === 'free') title = '사는 얘기';

  const t = useT();
  const user = useUser();
  console.log('Detail user', user);

  const [content, setContent] = useState('');
  const [state, setState] = useState({
    lodaing: true,
    post: {},
    comments: [],
    err: null,
  });
  const { loading, post, comments } = state;
  const [toggle, setToggle] = useState(false);
  const [likes, setLikes] = useState();
  const some = comments.some((cmt) => cmt.selected === true);
  console.log(post);

  useEffect(() => {
    const fetchPost = () => {
      boardApi
        .getPost(id)
        .then((res) => {
          console.log('detail getPost res', res);
          setState({
            ...state,
            loading: false,
            post: res.data,
            comments: res.data.comments,
          });
          setLikes(res.data.likes);
        })
        .catch((err) => {
          console.log('detail getPost err', err);
          setState({ ...state, error: err });
          history.push(`/board/${type}`);
        });
    };
    fetchPost();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendComments = (e) => {
    e.preventDefault();
    if (!user) {
      const ok = window.confirm('로그인 하시겠습니까?');
      ok && history.push('/login');
      return;
    }
    if (content.trim() === '') {
      alert('댓글을 입력해주세요.');
      return;
    }
    commentApi
      .sendComment(id, { content }, t)
      .then((res) => {
        console.log('sendComment res', comments, res.data);
        setState({
          ...state,
          comments: [...comments, res.data],
        });
        setContent('');
      })
      .catch((err) => {
        console.log('sendComment err', err || err.reponse.data);
      });
  };

  const onChange = (e) => setContent(e.target.value);

  const goEditor = () => {
    console.log('goEditor', type, post.id, post.title, post.content);
    history.push({
      pathname: '/edit',
      state: {
        type,
        id: post.id,
        title: post.title,
        content: post.content,
      },
    });
  };

  const delPost = () => {
    // 댓글있는지확인
    const ok = window.confirm('삭제하시겠습니까?');
    ok &&
      boardApi
        .deletePost(id, t)
        .then((res) => {
          console.log('deletePost res', res);
          history.push(`/board/${type}`);
        })
        .catch((err) => {
          console.log('deletePost err', err);
          alert(err.response.data.message);
        });
  };

  const delComment = (cId) => {
    const ok = window.confirm('댓글을 삭제하시겠습니까?');
    ok &&
      commentApi
        .deleteComment(id, cId, t)
        .then((res) => {
          console.log('delComment res', res);
          setState({
            ...state,
            comments: comments.filter((cmt) => cmt.id !== cId),
          });
          // window.location.href = location.pathname;
        })
        .catch((err) => {
          console.log(err.response);
        });
  };

  const likePost = () => {
    if (!user) {
      const ok = window.confirm('로그인 하시겠습니까?');
      ok && history.push('/login');
      return;
    }
    boardApi
      .likePost(id, t)
      .then((res) => {
        console.log('likePost', res);
        setLikes(likes + 1);
      })
      .catch((err) => {
        console.log('likePost', err.response);
        alert(err.response.data.message);
      });
  };

  const selectComment = (cId) => {
    const author = user && post && post.memberId === user.id;
    author &&
      !some &&
      window.confirm('댓글을 채택하시겠습니까?') &&
      boardApi
        .selectComment(id, cId, t)
        .then((res) => {
          console.log('selectComment', res);
          setState({
            ...state,
            comments: comments.map((cmt) =>
              cmt.id === cId ? { ...cmt, selected: true } : cmt
            ),
          });
        })
        .catch((err) => {
          console.log('selectComment', err);
          alert(err.response.data.message);
        });
  };

  const likeComment = (cId) => {
    if (!user) {
      const ok = window.confirm('로그인 하시겠습니까?');
      ok && history.push('/login');
      return;
    }
    commentApi
      .likeComment(id, cId, t)
      .then((res) => {
        console.log('likeComment', res);
        setState({
          ...state,
          comments: comments.map((cmt) =>
            cmt.id === cId ? { ...cmt, likes: cmt.likes + 1 } : cmt
          ),
        });
      })
      .catch((err) => {
        console.log('likeComment', err.response);
        alert(err.response.data.message);
      });
  };

  const fixComment = (cId, text) => {
    commentApi
      .fixComment(id, cId, { content: text }, t)
      .then((res) => {
        console.log('fixComment res', res);
        const { content, lastModifiedDate } = res.data;
        setState({
          ...state,
          comments: comments.map((cmt) =>
            cmt.id === cId ? { ...cmt, content, lastModifiedDate } : cmt
          ),
        });
      })
      .catch((err) => {
        console.log('fixComment err', err);
        alert(err.response.data.message);
      });
  };

  const scrapPost = () => {
    boardApi
      .scrapPost(id, t)
      .then((res) => {
        console.log('scrapPost res', res);
        alert('게시글 스크랩 성공.');
      })
      .catch((err) => {
        console.log('scrapPost err', err.response);
        alert(err.response?.data.message);
      });
  };

  const toHtml = (markdown) => {
    return marked.parse(markdown);
  };

  return !loading ? (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        {title}
      </h1>
      <S.DetailContainer>
        <div
          style={{
            background: '#fff',
            // borderRadius: 2,
            border: '1px solid lightgray',
          }}
        >
          <S.Header>
            <div className="top">
              <div className="id">#{post.id && post.id}</div>
              <div className="top-right">
                <div className="icon">
                  <AiOutlineComment />
                  <span>{comments.length}</span>
                </div>
                <div className="icon">
                  <AiOutlineEye />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <S.Title>{post.title && post.title}</S.Title>
                <div>
                  <div>
                    <span
                      className="author"
                      onClick={() =>
                        history.push({
                          pathname: `/user/info/${post.memberId}`,
                          state: {
                            memberId: post.memberId,
                          },
                        })
                      }
                    >
                      {post.author}
                    </span>
                    <span className="date">
                      {post.createdDate &&
                        dateFormatter(post.createdDate, 'created', '작성')}
                      {post.createdDate &&
                        post.lastModifiedDate &&
                        post.createdDate !== post.lastModifiedDate &&
                        dateFormatter(
                          post.lastModifiedDate,
                          'modified',
                          '수정'
                        )}
                    </span>
                  </div>
                </div>
              </div>

              {user && (
                <S.BookMark title="게시글 스크랩" onClick={scrapPost}>
                  <BsBookmarkFill />
                </S.BookMark>
              )}
            </div>
          </S.Header>

          <S.Content>
            {post.content ? parse(toHtml(post.content)) : '로딩 중입니다!'}
          </S.Content>

          <S.LikeContainer>
            <S.LikeButton
              type="submit"
              onClick={likePost}
              title="게시글 좋아요"
            >
              <AiOutlineLike />
              <div>{likes}</div>
            </S.LikeButton>
            {user && post && post.memberId === user.id && (
              <S.SettingContainer>
                {toggle && (
                  <>
                    <S.SettingButton onClick={goEditor}>수정</S.SettingButton>
                    <S.SettingButton onClick={delPost}>삭제</S.SettingButton>
                  </>
                )}
                <AiOutlineSetting
                  title="게시글 설정"
                  className="setbtn"
                  onClick={() => setToggle(!toggle)}
                />
              </S.SettingContainer>
            )}
          </S.LikeContainer>
        </div>

        <S.CommentContainer>
          <div
            style={{
              background: '#e9ecef',
              padding: 10,
              fontSize: 14,
              borderBottom: '1px solid lightgray',
            }}
          >
            댓글 {comments.length}
          </div>
          {comments.map((cmt) => (
            <Comment
              key={cmt.id}
              cmt={cmt}
              some={some}
              author={user && post && post.memberId === user.id}
              delComment={delComment}
              fixComment={fixComment}
              likeComment={likeComment}
              selectComment={selectComment}
            />
          ))}

          <S.CommentForm>
            <S.CommentInput
              value={content}
              onChange={onChange}
              placeholder="댓글 달기"
            />
            <S.CommentButton
              type="submit"
              title="댓글 등록"
              onClick={sendComments}
            >
              등록
            </S.CommentButton>
          </S.CommentForm>
        </S.CommentContainer>
      </S.DetailContainer>
    </>
  ) : (
    <div>loading...</div>
  );
};

export default withRouter(Detail);
