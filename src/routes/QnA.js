import React, { useState } from 'react';
import { Link, Switch, Route, useHistory, useLocation } from 'react-router-dom';
import Board from '../components/Board';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';

const Container = styled.div`
  width: 750px;
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

const QnA = () => {
  const history = useHistory();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState('0');
  const sort = location.state.sort;
  console.log('QnA location', location);

  const onSubmit = (e) => {
    e.preventDefault();
    const cond =
      (index === '0' && 'title') ||
      (index === '1' && 'content') ||
      (index === '2' && 'all');
    if (keyword.trim().length < 2) return;
    history.push({
      pathname: `/board/qna?query=${keyword}&sort=${sort}`,
      state: { type: 'qna', sort, keyword, cond },
    });
  };

  return (
    <Container>
      <Title>Q&A</Title>

      <FilterContainer>
        <OrderList>
          <OrderItem active={sort === 'id'}>
            <Link
              to={{
                pathname: '/board/qna?query=&sort=id',
                state: { type: 'qna', sort: 'id' },
              }}
            >
              최신순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'viewCount'}>
            <Link
              to={{
                pathname: '/board/qna?query=&sort=viewCount',
                state: { type: 'qna', sort: 'viewCount' },
              }}
            >
              조회순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'likeCount'}>
            <Link
              to={{
                pathname: '/board/qna?query=&sort=likeCount',
                state: { type: 'qna', sort: 'likeCount' },
              }}
            >
              좋아요순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'noteCount'}>
            <Link
              to={{
                pathname: '/board/qna?query=&sort=noteCount',
                state: { type: 'qna', sort: 'noteCount' },
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
          <SearchButton type="submit" onClick={onSubmit}>
            <AiOutlineSearch className="sbtn" />
          </SearchButton>
        </SearchForm>
      </FilterContainer>

      <Switch>
        <Route exact path="/board/qna">
          <Board type="qna" />
        </Route>
        <Route exact path="/board/qna?*">
          <Board type="qna" />
        </Route>
      </Switch>
    </Container>
  );
};

export default QnA;
