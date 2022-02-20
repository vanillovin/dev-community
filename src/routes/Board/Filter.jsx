import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import * as S from './style';

const Filter = ({
  sort,
  handleOrderListClick,
  handleSearch,
  keyword,
  handleCancelSearch,
}) => {
  return (
    <S.FilterContainer>
      <S.OrderList>
        {[
          ['최신순', 'createdDate'],
          ['조회순', 'views'],
          ['댓글순', 'commentSize'],
          ['좋아요순', 'likes'],
        ].map(([text, name]) => (
          <S.OrderItem
            key={name}
            onClick={() => handleOrderListClick(name)}
            active={sort === name}
          >
            {text}
          </S.OrderItem>
        ))}
      </S.OrderList>

      <S.SearchForm onSubmit={handleSearch}>
        <S.SearchSelect id="searchSelect">
          <option value="title" defaultValue>
            제목
          </option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </S.SearchSelect>

        <S.SearchInput id="searchInput" minLength="2" maxLength="20" />

        <S.SearchButton type="submit">
          <AiOutlineSearch className="sbtn" />
        </S.SearchButton>

        {keyword !== '' && (
          <S.CancelButton type="button" onClick={handleCancelSearch}>
            <div className="cbtn">
              <MdCancel /> clear
            </div>
          </S.CancelButton>
        )}
      </S.SearchForm>
    </S.FilterContainer>
  );
};

export default Filter;
