import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { memberApi } from '../../api';
import styled from 'styled-components';
import { useT } from '../../context';
import { FaRegComment, FaCheck, FaThumbsUp } from 'react-icons/fa';
import PageList from '../../components/PageList';
import dateFormatter from '../../dateFormatter';

const Container = styled.div``;
const NoticeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: rgba(65, 105, 225, 0.15);
  .count {
    color: #fa5252;
    font-weight: bold;
  }
  .check-container {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .check {
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    color: white;
    font-size: 8px;
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
  margin-bottom: 5px;
  color: gray;
  font-size: 13px;
  /* margin-right: 10px; */
`;
const Bottom = styled.div`
  font-size: 14px;
  cursor: pointer;
  color: royalblue;
  :hover {
    text-decoration: underline;
  }
`;

// 고치기 -> 갈아엎어야실력오름
// get만 useQuery - 나머지는다 useMutation
const NoticeBoard = ({ id }) => {
  const t = useT();
  const history = useHistory();

  const [page, setPage] = useState(1);

  let { data: noticeCounts, refetch } = useQuery('NoticeCounts', () =>
    memberApi.getNoticeCounts(id).then((res) => res.data)
  );

  const fetchProjects = (page = 1) => {
    console.log('fetchProjects page', page);
    setPage(page);
    return memberApi.getNotices(id, page).then((res) => res.data);
  };

  const { isLoading, data } = useQuery(
    ['notices', page],
    () => fetchProjects(page),
    { keepPreviousData: true }
  );

  const goToPost = (type, id) => history.push(`/board/${type}/${id}`);

  const queryClient = useQueryClient();

  // 선언적 명령적
  // usequery는 만들자마자 실행되는데 mutate는 아직 실행되지 않음.
  // https://tkdodo.eu/blog/mastering-mutations-in-react-query#invalidation
  // () => memberApi.readAllNotices(id, t),
  // refetch -> useMutation 객체 구조 분해 할당 공부하기!
  // 다른토큰과다른아이디를쓸수도있음 () => {}
  const { mutate } = useMutation(() => memberApi.readAllNotices(id, t), {
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(['notices', page]);
    },
  });

  // 원리 -> 사용법 동작
  // fetch 404 에러안던져짐 status
  // status code에 따라 다르게동작을해야할때 (단순성공실패x)
  // switch도 여러가지동작
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

  // 2xx 번 대 응답 -> 성공!
  // 안 좋은 응답 -> 실패
  // 애초에 서버에서 응답을 받지 못한 경우... -> 예외

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
    </>
  );
};

export default NoticeBoard;
