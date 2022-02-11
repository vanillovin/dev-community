import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
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
  &:focus-within {
    outline: 1px solid #bac8ff;
    box-shadow: 0px 0px 4px #bac8ff;
    transition: all 0.1s ease-in-out;
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
  &:hover {
    .sbtn {
      color: #748ffc;
    }
  }
`;
const CancelButton = styled.button`
  border: 0;
  padding: 0;
  height: 100%;
  background-color: #ffe066;
  cursor: pointer;
  &:hover {
    background-color: #ffd43b;
  }
  .cbtn {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 6px;
    svg {
      font-size: 1rem;
      color: white;
      margin-right: 2px;
    }
  }
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

  const initSearchInfo = {
    keyword: '',
    searchMode: '',
  };
  const [searchInfo, setSearchInfo] = useState(initSearchInfo);
  const { keyword, searchMode } = searchInfo;

  const fetchBoards = (page = 1) => {
    console.log('fetchBoards page', page);
    setCurPage(page);
  };

  // const { isLoading, data } = useQuery(
  //   ['notices', page],
  //   () => fetchProjects(page),
  //   { keepPreviousData: true }
  // );

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

  console.log('Board data', curPage, data, sort);

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
    if (!keyword || !searchMode) return;
    const searchParams = new URLSearchParams();
    searchParams.set('searchMode', searchMode);
    searchParams.set('keyword', keyword);
    console.log('searchParams', searchParams.toString());
    setSort('createdDate');
    history.push(`/board/${boardType}?` + searchParams.toString());
  }, [boardType, history, keyword, searchMode]);

  const handleOrderListClick = (e) => {
    const sort = e.target.dataset.name;
    setCurPage(1);
    setSort(sort);
    setSearchInfo(initSearchInfo);
    history.push(`/board/${boardType}`);
  };

  const handleCancelSearch = (e) => {
    e.preventDefault();
    setKeywordInput('');
    setSearchInfo(initSearchInfo);
    history.push(`/board/${boardType}`);
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
          {[
            ['최신순', 'createdDate'],
            ['조회순', 'views'],
            ['댓글순', 'commentSize'],
            ['좋아요순', 'likes'],
          ].map(([text, name]) => (
            <OrderItem key={name} data-name={name} active={sort === name}>
              {text}
            </OrderItem>
          ))}
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
          <SearchButton type="submit">
            <AiOutlineSearch className="sbtn" />
          </SearchButton>
          {/* 폼안에 버튼 만들 때 조심하기 */}
          {(keyword || searchMode) && (
            <CancelButton type="button" onClick={handleCancelSearch}>
              <div className="cbtn">
                <MdCancel /> clear
              </div>
            </CancelButton>
          )}
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
          {data?.totalElements > 0 ? (
            <PageList
              page={pageList}
              setPage={setPageList}
              fetchContents={fetchBoards}
              totalPages={data?.totalPages}
              currentPage={data?.currentPage}
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
