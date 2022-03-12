import React from 'react';
import { AiOutlineComment, AiOutlineEye } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { BsBookmarkFill } from 'react-icons/bs';
import styled from 'styled-components';

import { useMutation } from 'react-query';

import boardApi from '../../apis/boardApi';
import dateFormatter from '../../utils/dateFormatter';
import { useT } from '../../contexts/UserContext';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Header = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgray;
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
const HeaderTop = styled.div`
  /* border: 1px solid black; */
  height: 25px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  justify-content: space-between;
`;
const BookMark = styled.div`
  cursor: pointer;
  margin-left: 40px;
  color: #91a7ff;
  font-size: 20px;
  &:active {
    color: #dbe4ff;
  }
`;
const Title = styled.div`
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
`;

const Top = ({ isCurrentUser, data }) => {
  const t = useT();
  const history = useHistory();
  const postId = history.location.pathname.split('/')[3];

  // 스크랩 성공실패시 조회수가 올라서(get요청?) staleTime을 5분으로 설정함
  const { mutate } = useMutation(() => boardApi.scrapPost(postId, t), {
    onSuccess: () => {
      // console.log('scrapPost onSuccess', data);
      alert('게시글 스크랩 성공.');
    },
    onError: (error) => {
      // console.log('scrapPost error', error);
      alert(error?.response?.data.message);
    },
  });

  return (
    <Header>
      <HeaderTop>
        <div className="id">#{data.id}</div>
        <div className="top-right">
          <div className="icon">
            <AiOutlineComment />
            <span>{data.commentSize}</span>
          </div>
          <div className="icon">
            <AiOutlineEye />
            <span>{data.views}</span>
          </div>
        </div>
      </HeaderTop>

      <Flex>
        <div>
          <Title>{data.title}</Title>
          <div>
            <span
              className="author"
              onClick={() =>
                history.push({
                  pathname: `/user/info/${data.memberId}`,
                  state: {
                    memberId: data.memberId,
                  },
                })
              }
            >
              {data.author}
            </span>
            <span className="date">
              {data.createdDate &&
                dateFormatter(data.createdDate, 'created', '작성')}
              {data.createdDate !== data.lastModifiedDate &&
                dateFormatter(data.lastModifiedDate, 'modified', '수정')}
            </span>
          </div>
        </div>
        {isCurrentUser && (
          <BookMark title="게시글 스크랩" onClick={mutate}>
            <BsBookmarkFill />
          </BookMark>
        )}
      </Flex>
    </Header>
  );
};

export default Top;
