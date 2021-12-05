import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { memberApi } from '../api';
import PageList from './PageList';

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
  .bot {
    margin-top: 10px;
  }
  .type {
    cursor: pointer;
    font-size: 12px;
    padding: 2px 3px;
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
    margin-right: 10px;
  }
  .date {
    font-size: 11px;
    color: lightgray;
  }
  .title {
    font-size: 13px;
    cursor: pointer;
    color: royalblue;
    :hover {
      text-decoration: underline;
    }
  }
`;

const UserInfoBoard = ({ id, name }) => {
  console.log('UserInfoBoard', id, name);
  const [state, setState] = useState({
    loading: true,
    data: {
      contents: [],
      totalPages: null,
      currentPage: null,
      totalElements: null,
    },
  });
  const {
    data: { contents, totalPages, currentPage, totalElements },
  } = state;
  const [page, setPage] = useState([1, 2, 3, 4, 5]);

  const fetchData = async (num) => {
    try {
      const { data } = await memberApi.getUserData(id, name, num);
      console.log('fetchData', data);
      setState({
        ...state,
        loading: false,
        data: {
          ...data,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          totalElements: data.totalElements,
          contents: data.contents,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [id, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContents = async (num) => {
    try {
      const { data } = await memberApi.getUserData(id, name, num);
      setState({
        ...state,
        loading: false,
        data: {
          ...data,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          totalElements: data.totalElements,
          contents: data.contents,
        },
      });
    } catch (err) {
      console.log('fetchContents err', err);
    }
  };

  return (
    <>
      {contents && contents.length > 0 ? (
        contents.map((item) => (
          <Post
            key={item.id}
            lci={contents[0].id === item.id}
            fci={contents[contents.length - 1].id === item.id}
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
                  `에 #${item.id} 게시글을 작성하였습니다.`) ||
                  (name === 'comments' &&
                    `#${item.id} 게시글에 댓글을 남겼습니다.`) ||
                  (name === 'scraps' &&
                    `#${item.id} 게시글을 스크랩 하였습니다.`)}
              </span>
              <span className="date">
                {`${item.createdDate.split('T')[0]} ${item.createdDate
                  .split('T')[1]
                  .substring(0, 8)}`}
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
          {name === '스크랩'
            ? '스크랩한 게시물이 없습니다.'
            : `작성한 ${
                (name === 'boards' && '게시물') ||
                (name === 'comments' && '댓글')
              }이 없습니다.`}
        </div>
      )}
      {totalElements > 0 && (
        <PageList
          page={page}
          setPage={setPage}
          fetchContents={fetchContents}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default UserInfoBoard;
