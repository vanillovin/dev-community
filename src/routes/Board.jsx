import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Post from '../components/Post';
import { AiOutlineSearch } from 'react-icons/ai';
import { boardApi } from '../api';
import PageList from '../components/PageList';
import { useUser } from '../context';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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

  const { isLoading, data } = useQuery(
    [`${boardType}Board`, curPage, sort],
    () => boardApi.getPosts(curPage, sort, boardType).then((res) => res.data)
  );

  // # 조건? 과 요구사항
  // 검색 결과 boards와 type별(qna, tech, free) boards의 api 요청 주소가 다름.
  // queryParams? url은 건들지 않고, 일단 위에 [`${boardType}Board`, ...] <- 이 키의 data를
  // 검색 버튼을 눌렀을 때 실행되는 handleSearch 함수를 호출해서 검색 api data로 결과로 바꾸고 싶음.
  //
  // -문제점
  //   -검색어 input을 입력할 때마다 위의 const { isLoading, data } = useQuery(
  //    [`${boardType}Board`, curPage, sort], () => board; ... 데이터가 계속 요청됨.
  //   -몇 초 뒤에 mutate로 호출한 값이 사라지고 불규칙하게? 다시 위에 data가 재요청돼서
  //    검색결과 data가 사라진다.
  //
  // -궁금한 점
  //   -onSuccess에서 result 값은 위에서 요청한 url 값이 맞는가?
  //   -그리고 pagenation 인가,, state가 바뀔 때마다 재요청 되도록 query key 배열 안에
  //    state들을 넣어놨는데, 그럼 mutate나 데이터를 건드는 작업을 할 때
  //    [`${a}b`] 이렇게만 입력했는데 정상적으로 결과를 받았는데
  //    [`${a}b`, state, state] 이런 식으로 초반에 입력된 키와 똑같이 입력하는지,,
  //
  // 너무 어렵다. react-query에 대한 자료도 별로 없고 문서도 복잡하다ㅜㅜ

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>
      boardApi
        .searchPosts(keyword, curPage, searchMode, boardType)
        .then((res) => res.data),
    {
      // onMutate: () => {
      //   const previousValue = queryClient.getQueryData([`${boardType}Board`]);
      //   console.log('previousValue', data);
      //   queryClient.setQueryData([`${boardType}Board`], (old) => {
      //     console.log('old', old);
      //     return [old, data];
      //   });
      //   return previousValue;
      // },
      onSuccess: (result) => {
        console.log('성공 메시지:', result);
        queryClient.setQueriesData([`${boardType}Board`], result);
      },
    }
  );

  console.log('Board react-query data', data);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keywordInput.trim().length < 2) {
      alert('검색어는 2글자 이상 입력해주세요.');
      return;
    }
    setSearchInfo({
      keyword: keywordInput,
      searchMode: searchModeInput,
    });
    mutate();
    // mutate();
  };

  // useEffect(() => {
  //   const searchParams = new URLSearchParams();
  //   searchParams.set('searchMode', searchMode);
  //   searchParams.set('keyword', keyword);
  //   console.log('searchParams', searchParams.toString());

  //   history.push(`/board/${boardType}?` + searchParams.toString());
  // }, [searchMode, keyword]);

  // const { mutate } = useMutation(
  //   () =>
  //     boardApi
  //       .searchPosts(keyword, curPage, searchMode, boardType)
  //       .then((res) => res.data),
  //   {
  //     onSuccess: () => {
  //       refetch();
  //       queryClient.invalidateQueries([
  //         `${boardType}Board`,
  //         curPage,
  //         sort,
  //         searchInfo,
  //       ]);
  //     },
  //   }
  // );

  // const fetchSearchBoardData = (keyword, page, searchMode) => {
  //   boardApi
  //     .searchPosts(keyword, page, searchMode, boardType)
  //     .then((res) => {
  //       setBoards((prev) => ({
  //         ...prev,
  //         sort,
  //         ...res.data,
  //       }));
  //     })
  //     .catch(console.error);
  // };

  // useEffect(() => {
  //   if (keyword === '') {
  //     fetchBoardData(1);
  //   } else {
  //     fetchSearchBoardData(keyword, 1, searchMode);
  //   }
  // }, [boardType, keyword, searchMode]);

  const orderListClick = (e) => {
    const innerText = e.target.innerText;
    let sort = 'createdDate';
    if (innerText === '조회순') sort = 'views';
    if (innerText === '좋아요순') sort = 'likes';
    if (innerText === '댓글순') sort = 'commentSize';
    setCurPage(1);
    setSort(sort);
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
          <OrderItem active={sort === 'createdDate'}>최신순</OrderItem>
          <OrderItem active={sort === 'views'}>조회순</OrderItem>
          <OrderItem active={sort === 'commentSize'}>댓글순</OrderItem>
          <OrderItem active={sort === 'likes'}>좋아요순</OrderItem>
        </OrderList>

        <SearchForm handleSearch={handleSearch}>
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
