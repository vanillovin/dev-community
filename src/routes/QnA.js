import React, { useState, useEffect } from 'react';
import { Link, Switch, Route, useHistory, useLocation } from 'react-router-dom';
import Board from '../components/Board';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { useUser } from '../context';
import { boardApi } from '../api';
import PageList from '../components/PageList';

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
  padding: 0 8px;
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

const QnA = () => {
  const loggedIn = Boolean(useUser());
  const type = 'qna';
  const history = useHistory();
  const location = useLocation();
  const sort = location.state?.sort || 'id';
  const isKword = location.state?.kword;
  const kwordStr = location.pathname.split('searchType=')[1];
  const searchKword = kwordStr
    ? kwordStr.includes('&page=')
      ? kwordStr?.substring(0, kwordStr.indexOf('&page='))
      : kwordStr.substring(0, 20)
    : '';
  const sortStr =
    (sort === 'id' && 'createdDate') ||
    (sort === 'viewCount' && 'views') ||
    (sort === 'noteCount' && 'commentSize') ||
    (sort === 'likeCount' && 'likes');
  let pageNum =
    location.search.split('page=')[1] ||
    location.state?.page ||
    location.pathname.split('page=')[1] ||
    1;

  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState('0');
  const [pageState, setPageState] = useState([1, 2, 3, 4, 5]);
  const cond =
    (index === '0' && 'TITLE') ||
    (index === '1' && 'CONTENT') ||
    (index === '2' && 'ALL');

  const [board, setBoard] = useState({
    loading: true,
    totalPages: null,
    currentPage: null,
    totalElements: null,
    posts: [],
    err: null,
  });
  const { loading, totalPages, currentPage, totalElements, posts } = board;

  console.log(
    `"QnA"
- path: ${location.pathname}
- sort: ${sort} / ${sortStr} 
- searchKword: ${searchKword}  
- pageNum: ${pageNum}
- keywordState: ${keyword}
`,
    '- QnA location',
    location,
    '- QnA route state',
    location.state
  );

  const fetchPosts = async () => {
    console.log('Fn > fetchPosts pathname:', location, 'isKword:', searchKword);
    let response;
    try {
      // 으아
      if (isKword) {
        response = await boardApi.searchPosts(keyword, pageNum, cond, 'QNA');
        console.log('fetchPosts keyword res =>', response.data);
      } else {
        response = await boardApi.getPosts(pageNum, sortStr, type);
        console.log(
          'fetchPosts !keyword res =>',
          pageNum,
          sortStr,
          response.data
        );
      }
      setBoard({
        ...board,
        loading: false,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalElements: response.data.totalElements,
        posts: response.data.contents,
      });
    } catch (err) {
      console.log('fetchPosts err =>', err);
      setBoard({ ...board, error: err });
    }
  };

  useEffect(() => {
    console.log('"QnA" useEffect =>');
    fetchPosts();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const writePost = () => {
    history.push({
      pathname: '/write',
      state: { type },
    });
  };

  const routeInfo = {
    type,
    sort,
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim().length < 2) {
      alert('검색어를 2글자 이상 입력해주세요');
      return;
    }
    history.push({
      pathname: `/board/qna?sort=id&searchType=${cond}=${keyword}`,
      state: {
        type,
        sort: 'id',
        page: 1,
        cond: searchKword.split('=')[0],
        kword: searchKword.split('=')[1],
      },
    });
  };

  return (
    <Container>
      <Header>
        <Title>Q&A</Title>
        {loggedIn && <Button onClick={writePost}>새 글 쓰기</Button>}
      </Header>

      <FilterContainer>
        <OrderList>
          <OrderItem active={sort === 'id'}>
            <Link
              to={{
                pathname: '/board/qna?sort=id',
                state: { type, sort: 'id' },
              }}
            >
              최신순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'viewCount'}>
            <Link
              to={{
                pathname: '/board/qna?sort=viewCount',
                state: { type, sort: 'viewCount' },
              }}
            >
              조회순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'likeCount'}>
            <Link
              to={{
                pathname: '/board/qna?sort=likeCount',
                state: { type, sort: 'likeCount' },
              }}
            >
              좋아요순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'noteCount'}>
            <Link
              to={{
                pathname: '/board/qna?sort=noteCount',
                state: { type, sort: 'noteCount' },
              }}
            >
              댓글순
            </Link>
          </OrderItem>
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
          <SearchButton onClick={onSubmit}>
            <AiOutlineSearch className="sbtn" />
          </SearchButton>
        </SearchForm>
      </FilterContainer>

      <Switch>
        <Route exact path="/board/qna">
          <Board loading={loading} posts={posts} type="qna" />
          <PageList
            pageState={pageState}
            setPageState={setPageState}
            totalPages={totalPages}
            currentPage={currentPage}
            routeInfo={routeInfo}
            searchKword={searchKword}
          />
        </Route>
        <Route exact path="/board/qna?*">
          <Board loading={loading} posts={posts} type="qna" />
          <PageList
            pageState={pageState}
            setPageState={setPageState}
            totalPages={totalPages}
            currentPage={currentPage}
            routeInfo={routeInfo}
            searchKword={searchKword}
          />
        </Route>
      </Switch>
    </Container>
  );
};

export default QnA;
