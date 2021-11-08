import React, { useState } from 'react';
import styled from 'styled-components';

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
  :hover {
    background-color: ${(props) => !props.active && '#dbe4ff'};
  }
`;

const PageList = ({ fetchContents, totalPage, currentPage }) => {
  const [page, setPage] = useState([1, 2, 3, 4, 5]);

  const test = (e) => {
    const pNum = e.target.innerText;
    const cName = e.target.className;

    if (pNum === '') return;
    if (currentPage === +pNum) return;
    if (cName.includes('prev')) {
      if (page[0] !== 1) {
        setPage(page.map((num) => num - 5));
        fetchContents(page[0] - 5);
      }
      return;
    }
    if (cName.includes('next')) {
      if (page[page.length - 1] >= totalPage) return;
      setPage(page.map((num) => num + 5));
      fetchContents(page[0] + 5);
      return;
    }
    if (cName.includes('first')) {
      if (currentPage === 1) return;
      setPage([1, 2, 3, 4, 5]);
      fetchContents(1);
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
      fetchContents(totalPage);
      return;
    }

    fetchContents(pNum);
  };

  return totalPage > 0 ? (
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
  ) : (
    <div style={{ marginTop: 150, textAlign: 'center' }}>
      아직 게시물이 없습니다.
    </div>
  );
};

export default PageList;
