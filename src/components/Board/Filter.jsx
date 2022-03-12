import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import styled from 'styled-components';
import { customMedia } from '../../commons/styles/GlobalStyles';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
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
  margin-right: 20px;
  font-weight: bold;
  color: ${(props) => props.active && '#000'};
  &:hover {
    text-decoration: underline;
  }
  ${customMedia.lessThan('tablet')`
    font-size: 13px;
    margin-right: 15px;
  `}
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
  ${customMedia.lessThan('tablet')`
    height: 25px;
  `}
`;
const SearchSelect = styled.select`
  color: #495057;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 6px 0 8px;
  background-color: #fff;
  ${customMedia.lessThan('tablet')`
    padding: 0 0 0 6px;
  `}
`;
const SearchInput = styled.input`
  width: 220px;
  border: none;
  height: 100%;
  outline: none;
  padding: 5px 10px;
  ${customMedia.lessThan('tablet')`
    width: 180px;
    padding: 0 9px;
  `}
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

const Filter = ({
  sort,
  handleOrderListClick,
  handleSearch,
  keyword,
  handleCancelSearch,
}) => {
  return (
    <FilterContainer>
      <OrderList>
        {[
          ['최신순', 'createdDate'],
          ['조회순', 'views'],
          ['댓글순', 'commentSize'],
          ['좋아요순', 'likes'],
        ].map(([text, name]) => (
          <OrderItem
            key={name}
            onClick={() => handleOrderListClick(name)}
            active={sort === name}
          >
            {text}
          </OrderItem>
        ))}
      </OrderList>

      <SearchForm onSubmit={handleSearch}>
        <SearchSelect id="searchSelect">
          <option value="title" defaultValue>
            제목
          </option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </SearchSelect>

        <SearchInput id="searchInput" minLength="2" maxLength="20" />

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
  );
};

export default Filter;
