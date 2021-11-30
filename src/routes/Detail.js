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
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
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
    /* border: 1px solid black; */
    height: 25px;
    margin-bottom: 12px;
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
  .date {
    color: gray;
    font-size: 11px;
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
  margin-bottom: 10px;
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
  margin-top: 30px;
  background: white;
  /* border-radius: 2px; */
  border: 1px solid lightgray;
  /* box-shadow: 0 1px 8px 0px rgba(0, 0, 0, 0.1); */
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
const BookMark = styled.div`
  cursor: pointer;
  color: #91a7ff;
  font-size: 20px;
  &:active {
    color: #dbe4ff;
  }
`;

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
    // 댓글잇는지확인
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
        alert(err.response.data.message);
      });
  };

  return !loading ? (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        {title}
      </h1>
      <DetailContainer>
        <div
          style={{
            background: '#fff',
            // borderRadius: 2,
            border: '1px solid lightgray',
          }}
        >
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

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Title>{post.title && post.title}</Title>
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
                        `${post.createdDate.split('T')[0]} ${post.createdDate
                          .split('T')[1]
                          .substring(0, 8)} 작성`}
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
                </div>
              </div>

              {user && (
                <BookMark title="게시글 스크랩" onClick={scrapPost}>
                  <BsBookmarkFill />
                </BookMark>
              )}
            </div>
          </Header>

          <Content>
            <div>
              {post.content ? ReactHtmlParser(post.content) : '로딩 중입니다!'}
            </div>
          </Content>

          <LikeContainer>
            <LikeButton type="submit" onClick={likePost} title="게시글 좋아요">
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
                  title="게시글 설정"
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
              some={some}
              author={user && post && post.memberId === user.id}
              delComment={delComment}
              fixComment={fixComment}
              likeComment={likeComment}
              selectComment={selectComment}
            />
          ))}

          <CommentForm>
            <CommentInput
              value={content}
              onChange={onChange}
              placeholder="댓글 달기"
            />
            <CommentButton
              type="submit"
              title="댓글 등록"
              onClick={sendComments}
            >
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
