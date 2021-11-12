import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router';
import styled from 'styled-components';
import { boardApi, commentApi } from '../api';
import { useT, useUser } from '../context';
import {
  AiOutlineSetting,
  AiOutlineLike,
  AiOutlineEye,
  AiOutlineComment,
} from 'react-icons/ai';
import Comment from '../components/Comment';
import ReactHtmlParser from 'react-html-parser';

const DetailContainer = styled.div`
  width: 750px;
  min-width: 750px;
`;
const Header = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgray;
  .top {
    height: 25px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .id {
    color: gray;
  }
  .top-right {
    display: flex;
    align-items: center;
  }
  .icon {
    color: gray;
    font-size: 14px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    span {
      margin-left: 3px;
      margin-right: 1px;
    }
  }
  .author {
    color: #5c7cfa;
    cursor: pointer;
    font-size: 14px;
    margin-right: 5px;
    :hover {
      text-decoration: underline;
    }
  }
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
const Title = styled.div`
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
`;
const Content = styled.div`
  width: 100%;
  min-height: 70px;
  padding: 20px 10px;
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-wrap: break-word;
`;
const LikeContainer = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const LikeButton = styled.button`
  all: unset;
  color: #495057;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  align-items: center;
  & > div {
    margin-left: 5px;
    font-size: 16px;
  }
  &:hover {
    color: #adb5bd;
  }
`;
const CommentContainer = styled.div`
  width: 100%;
  margin-top: 25px;
  background: white;
  border: 1px solid lightgray;
`;
const CommentForm = styled.form`
  width: 100%;
  height: 80px;
  display: flex;
`;
const CommentInput = styled.textarea`
  width: 80%;
  height: 100%;
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

const Detail = ({ match, location }) => {
  // console.log('Detail');
  const history = useHistory();

  const { type, id } = match.params;

  let title;
  if (type === 'qna') title = 'Q&A';
  if (type === 'tech') title = 'Tech';
  if (type === 'free') title = '사는 얘기';

  const t = useT();
  const user = useUser();

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
  }, []);

  // useEffect(() => {
  //   console.log('useEffect', comments);
  // }, [comments]);

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
        // window.location.href = location.pathname;
      })
      .catch((err) => {
        console.log('sendComment err', err || err.reponse.data);
      });
  };

  const onChange = (e) => setContent(e.target.value);

  const goEditor = () => {
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
    const ok = window.confirm('삭제하시겠습니까?');
    ok &&
      boardApi
        .deletePost(id, t)
        .then((res) => {
          console.log('deletePost res', res);
          history.push(`/board/${type}`);
          // window.location.href = `/board/${type}`;
        })
        .catch((err) => {
          console.log('deletePost err', err);
        });
  };

  const delComment = (cId) => {
    // console.log(id, cId, t);
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
          console.log(err);
        });
  };

  const likePost = () => {
    boardApi
      .likePost(id, t)
      .then((res) => {
        console.log('likePost', res);
        setLikes(likes + 1);
      })
      .catch((err) => {
        console.log('likePost', err);
        alert('이미 좋아요를 누르셨습니다');
      });
  };

  const likeComment = (cId) => {
    // console.log('likeComment', id, cId, t);
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
        console.log('likeComment', err);
        alert('이미 좋아요를 누르셨습니다');
      });
  };

  const fixComment = (cId, text) => {
    // console.log('fixComment', id, cId, text,t);
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
      });
  };

  return !loading ? (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        {title}
      </h1>
      <DetailContainer>
        <div style={{ border: '1px solid lightgray', background: '#fff' }}>
          <Header>
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
            <Title>{post.title && post.title}</Title>
            <div>
              <span
                className="author"
                onClick={() =>
                  history.push({
                    pathname: `/profile/${post.memberId}`,
                    state: {
                      memberId: post.memberId,
                    },
                  })
                }
              >
                {post.author}
              </span>
              <span style={{ color: 'gray', fontSize: 11 }}>
                {post.createdDate &&
                  `${post.createdDate.split('T')[0]} ${post.createdDate
                    .split('T')[1]
                    .substring(0, 8)} 작성`}
              </span>
              <span style={{ color: 'gray', fontSize: 11 }}>
                {post.createdDate &&
                  post.lastModifiedDate &&
                  (post.createdDate === post.lastModifiedDate
                    ? ''
                    : ` ∙ ${
                        post.lastModifiedDate.split('T')[0]
                      } ${post.lastModifiedDate
                        .split('T')[1]
                        .substring(0, 8)} 수정`)}
              </span>
            </div>
          </Header>

          <Content>
            <div>
              {post.content ? ReactHtmlParser(post.content) : '로딩 중입니다!'}
            </div>
          </Content>

          <LikeContainer>
            <LikeButton type="submit" onClick={likePost}>
              <AiOutlineLike />
              <div>{likes}</div>
            </LikeButton>
            {user && post && post.memberId === user.id && (
              <SettingContainer>
                {toggle && (
                  <>
                    <SettingButton onClick={goEditor}>수정</SettingButton>
                    <SettingButton onClick={delPost}>삭제</SettingButton>
                  </>
                )}
                <AiOutlineSetting
                  className="setbtn"
                  onClick={() => setToggle(!toggle)}
                />
              </SettingContainer>
            )}
          </LikeContainer>
        </div>

        <CommentContainer>
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
              delComment={delComment}
              fixComment={fixComment}
              likeComment={likeComment}
            />
          ))}

          <CommentForm>
            <CommentInput
              value={content}
              onChange={onChange}
              placeholder="댓글 달기"
            />
            <CommentButton type="submit" onClick={sendComments}>
              등록
            </CommentButton>
          </CommentForm>
        </CommentContainer>
      </DetailContainer>
    </>
  ) : (
    <div>loading...</div>
  );
};

export default withRouter(Detail);
