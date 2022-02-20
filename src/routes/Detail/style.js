import styled from 'styled-components';

export const DetailContainer = styled.div`
  width: 750px;
  min-width: 750px;
`;
export const Header = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgray;
  .top {
    /* border: 1px solid black; */
    height: 25px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;
  }
  .id {
    color: gray;
  }
  .top-right {
    display: flex;
    align-items: center;
  }
  .icon {
    color: gray;
    font-size: 14px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    span {
      margin-left: 3px;
      margin-right: 1px;
    }
  }
  .author {
    color: #5c7cfa;
    cursor: pointer;
    font-size: 14px;
    margin-right: 5px;
    :hover {
      text-decoration: underline;
    }
  }
  .date {
    color: gray;
    font-size: 11px;
  }
`;
export const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  div {
    border-radius: 2px;
    border: 1px solid lightgray;
  }
  .setbtn {
    color: #495057;
    font-size: 20px;
    cursor: pointer;
    margin-left: 6px;
    :hover {
      color: #adb5bd;
    }
  }
`;
export const SettingButton = styled.button`
  user-select: none;
  color: #495057;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  background-color: transparent;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  &:hover {
    background-color: #f1f3f5;
  }
  &:nth-child(1) {
    border-left: 1px solid lightgray;
    border-radius: 2px 0 0 2px;
  }
  &:nth-child(2) {
    border-radius: 0 2px 2px 0;
  }
`;
export const Title = styled.div`
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 5px;
`;
export const Content = styled.div`
  /* 상속 */
  ol,
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-inline-start: 30px;
  }
  img {
    width: 100%;
    margin: 5px 0;
  }
  a {
    color: #364fc7;
    &:hover {
      text-decoration: underline;
    }
  }
  blockquote {
    margin: 1.4rem 6px;
    border-left: 5px solid #bac8ff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: rgb(250, 250, 250);
    padding: 5px 5px 5px 15px;
    color: rgb(33, 37, 41);
    a {
      /* &:after {
        content: ']';
      } */
    }
  }
  pre {
    font-family: 'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
      'Courier New', monospace;
    padding: 10px;
    line-height: 1.4;
    font-size: 0.875rem;
    overflow-x: auto;
    letter-spacing: 0px;
    background: rgb(249, 249, 250);
  }

  table {
    /* border: 1px solid rgba(0, 0, 0, 0.1) */
    margin: 12px 0 14px;
    color: #222;
    width: auto;
    border-collapse: collapse;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  table th {
    background-color: #666;
    font-weight: 300;
    color: #fff;
    padding-top: 6px;
  }
  table th,
  table td {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 6px 14px 5px 12px;
    height: 32px;
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th {
    display: table-cell;
    vertical-align: inherit;
    font-weight: bold;
    text-align: -internal-center;
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  td {
    display: table-cell;
    vertical-align: inherit;
  }

  width: 100%;
  min-height: 70px;
  padding: 10px;
  overflow-wrap: break-word;
`;
export const LikeContainer = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const LikeButton = styled.button`
  all: unset;
  color: #495057;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  align-items: center;
  & > div {
    margin-left: 5px;
    font-size: 16px;
  }
  &:hover {
    color: #adb5bd;
  }
`;
export const CommentContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  background: white;
  /* border-radius: 2px; */
  border: 1px solid lightgray;
  /* box-shadow: 0 1px 8px 0px rgba(0, 0, 0, 0.1); */
`;
export const CommentForm = styled.form`
  width: 100%;
  height: 80px;
  display: flex;
`;
export const CommentInput = styled.textarea`
  width: 80%;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
`;
export const CommentButton = styled.button`
  width: 20%;
  height: 100%;
  border: none;
  font-size: 14px;
  border-left: 1px solid lightgray;
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
export const BookMark = styled.div`
  cursor: pointer;
  margin-left: 40px;
  color: #91a7ff;
  font-size: 20px;
  &:active {
    color: #dbe4ff;
  }
`;
