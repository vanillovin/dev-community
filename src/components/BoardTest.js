import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router';
import { AiOutlineSearch } from 'react-icons/ai';
import Post from './Post';
import { boardApi } from '../api';

const BoardContainer = styled.div`
  width: 750px;
  min-width: 750px;
`;
const Button = styled.button`
  border: none;
  width: 80px;
  height: 100%;
  cursor: pointer;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
`;
const PageContainer = styled.div`
  margin: 20px 0 60px 0;
  font-size: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid black; */
`;
const PageUL = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgray;
`;
const PageLI = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 28px;
  height: 28px;
  :not(:last-child) {
    border-right: 1px solid lightgray;
  }
  background-color: ${(props) => props.active && '#bac8ff'};
`;

const BoardTest = ({ title, loggedIn }) => {
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    totalPage: null,
    currentPage: null,
    posts: [],
    err: null,
  });
  const [page, setPage] = useState([1, 2, 3, 4, 5]);
  const { loading, totalPage, currentPage, posts, err } = state;

  const fetchPosts = async (num) => {
    try {
      const response = await boardApi.getPosts(num, 'qna');
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
    // console.log(`< page:${page} / total:${totalPage}`);
    const lIdx = page.length - 1;
    const pNum = e.target.innerText;
    const cName = e.target.className;
    if (pNum === '') return;
    if (cName.includes('prev')) {
      if (page[0] !== 1) setPage(page.map((num) => num - 5));
      return;
    }
    if (cName.includes('next')) {
      if (page[lIdx] > totalPage) return;
      setPage(page.map((num) => num + 5));
      return;
    }
    if (cName.includes('first')) {
      setPage([1, 2, 3, 4, 5]);
      fetchPosts(1);
      return;
    }
    if (cName.includes('last')) {
      // 현재 page가 last면 요청 x & state 구간 변경
      // page[0] < totalPage < page[lIdx]  ? page[lIdx] / 5

      let x = totalPage;
      if (totalPage % 5 === 1) x += 4;
      if (totalPage % 5 === 2) x += 3;
      if (totalPage % 5 === 3) x += 2;
      if (totalPage % 5 === 4) x += 1;

      setPage(page.map((num) => num + 5 * (x / 5 - 1)));
      fetchPosts(totalPage);
      return;
    }
    fetchPosts(pNum);
  };

  return (
    <BoardContainer>
      <PageContainer>
        <PageUL onClick={test}>
          <PageLI className="first">&laquo;</PageLI>
          <PageLI className="prev">&#60;</PageLI>
          {page.map((num, i) => (
            <PageLI key={i} active={currentPage === num}>
              {num > totalPage ? '' : num}
            </PageLI>
          ))}
          <PageLI className="next">&#62;</PageLI>
          <PageLI className="last">&raquo;</PageLI>
        </PageUL>
      </PageContainer>

      {!loading ? (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} type="qna" fci={posts[0].id} />
          ))}
        </>
      ) : (
        <div>loading...</div>
      )}
    </BoardContainer>
  );
};

export default BoardTest;
