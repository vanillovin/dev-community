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

const Tech = () => {
  const history = useHistory();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState('0');
  const sort = location.state.sort;
  console.log('Tech location', location);

  const onSubmit = (e) => {
    e.preventDefault();
    const cond =
      (index === '0' && 'title') ||
      (index === '1' && 'content') ||
      (index === '2' && 'all');
    history.push({
      pathname: `/board/tech?query=${keyword}&sort=${sort}`,
      state: { type: 'tech', sort, keyword, cond },
    });
  };

  return (
    <Container>
      <Title>Tech</Title>

      <FilterContainer>
        <OrderList>
          <OrderItem active={sort === 'id'}>
            <Link
              to={{
                pathname: '/board/tech?query=&sort=id',
                state: { type: 'tech', sort: 'id' },
              }}
            >
              최신순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'viewCount'}>
            <Link
              to={{
                pathname: '/board/tech?query=&sort=viewCount',
                state: { type: 'tech', sort: 'viewCount' },
              }}
            >
              조회순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'likeCount'}>
            <Link
              to={{
                pathname: '/board/tech?query=&sort=likeCount',
                state: { type: 'tech', sort: 'likeCount' },
              }}
            >
              좋아요순
            </Link>
          </OrderItem>
          <OrderItem active={sort === 'noteCount'}>
            <Link
              to={{
                pathname: '/board/tech?query=&sort=noteCount',
                state: { type: 'tech', sort: 'noteCount' },
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
        <Route exact path="/board/tech">
          <Board type="tech" />
        </Route>
        <Route exact path="/board/tech?*">
          <Board type="tech" />
        </Route>
      </Switch>
    </Container>
  );
};

export default Tech;
