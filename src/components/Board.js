import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { AiOutlineSearch } from 'react-icons/ai';
import Post from './Post';
import { boardApi } from '../api';
import PageList from './PageList';

const BoardContainer = styled.div`
  width: 750px;
  min-width: 750px;
`;
const BoardHeader = styled.div`
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
`;
const FilterContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  /* border: 1px solid black; */
`;
const FilterUL = styled.ul`
  display: flex;
  align-items: center;
`;
const FilterLI = styled.div`
  color: gray;
  padding: 2px 1px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 12px;
  font-weight: bold;
  color: ${(props) => props.active && '#000'};
`;
const SearchContainer = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  border: 1px solid lightgray;
`;
const SearchInput = styled.input`
  width: 86%;
  height: 100%;
  padding: 5px 10px;
  outline: none;
  border: none;
`;
const SearchButton = styled.button`
  width: 14%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #dee2e6;
  &:hover {
    background-color: #ced4da;
  }
`;
const Button = styled.button`
  border: none;
  width: 80px;
  height: 100%;
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

const Board = ({ title, loggedIn }) => {
  let type;
  if (title === 'Q&A') type = 'qna';
  if (title === 'Tech') type = 'tech';
  if (title === 'Free') type = 'free';
  const history = useHistory();
  const [filter, setFilter] = useState({
    latest: true,
    views: false,
  });
  const [state, setState] = useState({
    loading: true,
    totalPage: null,
    currentPage: null,
    posts: [],
    err: null,
  });
  const [page, setPage] = useState([1, 2, 3, 4, 5]);
  const { latest, views } = filter;
  const { loading, totalPage, currentPage, posts } = state;

  const filterPost = (text) => {
    if (text === 'latest') setFilter({ ...filter, latest: true, views: false });
    if (text === 'views') setFilter({ ...filter, latest: false, views: true });
  };

  const fetchPosts = async (num) => {
    // console.log(num, type);
    try {
      const response = await boardApi.getPosts(num, type);
      console.log('Board getPosts res', response.data);
      setState({
        ...state,
        loading: false,
        totalPage: response.data.totalPage,
        currentPage: response.data.currentPage,
        posts: response.data.contents,
      });
    } catch (err) {
      console.log(err);
      setState({ ...state, error: err });
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const test = (e) => {
    const pNum = e.target.innerText;
    const cName = e.target.className;

    if (pNum === '') return;
    if (currentPage === +pNum) return;
    if (cName.includes('prev')) {
      if (page[0] !== 1) {
        setPage(page.map((num) => num - 5));
        fetchPosts(page[0] - 5);
      }
      return;
    }
    if (cName.includes('next')) {
      // 수정 5인데 2칸으로 넘어감
      if (page[page.length - 1] >= totalPage) return;
      setPage(page.map((num) => num + 5));
      fetchPosts(page[0] + 5);
      return;
    }
    if (cName.includes('first')) {
      if (currentPage === 1) return;
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1);
      return;
    }
    if (cName.includes('last')) {
      let x = totalPage;
      if (totalPage % 5 === 1) x += 4;
      if (totalPage % 5 === 2) x += 3;
      if (totalPage % 5 === 3) x += 2;
      if (totalPage % 5 === 4) x += 1;
      if (currentPage === totalPage) return;
      setPage([1, 2, 3, 4, 5].map((num) => num + 5 * (x / 5 - 1)));
      fetchPosts(totalPage);
      return;
    }

    fetchPosts(pNum);
  };

  return (
    <BoardContainer>
      <BoardHeader>
        <Title>{title}</Title>
        {loggedIn && (
          <Button
            onClick={() =>
              history.push({
                pathname: '/write',
                state: {
                  type,
                },
              })
            }
          >
            새 글 쓰기
          </Button>
        )}
      </BoardHeader>

      <FilterContainer>
        <FilterUL>
          <FilterLI active={latest} onClick={() => filterPost('latest')}>
            최신순
          </FilterLI>
          <FilterLI active={views} onClick={() => filterPost('views')}>
            조회순
          </FilterLI>
        </FilterUL>
        <SearchContainer>
          <SearchInput />
          <SearchButton>
            <AiOutlineSearch />
          </SearchButton>
        </SearchContainer>
      </FilterContainer>

      {!loading ? (
        latest ? (
          <>
            {posts.map((post) => (
              <Post key={post.id} post={post} type={type} fci={posts[0].id} />
            ))}

            {totalPage > 0 ? (
              <PageList
                fetchContents={fetchPosts}
                totalPage={totalPage}
                currentPage={currentPage}
              />
            ) : (
              <div style={{ marginTop: 150, textAlign: 'center' }}>
                아직 게시물이 없습니다.
              </div>
            )}
          </>
        ) : (
          <h1>views</h1>
        )
      ) : (
        <div style={{ marginTop: 100, textAlign: 'center' }}>loading...</div>
      )}
    </BoardContainer>
  );
};

export default Board;
