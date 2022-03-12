import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const PageContainer = styled.div`
  user-select: none;
  margin: 20px 0 60px 0;
  font-size: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ul,
  li {
    padding: 0;
    list-style: none;
  }
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
  /* cursor: ${(props) => (props.cs ? 'not-allowed' : 'pointer')}; */
  width: ${(props) => (props.test ? '0px' : '28px')};
  height: ${(props) => (props.test ? '0px' : '28px')};
  :not(:last-child) {
    border-right: 1px solid lightgray;
    border-right: ${(props) => (props.test ? 'none' : ' 1px solid lightgray')};
  }
  background-color: ${(props) => props.active && '#bac8ff'};
  :hover {
    background-color: ${(props) => !props.active && '#dbe4ff'};
  }
`;

const PageList = ({ currentPageNumber, endPageNumber }) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const pageListState = useMemo(() => {
    const pages = 10;
    let ret = Array.from(
      { length: pages },
      (_, i) => currentPageNumber + i - 2
    ).filter((x) => x > 0 && x <= endPageNumber);
    if (ret.length === pages) return ret;
    if (ret[0] === 1)
      return Array.from(
        { length: Math.min(pages, endPageNumber) },
        (_, i) => i + 1
      );
    return Array.from(
      { length: pages },
      (_, i) => endPageNumber - pages + i + 1
    ).filter((x) => x > 0);
  }, [currentPageNumber, endPageNumber]);

  const goToFirst = () => {
    searchParams.set('page', String(1));
    history.push(history.location.pathname + '?' + searchParams.toString());
  };

  const goToPrev = () => {
    searchParams.set('page', String(Math.max(1, currentPageNumber - 1)));
    history.push(history.location.pathname + '?' + searchParams.toString());
  };

  const goToNumPage = (pNum) => {
    searchParams.set('page', String(pNum));
    history.push(history.location.pathname + '?' + searchParams.toString());
  };

  const goToNext = () => {
    searchParams.set(
      'page',
      String(Math.min(endPageNumber, currentPageNumber + 1))
    );
    history.push(history.location.pathname + '?' + searchParams.toString());
  };

  const goToLast = () => {
    searchParams.set('page', String(endPageNumber));
    history.push(history.location.pathname + '?' + searchParams.toString());
  };

  return (
    <PageContainer>
      <PageUL>
        <PageLI onClick={goToFirst}>&laquo;</PageLI>
        <PageLI onClick={goToPrev}>&lt;</PageLI>
        {pageListState.map((num, i) => (
          <PageLI
            active={num === currentPageNumber}
            onClick={() => goToNumPage(num)}
            key={i}
          >
            {num}
          </PageLI>
        ))}
        <PageLI onClick={goToNext}>&gt;</PageLI>
        <PageLI onClick={goToLast}>&raquo;</PageLI>
      </PageUL>
    </PageContainer>
  );
};

export default PageList;
