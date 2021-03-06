import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import memberApi from '../../apis/memberApi';
import dateFormatter from '../../utils/dateFormatter';
import PageList from '../../components/PageList';

const Post = styled.div`
  padding: 10px;
  display: flex;
  background-color: white;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: ${(props) => props.fci && '1px solid lightgray'};
  border-left: ${(props) =>
    props.cmt ? '4px solid #748ffc' : '4px solid #dbe4ff'};
  border-left: ${(props) => props.selected && '4px solid #94d82d'};
  line-height: 1;
  .bot {
    margin-top: 10px;
  }
  .type {
    cursor: pointer;
    font-size: 12px;
    padding: 1px 3px;
    margin-right: 5px;
    border-radius: 2px;
    background-color: #bac8ff;
    :hover {
      background-color: #91a7ff;
    }
  }
  .id {
    color: gray;
    font-size: 13px;
    margin-right: 5px;
  }
  .date {
    font-size: 11px;
    color: lightgray;
  }
  .title {
    font-size: 14px;
    cursor: pointer;
    color: royalblue;
    :hover {
      text-decoration: underline;
    }
  }
`;

const UserInfoBoard = ({ id, name }) => {
  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);
  const curPage = Number(searchParams.get('page')) || 1;

  const { isLoading, data, isError } = useQuery(
    [`UserInfo ${name}`, curPage],
    async () => {
      return memberApi.getUserData(id, name, curPage).then((res) => res.data);
    }
  );

  return !isLoading ? (
    <>
      {data && data?.contents.length > 0 ? (
        data?.contents.map((item) => (
          <Post
            key={item.id}
            lci={data?.contents[0].id === item.id}
            fci={data?.contents[data?.contents.length - 1].id === item.id}
            cmt={item.commentSize > 0}
            selected={item.selected}
          >
            <div>
              <Link
                to={`/board/${
                  (item.boardType === 'QNA' && 'qna') ||
                  (item.boardType === 'TECH' && 'tech') ||
                  (item.boardType === 'FREE' && 'free')
                }`}
                className="type"
              >
                {(item.boardType === 'QNA' && 'Q&A') ||
                  (item.boardType === 'TECH' && 'Tech') ||
                  (item.boardType === 'FREE' && 'Free')}
              </Link>
              <span className="id">
                {(name === 'boards' &&
                  `??? #${item.id} ???????????? ?????????????????????.`) ||
                  (name === 'comments' &&
                    `#${item.id} ???????????? ????????? ???????????????.`) ||
                  (name === 'scraps' &&
                    `#${item.id} ???????????? ????????? ???????????????.`)}
              </span>
              <span className="date">
                {dateFormatter(item.createdDate, 'created')}
              </span>
            </div>
            <div className="bot">
              <Link
                to={`/board/${
                  (item.boardType === 'QNA' && 'qna') ||
                  (item.boardType === 'TECH' && 'tech') ||
                  (item.boardType === 'FREE' && 'free')
                }/${item.id}`}
                className="title"
              >
                {item.title}
              </Link>
            </div>
          </Post>
        ))
      ) : (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          {name === 'scraps'
            ? '???????????? ???????????? ????????????.'
            : `????????? ${
                (name === 'boards' && '?????????') ||
                (name === 'comments' && '??????')
              }??? ????????????.`}
        </div>
      )}

      {data?.totalElements > 0 && (
        <PageList
          currentPageNumber={data?.currentPage}
          endPageNumber={data?.totalPages}
        />
      )}
    </>
  ) : (
    <div>loading...</div>
  );
};

export default UserInfoBoard;
