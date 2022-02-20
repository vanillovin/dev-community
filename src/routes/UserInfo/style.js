import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 750px;
  ul,
  li {
    list-style: none;
  }
`;
export const UserInfo = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  background-color: #fff;
  border: 1px solid lightgray;
`;
export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Middle = styled.div`
  color: #adb5bd;
  font-size: 12px;
  margin: 5px 0 10px 1px;
`;
export const Bottom = styled.div`
  display: flex;
  div {
    :first-child {
      margin-left: -19px;
    }
    width: 100px;
    color: #868e96;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 10px;
  }
  .num {
    margin-top: 5px;
    font-size: 20px;
    color: royalblue;
    font-weight: bold;
  }
`;

export const Image = styled.div`
  width: 150px;
  height: 150px;
  font-size: 25px;
  letter-spacing: 2px;
  margin-right: 30px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #dee2e6;
`;
export const Info = styled.div`
  flex: 1;
`;
export const UserActivity = styled.div`
  width: 100%;
  display: flex;
`;
export const Activity = styled.div`
  width: 85%;
  margin-right: 20px;
`;
export const ToggleList = styled.ul`
  margin: 0;
  padding: 0;
  width: 15%;
`;
export const Item = styled.li`
  list-style: none;
  padding: 6px 14px;
  cursor: pointer;
  &:hover {
    background-color: #e9ecef;
  }
  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      border-left: 3px solid #adb5bd;
    `}
`;
export const Button = styled.button`
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
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
