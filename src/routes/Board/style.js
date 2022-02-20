import styled from 'styled-components';

export const Container = styled.div`
  width: 750px;
  ul,
  li {
    list-style: none;
    padding: 0 0 0 1px;
  }
`;
export const Header = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0 30px 0;
`;
export const Button = styled.button`
  width: 80px;
  height: 100%;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
  .link {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;
export const OrderList = styled.ul`
  display: flex;
  align-items: center;
`;
export const OrderItem = styled.li`
  color: gray;
  padding: 2px 1px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 18px;
  font-weight: bold;
  color: ${(props) => props.active && '#000'};
`;
export const SearchForm = styled.form`
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
`;
export const SearchSelect = styled.select`
  color: #495057;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 6px 0 8px;
  background-color: #fff;
`;
export const SearchInput = styled.input`
  border: none;
  height: 100%;
  outline: none;
  padding: 5px 10px;
`;
export const SearchButton = styled.button`
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
export const CancelButton = styled.button`
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
