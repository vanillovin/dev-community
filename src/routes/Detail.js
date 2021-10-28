import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router';
import styled from 'styled-components';
import { boardApi } from '../api';
import { useT, useUser } from '../context';
// import ReactHtmlParser from 'react-html-parser';
import { GrLike } from 'react-icons/gr';

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
`;
const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const Content = styled.div`
  width: 100%;
  padding: 10px;
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-wrap: break-word;
`;
const LikeContainer = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
`;
const LikeButton = styled.div`
  cursor: pointer;
  & > span {
    margin-left: 5px;
  }
`;
const CommentContainer = styled.div`
  width: 100%;
  background: white;
  border: 1px solid lightgray;
`;
const CommentForm = styled.form`
  display: flex;
  width: 100%;
  height: 70px;
  background-color: gray;
`;
const CommentInput = styled.textarea`
  width: 80%;
  min-height: 100%;
  padding: 10px;
  outline: none;
  resize: none;
  border: none;
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
const Comment = styled.div`
  padding: 10px;
  border-bottom: 1px solid lightgray;
  white-space: pre-line;
  overflow-wrap: break-word;
`;

const Detail = ({ match, location }) => {
  const history = useHistory();
  const { type, id } = match.params;
  console.log(
    '"Detail"',
    'type:',
    type,
    'id:',
    id,
    'match:',
    match,
    'location:',
    location
  );

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

  useEffect(() => {
    boardApi
      .getPost(id)
      .then((res) => {
        console.log('detail res', res);
        setState({
          ...state,
          loading: false,
          post: res.data,
          comments: res.data.comments,
        });
      })
      .catch((err) => {
        console.log('detail err', err || err.reponse.data);
        setState({ ...state, error: err });
      });
  }, []);

  // 빈칸 return 했는데 계쏙 새로고침됨
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
    boardApi
      .sendComment(id, { content }, t)
      .then((res) => {
        console.log('comments res', res);
        window.location.href = location.pathname;
      })
      .catch((err) => {
        console.log('comments err', err || err.reponse.data);
      });
  };

  const onChange = (e) => setContent(e.target.value);

  return !loading ? (
    <>
      <Title>{title}</Title>
      <DetailContainer>
        <div
          style={{
            border: '1px solid lightgray',
            marginBottom: 20,
            background: 'white',
          }}
        >
          <Header>
            <div style={{ color: 'gray', fontSize: 14 }}>#{post.id}</div>
            <div style={{ fontWeight: 'bold', fontSize: 20, marginLeft: -1 }}>
              {post.title}
            </div>
            <div>
              <div style={{ fontSize: 15, marginRight: 5 }}>{post.author}</div>
              <span style={{ color: 'gray', fontSize: 12 }}>
                {post.createdDate &&
                  `${post.createdDate.split('T')[0]} ${post.createdDate
                    .split('T')[1]
                    .substring(0, 8)} 작성`}
              </span>
              <span style={{ color: 'gray', fontSize: 12 }}>
                {post.createdDate &&
                  post.lastModifiedDate &&
                  (post.createdDate === post.lastModifiedDate
                    ? ''
                    : `${post.lastModifiedDate.split('T')[0]} ${post.createdDate
                        .split('T')[1]
                        .substring(0, 5)} 수정`)}
              </span>
            </div>
          </Header>
          <Content>
            <div>{post.content}</div>
          </Content>
          <LikeContainer>
            <LikeButton>
              <GrLike />
              <span>{post.likes}</span>
            </LikeButton>
          </LikeContainer>
        </div>

        <CommentContainer>
          <div style={{ background: '#e9ecef', padding: 10, fontSize: 14 }}>
            댓글 {comments.length}개
          </div>
          <div>
            {comments.map((cmt) => (
              <Comment key={cmt.id}>
                <div>
                  <div style={{ fontSize: 15, marginRight: 5 }}>
                    {cmt.author}
                  </div>
                  <span style={{ color: 'gray', fontSize: 12 }}>
                    {cmt.createdDate &&
                      `${cmt.createdDate.split('T')[0]} ${cmt.createdDate
                        .split('T')[1]
                        .substring(0, 8)} 작성`}
                  </span>
                  <span style={{ color: 'gray', fontSize: 12 }}>
                    {cmt.createdDate &&
                      cmt.lastModifiedDate &&
                      (cmt.createdDate === cmt.lastModifiedDate
                        ? ''
                        : `${
                            cmt.lastModifiedDate.split('T')[0]
                          } ${cmt.createdDate
                            .split('T')[1]
                            .substring(0, 5)} 수정`)}
                  </span>
                </div>
                <Content style={{ padding: '6px 0' }}>{cmt.content}</Content>
                <div>
                  <GrLike />
                  <span style={{ marginLeft: 5 }}>{cmt.likes}</span>
                </div>
              </Comment>
            ))}
          </div>
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
