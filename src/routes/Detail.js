import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router';
import styled from 'styled-components';
import { boardApi, commentApi } from '../api';
import { useT, useUser } from '../context';
import { AiOutlineSetting, AiOutlineLike } from 'react-icons/ai';
import Comment from '../components/Comment';

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
  /* post.id setting */
  & > div:first-child {
    :first-child {
      color: gray;
    }
    height: 25px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    justify-content: space-between;
  }
`;
const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  div {
    margin-right: 10px;
    border-radius: 2px;
    border: 1px solid lightgray;
  }
  .setbtn {
    color: #5c7cfa;
    font-size: 20px;
    cursor: pointer;
    :hover {
      color: #91a7ff;
    }
  }
`;
const SettingButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  background-color: transparent;
  &:first-child {
    border-right: 1px solid lightgray;
  }
  &:hover {
    background-color: #edf2ff;
  }
`;
const Title = styled.div`
  font-size: 19px;
  font-weight: 700;
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
  padding: 0 0 10px 10px;
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
  const history = useHistory();

  const { type, id } = match.params;

  let title;
  if (type === 'qna') title = 'Q&A';
  if (type === 'tech') title = 'Tech';
  if (type === 'free') title = 'Free';

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

  // const fetchData = async () => {
  //   try {
  //     const { data } = await boardApi.getPost(id);
  //     console.log('detail getPost res', data);
  //     setState({
  //       ...state,
  //       loading: false,
  //       post: data,
  //       comments: data.comments,
  //     });
  //   } catch (err) {
  //     console.log('detail getPost err', err || err.reponse.data);
  //     setState({ ...state, error: err });
  //     // 삭제됐거나 잘못된 요청 어디로 이동?
  //     // window.location.href = `/board/${type}`;
  //     // history.push(`/board/${type}`);
  //   }
  // };

  useEffect(() => {
    // console.log('Detail useEffet mount');

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
      })
      .catch((err) => {
        console.log('detail getPost err', err);
        setState({ ...state, error: err });
        history.push(`/board/${type}`);
      });
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
        // window.location.href = location.pathname;
        // history.push(location.pathname);
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

  const delPost = (pId) => {
    const ok = window.confirm('삭제하시겠습니까?');
    ok &&
      boardApi
        .deletePost(id, t)
        .then((res) => {
          console.log('deletePost res', res);
          history.push(`/board/${type}`);
          // window.location.href = `/board/${type}`;
          setState({
            ...state,
            comments: comments.filter((cmt) => cmt.id !== pId),
          });
        })
        .catch((err) => {
          console.log('deletePost err', err);
        });
  };

  const delComment = (cId) => {
    const ok = window.confirm('댓글을 삭제하시겠습니까?');
    ok &&
      commentApi
        .deleteComment(id, cId, t)
        .then((res) => {
          console.log('delComment res', res);
          // window.location.href = location.pathname;
          // history.push(location.pathname);
          setState({
            ...state,
            comments: comments.filter((cmt) => cmt.id !== cId),
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const likePost = () => {
    console.log('likePost');
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
            <div>
              <div>#{post.id && post.id}</div>
              {user && post && post.memberId === user.id && (
                <SettingContainer>
                  {toggle && (
                    <div>
                      <SettingButton onClick={goEditor}>수정</SettingButton>
                      <SettingButton onClick={delPost}>삭제</SettingButton>
                    </div>
                  )}
                  <AiOutlineSetting
                    className="setbtn"
                    onClick={() => setToggle(!toggle)}
                  />
                </SettingContainer>
              )}
            </div>
            <Title>{post.title && post.title}</Title>
            <div>
              <span style={{ fontSize: 14, marginRight: 5, color: '#5c7cfa' }}>
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
            <div>{post.content}</div>
          </Content>

          <LikeContainer>
            <LikeButton type="submit" onClick={likePost}>
              <AiOutlineLike />
              <div>{post.likes && post.likes}</div>
            </LikeButton>
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
            댓글 {comments.length}개
          </div>
          {comments.map((cmt) => (
            <Comment
              key={cmt.id}
              cmt={cmt}
              delComment={delComment}
              fixComment={fixComment}
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
