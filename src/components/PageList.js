import React from 'react';
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
`;
const PageUL = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgray;
  .first {
    font-weight: bold;
  }
  .last {
    font-weight: bold;
  }
`;
const PageLI = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.cs ? 'not-allowed' : 'pointer')};
  width: 28px;
  height: 28px;
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

const PageList = ({
  pageState,
  setPageState,
  totalPages,
  currentPage,
  routeInfo,
  searchKword,
}) => {
  const history = useHistory();
  const { type, sort } = routeInfo;
  console.log(
    `PageList  
pageState: [${pageState}] 
totalPages: ${totalPages}  
currentPage: ${currentPage} 
searchKword: ${searchKword}
routeInfo:`,
    routeInfo
  );

  const onClick = (e) => {
    const pNum = e.target.innerText;
    const cName = e.target.className;
    if (pNum === '') return;
    if (currentPage === +pNum) return;
    if (e.target.tagName === 'UL') return;
    if (cName.includes('prev')) {
      if (pageState[0] !== 1) {
        setPageState(pageState.map((num) => num - 5));
        // fetchContents(pageState[0] - 5);
      }
      return;
    }
    if (cName.includes('next')) {
      if (pageState[pageState.length - 1] >= totalPages) return;
      setPageState(pageState.map((num) => num + 5));
      // fetchContents(pageState[0] + 5);
      return;
    }
    if (cName.includes('first')) {
      if (currentPage === 1) return;
      setPageState([1, 2, 3, 4, 5]);
      // fetchContents(1);
      return;
    }
    if (cName.includes('last')) {
      let x = totalPages;
      if (totalPages % 5 === 1) x += 4;
      if (totalPages % 5 === 2) x += 3;
      if (totalPages % 5 === 3) x += 2;
      if (totalPages % 5 === 4) x += 1;
      if (currentPage === totalPages) return;
      setPageState([1, 2, 3, 4, 5].map((num) => num + 5 * (x / 5 - 1)));
      // fetchContents(totalPages);
      return;
    }
    // fetchContents(pNum);
    history.push({
      pathname: `/board/${type}?sort=${sort}${
        searchKword ? `&searchType=${searchKword}` : ''
      }&page=${pNum}`,
      state: {
        type,
        sort,
        page: pNum,
        cond: searchKword.split('=')[0],
        kword: searchKword.split('=')[1],
      },
    });
  };

  return (
    <PageContainer>
      <PageUL onClick={onClick}>
        <PageLI className="first" title="맨 앞 페이지" cs={currentPage === 1}>
          &laquo;
        </PageLI>
        <PageLI className="prev" title="앞으로 5페이지">
          &#60;
        </PageLI>
        {pageState.map((num, i) => (
          <PageLI
            key={i}
            active={currentPage === num}
            test={num > totalPages && i + 1}
            title={num > totalPages ? '' : num}
          >
            {num > totalPages ? '' : num}
          </PageLI>
        ))}
        <PageLI className="next" name="li" title="뒤로 5페이지">
          &#62;
        </PageLI>
        <PageLI
          className="last"
          title="맨 뒤 페이지"
          cs={currentPage === totalPages}
        >
          &raquo;
        </PageLI>
      </PageUL>
    </PageContainer>
  );
};

export default PageList;
