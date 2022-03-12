import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { marked } from 'marked';
import parse from 'html-react-parser';
import styled from 'styled-components';

// 서버에 어떤 상태를 바꾸는 액션을 수행하는?
import { useT, useUser } from '../contexts/UserContext';
import { useDetailPost } from '../hooks/useDetailInfo.js';
import Top from '../components/DetailPost/Top';
import Bottom from '../components/DetailPost/Bottom';
import CommentInfo from '../components/DetailPost/CommentInfo';
import getBoardTitle from '../utils/getBoardTitle';
import { customMedia } from '../commons/styles/GlobalStyles';

const DetailContainer = styled.div`
  width: 800px;
  & > div {
    background: #fff;
    border: 1px solid lightgray;
  }
  ${customMedia.lessThan('tablet')`
    width: 100%;
    padding: 15px;
  `}
`;
const Content = styled.div`
  /* 상속 */
  ol,
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-inline-start: 30px;
  }
  img {
    width: 100%;
    margin: 5px 0;
  }
  a {
    color: #364fc7;
    &:hover {
      text-decoration: underline;
    }
  }
  blockquote {
    margin: 1.4rem 6px;
    border-left: 5px solid #bac8ff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: rgb(250, 250, 250);
    padding: 5px 5px 5px 15px;
    color: rgb(33, 37, 41);
    a {
      /* &:after {
        content: ']';
      } */
    }
  }
  pre {
    font-family: 'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
      'Courier New', monospace;
    padding: 10px;
    line-height: 1.4;
    font-size: 0.875rem;
    overflow-x: auto;
    letter-spacing: 0px;
    background: rgb(249, 249, 250);
  }

  table {
    /* border: 1px solid rgba(0, 0, 0, 0.1) */
    margin: 12px 0 14px;
    color: #222;
    width: auto;
    border-collapse: collapse;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  table th {
    background-color: #666;
    font-weight: 300;
    color: #fff;
    padding-top: 6px;
  }
  table th,
  table td {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 6px 14px 5px 12px;
    height: 32px;
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th {
    display: table-cell;
    vertical-align: inherit;
    font-weight: bold;
    text-align: -internal-center;
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  td {
    display: table-cell;
    vertical-align: inherit;
  }

  width: 100%;
  min-height: 70px;
  padding: 10px;
  overflow-wrap: break-word;
`;
const BoardTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  ${customMedia.lessThan('tablet')`
    padding: 0 15px;
  `}
`;

const isOk = (msg) => window.confirm(msg);

const DetailPost = () => {
  const t = useT();
  const user = useUser();
  const history = useHistory();
  const boardType = history.location.pathname.split('/')[2];
  const postId = history.location.pathname.split('/')[3];
  const boardTitle = getBoardTitle(boardType);
  // const queryClient = useQueryClient(); // vs QueryClient

  // 서버의데이터를불러와서동기화
  const { isLoading, data } = useDetailPost(postId);

  // useEffect(() => {
  //   if (error) {
  //     // 백엔드에서 서버가바쁩니다 응답메시지
  //     // toast.error(`Something went wrong: ${error.message}`);
  //   }
  // }, [error]);

  const toHtml = (markdown) => marked.parse(markdown);

  return !isLoading ? (
    <>
      <BoardTitle>{boardTitle}</BoardTitle>
      <DetailContainer>
        <div>
          <Top isCurrentUser={Boolean(user)} data={data} />
          <Content>
            {data?.content ? parse(toHtml(data?.content)) : '로딩 중입니다!'}
          </Content>
          <Bottom
            title={data?.title}
            content={data?.content}
            likes={data?.likes}
            isPostUser={+user?.id === +data?.memberId}
          />
        </div>
        <CommentInfo
          comments={data?.comments}
          commentSize={data?.commentSize}
          isSelected={data?.selected}
          isPostUser={+user?.id === +data?.memberId}
        />
      </DetailContainer>
    </>
  ) : (
    <div>loading...</div>
  );
};

export default DetailPost;
