import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { BsPencilFill } from 'react-icons/bs';

import boardApi from '../apis/boardApi';
import { useUser } from '../contexts/UserContext';
import Filter from '../components/Board/Filter';
import Post from '../components/Board/Post';
import PageList from '../components/PageList';
import getBoardTitle from '../utils/getBoardTitle';
import { customMedia } from '../commons/styles/GlobalStyles';

const Container = styled.div`
  width: 800px;
  ul,
  li {
    list-style: none;
    padding: 0 0 0 1px;
  }
  ${customMedia.lessThan('tablet')`
    width: 100%;
    padding: 15px;
  `}
`;
const Header = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0 30px 0;
`;
const Button = styled.button`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  height: 100%;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  background-color: #5c7cfa;
  &:hover {
    background-color: #4263eb;
  }
  &:active {
    background-color: #364fc7;
  }
  transition: all 0.1s linear;
  svg {
    margin-right: 5px;
  }
`;

const Board = () => {
  const user = useUser();
  const location = useLocation();
  const boardType = location.state?.type || location.pathname.split('/')[2];
  const boardTitle = getBoardTitle(boardType, true);

  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);
  const sort = searchParams.get('sort') || 'createdDate';
  const curPage = Number(searchParams.get('page')) || 1;
  const searchMode = searchParams.get('searchMode') || '';
  const keyword = searchParams.get('keyword') || '';

  const searchSelectElem = document.getElementById('searchSelect');
  const searchInputElem = document.getElementById('searchInput');

  // const handleClick = (pageNumber) => {
  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set('page', pageNumber);
  //   history.push(`/board/${boardType}?` + searchParams.toString());
  // };

  const { isLoading, data } = useQuery(
    [`${boardType}Board`, curPage, sort, searchMode, keyword],
    async () => {
      if (!keyword) {
        return boardApi
          .getPosts(curPage, sort, boardType)
          .then((res) => res.data);
      } else {
        return boardApi
          .searchPosts(keyword, curPage, searchMode, boardType)
          .then((res) => res.data);
      }
    }
  );
  console.log(`${boardType}Board data`, data);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInputElem.value.trim().length < 2) {
      alert('검색어는 2글자 이상 입력해주세요.');
      return;
    }
    searchParams.set('sort', 'createdDate');
    searchParams.set('searchMode', searchSelectElem.value);
    searchParams.set('keyword', searchInputElem.value);
    history.push(`${history.location.pathname}?` + searchParams.toString());
  };

  const clearSearch = () => {
    searchParams.set('page', 1);
    searchParams.get('searchMode') && searchParams.delete('searchMode');
    searchParams.get('keyword') && searchParams.delete('keyword');
    searchSelectElem.value = 'title';
    searchInputElem.value = '';
  };

  const handleOrderListClick = (name) => {
    clearSearch();
    searchParams.set('sort', name);
    history.push(`/board/${boardType}?` + searchParams.toString());
  };

  const handleCancelSearch = () => {
    // '궁극적으로' 주소창을 바꿔야 함. searchMode와 keyword를 주소창에서 제거하도록 해야 함.
    // https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams?
    clearSearch();
    history.push(`/board/${boardType}?` + searchParams.toString());
  };

  const goToWrite = () =>
    history.push({ pathname: '/write', state: { type: boardType } });

  return (
    <Container>
      <Header>
        <Title>{boardTitle}</Title>
        {user && (
          <Button onClick={goToWrite}>
            <BsPencilFill />새 글 쓰기
          </Button>
        )}
      </Header>

      <Filter
        sort={sort}
        handleOrderListClick={handleOrderListClick}
        handleSearch={handleSearch}
        keyword={keyword}
        handleCancelSearch={handleCancelSearch}
      />

      {!isLoading ? (
        <>
          {data?.contents?.map((post) => (
            <Post
              key={post.id}
              post={post}
              type={boardType}
              fci={data?.contents[0].id}
            />
          ))}
          {data?.totalElements > 0 ? (
            <PageList
              currentPageNumber={data?.currentPage}
              endPageNumber={data?.totalPages}
            />
          ) : (
            <div style={{ marginTop: 50, textAlign: 'center' }}>
              아직 게시물이 없습니다.
            </div>
          )}
        </>
      ) : (
        <div>loading..</div>
      )}
    </Container>
  );
};

export default Board;
