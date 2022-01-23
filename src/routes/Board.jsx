import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Post from '../components/Post';
import { AiOutlineSearch } from 'react-icons/ai';
import { boardApi } from '../api';
import PageList from '../components/PageList';
import { logRoles } from '@testing-library/react';

const Container = styled.div`
  width: 750px;
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
  width: 80px;
  height: 100%;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
`;
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;
const OrderList = styled.ul`
  display: flex;
  align-items: center;
`;
const OrderItem = styled.li`
  color: gray;
  padding: 2px 1px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 18px;
  font-weight: bold;
  color: ${(props) => props.active && '#000'};
`;
const SearchForm = styled.form`
  border: none;
  height: 30px;
  display: flex;
  position: relative;
  align-items: center;
  outline: 1px solid lightgray;
  background-color: #fff;
  &:hover {
    outline: 1px solid #748ffc;
    .sbtn {
      color: #748ffc;
    }
  }
`;
const SearchSelect = styled.select`
  color: #495057;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 6px 0 8px;
  background-color: #fff;
`;
const SearchInput = styled.input`
  border: none;
  height: 100%;
  outline: none;
  padding: 5px 10px;
`;
const SearchButton = styled.button`
  padding: 8px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #fff;
`;

const Board = () => {
  const location = useLocation();
  const boardType = location.pathname.split('/')[2] || location.state?.type;
  const boardTitle =
    (boardType === 'qna' && 'Q&A') ||
    (boardType === 'tech' && 'Tech') ||
    (boardType === 'free' && '자유게시판');
  // const sort = location.pathname.split('=')[1] || location.state?.sort || null;

  const [boards, setBoards] = useState({
    sort: '',
    isLoading: false,
    contents: null,
    currentPage: 1,
    totalElements: null,
    totalPages: null,
  });
  const { sort, isLoading, contents, currentPage, totalElements, totalPages } =
    boards;
  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState('0');
  const [pageList, setPageList] = useState([1, 2, 3, 4, 5]);

  const onSubmit = (e) => {
    console.log(index, '/', keyword);
    e.preventDefault();
    if (keyword.trim().length < 2) return 2;
    // kword, page, cond, type
    // boardApi.searchPosts(keyword, 1, cond, boardType)
  };

  // 검색어를 입력하고 ENTER키나 검색버튼을 누르면 searchPosts api를 실행해서 boardsState 변경
  // pagelist에서 다른 번호를 눌러도 위의 조건이 적용되어야함.
  const fetchBoardData = (page, sort = 'createdDate') => {
    boardApi
      .getPosts(page, sort, boardType)
      .then((res) => {
        console.log('fetchBoardData res =>', res.data);
        setBoards({
          ...boards,
          sort,
          ...res.data,
        });
      })
      .catch((err) => {
        console.log('fetchBoardData err =>', err.response.data);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchBoardData(1);
  }, [boardType]);

  const orderListClick = (e) => {
    const innerText = e.target.innerText;
    let sort = 'createdDate';
    if (innerText === '조회순') sort = 'views';
    if (innerText === '좋아요순') sort = 'likes';
    if (innerText === '댓글순') sort = 'commentSize';
    fetchBoardData(1, sort);
  };

  return (
    <Container>
      <Header>
        <Title>{boardTitle}</Title>
        <Button>새 글 쓰기</Button>
      </Header>

      <FilterContainer>
        <OrderList onClick={orderListClick}>
          {console.log('sort', sort)}
          <OrderItem active={sort === 'createdDate'}>최신순</OrderItem>
          <OrderItem active={sort === 'views'}>조회순</OrderItem>
          <OrderItem active={sort === 'commentSize'}>댓글순</OrderItem>
          <OrderItem active={sort === 'likes'}>좋아요순</OrderItem>
        </OrderList>

        <SearchForm onSubmit={onSubmit}>
          <SearchSelect onChange={(e) => setIndex(e.target.value)}>
            <option value="0" defaultValue>
              제목
            </option>
            <option value="1">내용</option>
            <option value="2">제목+내용</option>
          </SearchSelect>
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            minLength="2"
            maxLength="20"
          />
          <SearchButton type="submit" onClick={onSubmit}>
            <AiOutlineSearch className="sbtn" />
          </SearchButton>
        </SearchForm>
      </FilterContainer>

      {!isLoading ? (
        <>
          {contents?.map((post) => (
            <Post
              key={post.id}
              post={post}
              type={boardType}
              fci={contents[0].id}
            />
          ))}
          {totalPages > 0 ? (
            <PageList
              page={pageList}
              setPage={setPageList}
              fetchContents={fetchBoardData}
              totalPages={totalPages}
              currentPage={currentPage}
              sort={sort}
            />
          ) : (
            <div style={{ marginTop: 150, textAlign: 'center' }}>
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
