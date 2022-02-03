import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Post from '../components/Post';
import { AiOutlineSearch } from 'react-icons/ai';
import { boardApi } from '../api';
import PageList from '../components/PageList';
import { useUser } from '../context';

const Container = styled.div`
  width: 750px;
  ul,
  li {
    list-style: none;
    padding: 0 0 0 1px;
  }
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
  .link {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
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
  const user = useUser();
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
    index: 'title',
    keyword: '',
  });
  const {
    sort,
    isLoading,
    contents,
    currentPage,
    totalElements,
    totalPages,
    index,
    keyword,
  } = boards;
  const [indexInput, setIndexInput] = useState('title'); // searchMode
  const [keywordInput, setKeywordInput] = useState('');
  const [pageList, setPageList] = useState([1, 2, 3, 4, 5]);

  const history = useHistory();

  // https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams
  // location.search; // /index=1&keyword=토끼

  // 주소창과 상태를 동기화
  // 상태에 따라
  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('index', index);
    searchParams.set('keyword', keyword);
    console.log('searchParams', searchParams.toString());

    history.push(`/board/${boardType}?` + searchParams.toString());
  }, [index, keyword]);

  // 검색어는 어딘가에서 유지되야 함=> keyword, index 상태를 boards 에 추가!
  // 주소창 search params로 현재 검색중인 검색어를 동기화 갱신, useEffect (주소창 갱신)
  // searchPosts를 이용해서... index랑 keyword 바뀔 때마다, if문으로 데이터 불러오기

  const onSubmit = (e) => {
    console.log(indexInput, '/', keywordInput);

    e.preventDefault();
    if (keywordInput.trim().length < 2) return;

    setBoards((prev) => ({
      ...prev,
      keyword: keywordInput,
      index: indexInput,
    }));
  };

  // 검색어를 입력하고 ENTER키나 검색버튼을 누르면 searchPosts api를 실행해서 boardsState 변경
  // pagelist에서 다른 번호를 눌러도 위의 조건이 적용되어야함.
  const fetchBoardData = (page, sort = 'createdDate') => {
    boardApi
      .getPosts(page, sort, boardType)
      .then((res) => {
        console.log('fetchBoardData res =>', res.data);
        setBoards((prev) => ({
          ...prev,
          sort,
          ...res.data,
        }));
      })
      .catch(console.error);
  };

  // ALL, CONTENT, ERROR, TITLE
  const fetchSearchBoardData = (keyword, page, index) => {
    boardApi
      .searchPosts(keyword, page, index, boardType)
      .then((res) => {
        setBoards((prev) => ({
          ...prev,
          sort,
          ...res.data,
        }));
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (keyword === '') {
      fetchBoardData(1);
    } else {
      fetchSearchBoardData(keyword, 1, index);
    }
  }, [boardType, keyword, index]);

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
        {user && (
          <Button>
            <Link
              className="link"
              to={{ pathname: '/write', state: { type: boardType } }}
            >
              새 글 쓰기
            </Link>
          </Button>
        )}
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
          <SearchSelect onChange={(e) => setIndexInput(e.target.value)}>
            <option value="title" defaultValue>
              제목
            </option>
            <option value="content">내용</option>
            <option value="all">제목+내용</option>
          </SearchSelect>
          <SearchInput
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
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
          {/* {totalPages > 0 ? (
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
          )} */}
        </>
      ) : (
        <div>loading..</div>
      )}
    </Container>
  );
};

export default Board;
