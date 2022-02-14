import React, { useEffect, useState, useCallback } from 'react';
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
  const boardType = location.state?.type || location.pathname.split('/')[2];
  const boardTitle =
    (boardType === 'qna' && 'Q&A') ||
    (boardType === 'tech' && 'Tech') ||
    (boardType === 'free' && '자유게시판');

  const history = useHistory();

  const search = new URLSearchParams(location.search);
  const sort = search.get('sort') || 'createdDate';
  const curPage = Number(search.get('page')) || 1;

  const [pageList, setPageList] = useState([1, 2, 3, 4, 5]);

  const [searchModeInput, setSearchModeInput] = useState('title');
  const [keywordInput, setKeywordInput] = useState('');

  // 원천상태는 반드시 한 곳에서만 관리한다
  const initSearchInfo = {
    searchMode: 'title',
    keyword: '',
  };
  const [searchInfo, setSearchInfo] = useState(initSearchInfo);
  const { keyword, searchMode } = searchInfo;

  const handleClick = (pageNumber) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', pageNumber);
    console.log('searchParams', searchParams.toString());
    history.push(`/board/${boardType}?` + searchParams.toString());
  };

  // 쿼리를 트리거(방아쇠를당기다-실행)
  const { isLoading, data } = useQuery(
    [`${boardType}Board`, curPage, sort, searchInfo],
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
  console.log('Board data', data);

  const fetchBoards = (page = 1) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    // console.log('searchParams', searchParams.toString());
    history.push(`/board/${boardType}?` + searchParams.toString());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoards(1);
    if (keywordInput.trim().length < 2) {
      alert('검색어는 2글자 이상 입력해주세요.');
      return;
    }
    setSearchInfo({
      searchMode: searchModeInput,
      keyword: keywordInput,
    });
  };

  useEffect(() => {
    if (keyword === '') return;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('searchMode', searchMode);
    searchParams.set('keyword', keyword);
    // console.log('searchParams', searchParams.toString());
    history.push(`/board/${boardType}?` + searchParams.toString());
  }, [boardType, history, keyword, location.search, searchMode]);

  const handleOrderListClick = ({ target: { tagName, dataset } }) => {
    if (tagName === 'UL') return;

    fetchBoards(1);
    const sort = dataset.name;

    setSearchModeInput('title');
    setKeywordInput('');

    setSearchInfo(initSearchInfo);
    history.push(`/board/${boardType}?sort=${sort}&page=1`);
  };

  // 근본적인 상태 주소창을 바꾸고 react-query 요청 parcing
  const handleCancelSearch = () => {
    console.log('Cancel ...');
    // 궁극적으로
    // 주소창을 바꿔야 함.
    // searchMode와 keyword를 주소창에서 제거하도록 해야 함.

    // page도 1로 바꿔야 함.
    console.log(history.location);
    const params = new URLSearchParams(history.location.search);
    // https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams?
    params.set('page', 1);
    params.get('searchMode') && params.delete('searchMode');
    params.get('keyword') && params.delete('keyword');
    console.log(`${history.location.pathname}?` + params.toString());
    // history.push(`${history.location.pathname}?` + params.toString());

    // history push replace

    // 안티패턴
    // setSearchInfo(initSearchInfo);
    // fetchBoards(1);
    // setSearchModeInput('title');
    // setKeywordInput('');
    // // setSearchInfo(initSearchInfo);
    // history.push(`/board/${boardType}?sort=createdDate&page=1`);
  };

  // useEffect의 기능, 마운트 언마운트 lifecycle cleanup 정확히 어느 경우에 사용..?
  // 모든 게 선언적일 수 x - side effect 부수효과
  // 실제로html이붙음-마운트 / useEffect는 없을 수록 좋음. 부수효과 안 쓸 수 있으면

  // 써야할 때는, 자기 기능대로, 관심사 별로 쪼개기
  // useEffect(() => {
  //   검색하고 boardType 바꾸면 url 그대로 남아있고 use-query에서 검색 api 실행됨
  //   /board/tech?sort=createdDate&page=1&searchMode=title&keyword=%E3%85%87%E3%85%87
  //   handleCancelSearch();
  //   setPageList([1, 2, 3, 4, 5]);
  //   return () => setPageList([1, 2, 3, 4, 5]);
  // }, []);

  // 선언형 프로그래밍 패러다임
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
          <SearchSelect
            value={searchModeInput}
            onChange={(e) => setSearchModeInput(e.target.value)}
          >
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
          {keyword !== '' && (
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
              pageListState={pageList}
              currentPageNumber={data?.currentPage}
              endPageNumber={data?.totalPages}
              handleClick={handleClick}
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
