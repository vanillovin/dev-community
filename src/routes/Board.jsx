import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { boardApi } from '../api';
import { useUser } from '../context';
import { useQuery } from 'react-query';
import Post from '../components/Post';
import PageList from '../components/PageList';

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

  const history = useHistory();

  const [sort, setSort] = useState('createdDate');
  const [curPage, setCurPage] = useState(1);
  const [pageList, setPageList] = useState([1, 2, 3, 4, 5]);

  const [searchModeInput, setSearchModeInput] = useState('title'); // searchModeInput
  const [keywordInput, setKeywordInput] = useState('');
  const [searchInfo, setSearchInfo] = useState({
    keyword: '',
    searchMode: '',
  });
  const { keyword, searchMode } = searchInfo;

  // 검색 결과 이후에 cancle 버튼을 누르거나, 최신순 조회순 등 탭, 다른 boardType을 클릭해도
  // http://localhost:3000/board/qna?searchMode=undefined&keyword=undefined
  // url이 저렇게 뜸. useEffect를 어떻게 섞어쓸 수 있을까
  const { isLoading, data } = useQuery(
    [`${boardType}Board`, curPage, sort, searchInfo],
    () => {
      if (!keyword || !searchMode) {
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

  console.log('Board data', data, curPage, sort);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('handleSearch');
    if (keywordInput.trim().length < 2) {
      alert('검색어는 2글자 이상 입력해주세요.');
      return;
    }
    setSearchInfo({
      ...searchInfo,
      keyword: keywordInput,
      searchMode: searchModeInput,
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('searchMode', searchMode);
    searchParams.set('keyword', keyword);
    console.log('searchParams', searchParams.toString());

    history.push(`/board/${boardType}?` + searchParams.toString());
    // }, [keyword, searchMode]);
  }, [boardType, history, keyword, searchMode]);

  const handleOrderListClick = (e) => {
    const innerText = e.target.innerText;
    let sort = 'createdDate';
    if (innerText === '조회순') sort = 'views';
    if (innerText === '좋아요순') sort = 'likes';
    if (innerText === '댓글순') sort = 'commentSize';
    setCurPage(1);
    setSort(sort);
    setSearchInfo({});
  };

  const handleCancelSearch = (e) => {
    e.preventDefault();
    setKeywordInput('');
    setSearchInfo({});
    history.push(`/board/${boardType}`);
    // http://localhost:3000/board/qna?searchMode=undefined&keyword=undefined
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
        <OrderList onClick={handleOrderListClick}>
          <OrderItem active={sort === 'createdDate'}>최신순</OrderItem>
          <OrderItem active={sort === 'views'}>조회순</OrderItem>
          <OrderItem active={sort === 'commentSize'}>댓글순</OrderItem>
          <OrderItem active={sort === 'likes'}>좋아요순</OrderItem>
        </OrderList>

        <SearchForm onSubmit={handleSearch}>
          <SearchSelect onChange={(e) => setSearchModeInput(e.target.value)}>
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
          <button className="dbtn" onClick={handleCancelSearch}>
            x
          </button>
          <SearchButton type="submit" onClick={handleSearch}>
            <AiOutlineSearch className="sbtn" />
          </SearchButton>
        </SearchForm>
      </FilterContainer>

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
        </>
      ) : (
        <div>loading..</div>
      )}
    </Container>
  );
};

export default Board;
