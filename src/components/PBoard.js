import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import Post from './Post';
import { boardApi } from '../api';
import PageList from './PageList';
import { useUser } from '../context';

const BoardContainer = styled.div`
  width: 750px;
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
`;
const OrderUL = styled.ul`
  display: flex;
  align-items: center;
`;
const OlderLI = styled.div`
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
  padding-left: 10px;
  background-color: #fff;
`;
const SearchInput = styled.input`
  border: none;
  height: 100%;
  outline: none;
  padding: 5px 10px;
`;
const CancelButton = styled.button`
  all: unset;
  width: 20px;
  cursor: pointer;
  margin-right: 2px;
  background: #fff;
  display: ${(props) => (props.text ? 'block' : 'none')};
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

const Board = ({ title }) => {
  const loggedIn = Boolean(useUser());
  const [page, setPage] = useState([1, 2, 3, 4, 5]);
  let type;
  if (title === 'Q&A') type = 'qna';
  if (title === 'Tech') type = 'tech';
  if (title === '자유게시판') type = 'free';

  const history = useHistory();
  const [order, setOrder] = useState({
    latest: true,
    views: false,
    comments: false,
    likes: false,
  });
  const { latest, views, comments, likes } = order;
  const [state, setState] = useState({
    loading: true,
    totalPage: null,
    currentPage: null,
    posts: [],
    err: null,
  });
  const { loading, totalPage, currentPage, posts } = state;
  const [index, setIndex] = useState('0');
  const [text, setText] = useState('');

  const fetchPosts = async (num, sort = 'createdDate') => {
    try {
      const response = await boardApi.getPosts(num, sort, type);
      console.log(
        `Board getPosts res num: ${num}, sort: ${sort}, type: ${type} ->`,
        response.data
      );
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
    console.log('Board useEffect');
    fetchPosts(1);
  }, []);

  const filterPost = (text) => {
    // text:true, all:false
    if (order[text]) return;
    // setOrder(order.map(item => {item}))
    if (text === 'latest') {
      setOrder({
        ...order,
        latest: true,
        views: false,
        comments: false,
        likes: false,
      });
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1, 'createdDate', type);
    }
    if (text === 'views') {
      setOrder({
        ...order,
        latest: false,
        views: true,
        comments: false,
        likes: false,
      });
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1, 'views', type);
    }
    if (text === 'comments') {
      setOrder({
        ...order,
        latest: false,
        views: false,
        comments: true,
        likes: false,
      });
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1, 'commentSize', type);
    }
    if (text === 'likes') {
      setOrder({
        ...order,
        latest: false,
        views: false,
        comments: false,
        likes: true,
      });
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1, 'likes', type);
    }
  };

  const cancelText = () => {
    console.log('CANCELtEXT');
    setText('');
    fetchPosts(1, 'createdDate', type);
  };

  const searchKeword = async (e) => {
    console.log('SEARCHkEWORD');
    e.preventDefault();
    try {
      const response = await boardApi.searchPosts(text, 1);
      console.log(`Board searchPosts res text: ${text} ->`, response.data);
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
        <OrderUL>
          <OlderLI active={latest} onClick={() => filterPost('latest')}>
            최신순
          </OlderLI>
          <OlderLI active={views} onClick={() => filterPost('views')}>
            조회순
          </OlderLI>
          <OlderLI active={comments} onClick={() => filterPost('comments')}>
            댓글순
          </OlderLI>
          <OlderLI active={likes} onClick={() => filterPost('likes')}>
            좋아요순
          </OlderLI>
        </OrderUL>

        <SearchForm onSubmit={searchKeword}>
          <SearchSelect onChange={(e) => setIndex(e.target.value)}>
            <option value="0" defaultValue>
              제목
            </option>
            <option value="1">내용</option>
            <option value="2">제목+내용</option>
          </SearchSelect>
          <SearchInput
            value={text}
            minLength="2"
            maxLength="20"
            onChange={(e) => setText(e.target.value)}
          />
          <CancelButton
            type="button"
            text={text.length > 0}
            onClick={cancelText}
          >
            <AiOutlineClose />
          </CancelButton>
          <SearchButton type="submit" onSubmit={searchKeword} className="sbtn">
            <AiOutlineSearch />
          </SearchButton>
        </SearchForm>
      </FilterContainer>

      {!loading ? (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} type={type} fci={posts[0].id} />
          ))}
          {totalPage > 0 ? (
            <PageList
              page={page}
              setPage={setPage}
              fetchContents={fetchPosts}
              totalPage={totalPage}
              currentPage={currentPage}
              sort={
                (latest && 'createdDate') ||
                (views && 'views') ||
                (comments && 'commentSize') ||
                (likes && 'likes')
              }
            />
          ) : (
            <div style={{ marginTop: 150, textAlign: 'center' }}>
              아직 게시물이 없습니다.
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: 100, textAlign: 'center' }}>loading...</div>
      )}
    </BoardContainer>
  );
};

export default Board;
