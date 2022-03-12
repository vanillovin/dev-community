import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FaRegComment, FaCheck, FaThumbsUp } from 'react-icons/fa';

import memberApi from '../../apis/memberApi';
import { useT } from '../../contexts/UserContext';
import dateFormatter from '../../utils/dateFormatter';
import PageList from '../PageList';

const Container = styled.div``;
const NoticeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: rgba(65, 105, 225, 0.15);
  font-size: 0.9rem;
  .count {
    color: #fa5252;
    font-weight: bold;
  }
  .check-container {
    cursor: pointer;
    display: flex;
    align-items: center;
    :hover {
      opacity: 0.7;
    }
  }
  .check {
    width: 15px;
    height: 15px;
    text-align: center;
    background-color: black;
    color: white;
    font-size: 7px;
    margin-right: 6px;
    border-radius: 50%;
  }
`;
const Post = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: ${(props) => props.fci && '1px solid lightgray'};
  border-left: ${(props) =>
    props.checked ? '4px solid #dbe4ff' : '4px solid #748ffc'};
  .icon {
    display: inline-block;
    color: #1d1d1d;
    font-size: 12px;
    margin: 0 5px 0 0;
  }
  .date {
    font-size: 11px;
    color: lightgray;
    margin-left: 5px;
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  color: gray;
  font-size: 13px;
  margin-bottom: 3px;
`;
const Bottom = styled.div`
  font-size: 14px;
  cursor: pointer;
  color: royalblue;
  :hover {
    text-decoration: underline;
  }
`;

const NoticeBoard = ({ id }) => {
  const t = useT();
  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);
  const curPage = Number(searchParams.get('page')) || 1;

  let { data: noticeCounts, refetch } = useQuery('NoticeCounts', () =>
    memberApi.getNoticeCounts(id).then((res) => res.data)
  );

  const fetchProjects = async (curPage) => {
    const res = await memberApi.getNotices(id, curPage);
    return res.data;
  };

  const { isLoading, data } = useQuery(
    ['notices', curPage],
    () => fetchProjects(curPage),
    { keepPreviousData: true }
  );

  const goToPost = (type, id) => history.push(`/board/${type}/${id}`);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(() => memberApi.readAllNotices(id, t), {
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(['notices', curPage]);
    },
  });

  const readOneNotice = (noticeId, boardType, boardId) => {
    console.log(id, noticeId, t);
    const type =
      (boardType === 'QNA' && 'qna') ||
      (boardType === 'TECH' && 'tech') ||
      (boardType === 'FREE' && 'free');
    memberApi
      .readNotices(id, noticeId, t, boardId)
      .then((res) => {
        console.log('NoticeBoard readOneNotice res =>', res);
        goToPost(type, boardId);
      })
      .catch((err) => {
        console.log('NoticeBoard readOneNotice err =>', err);
      });
  };

  return (
    <>
      {!isLoading ? (
        <Container>
          <NoticeHeader>
            <div>
              읽지 않은 알림{' '}
              <span className="count">{noticeCounts?.count}</span> 개
            </div>
            <div onClick={mutate} className="check-container">
              <div className="check">
                <FaCheck />
              </div>
              모두 읽음 표시
            </div>
          </NoticeHeader>

          {data?.content?.map((n) => (
            <Post
              key={n.noticeId}
              checked={n.checked}
              fci={
                n.noticeId === data?.content[data?.content.length - 1].noticeId
              }
            >
              <div>
                <Top>
                  <div className="icon">
                    {(n.messageType === 'COMMENT' && <FaRegComment />) ||
                      (n.messageType === 'COMMENT_LIKE' && <FaThumbsUp />) ||
                      (n.messageType === 'BOARD_LIKE' && <FaThumbsUp />) ||
                      (n.messageType === 'SELECTION' && <FaCheck />)}
                  </div>
                  <span style={{ marginRight: 2 }}>{n.loginId} 님이</span>
                  <span className="id" style={{ marginRight: 2 }}>
                    #{n.boardId}{' '}
                  </span>
                  <span>
                    {(n.messageType === 'COMMENT' &&
                      '게시물에 댓글을 등록했습니다.') ||
                      (n.messageType === 'COMMENT_LIKE' &&
                        '게시물 회원님의 댓글에 좋아요를 눌렀습니다.') ||
                      (n.messageType === 'BOARD_LIKE' &&
                        '게시물에 좋아요를 눌렀습니다.') ||
                      (n.messageType === 'SELECTION' &&
                        '게시물 회원님의 댓글을 채택했습니다.')}
                  </span>
                  <span className="date">
                    {dateFormatter(n.createdDate, 'created')}
                  </span>
                </Top>
                <Bottom
                  onClick={() =>
                    readOneNotice(n.noticeId, n.boardType, n.boardId)
                  }
                >
                  {n.title}
                </Bottom>
              </div>
            </Post>
          ))}
        </Container>
      ) : (
        <div>loading...</div>
      )}

      {data?.totalElements > 0 && (
        <PageList
          currentPageNumber={data?.currentPage}
          endPageNumber={data?.totalPages}
        />
      )}
    </>
  );
};

export default NoticeBoard;
