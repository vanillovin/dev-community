import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import { useT, useUser } from '../context';
import { boardApi } from '../api';

const EditorContainer = styled.div`
  width: 700px;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`;
const Select = styled.select`
  width: 100%;
  padding: 10px;
  outline: none;
  margin-bottom: 5px;
  border: 1px solid lightgray;
`;
const TitleInput = styled.input`
  width: 100%;
  outline: none;
  padding: 10px 10px 10px 12px;
  margin-bottom: 10px;
  border: 1px solid lightgray;
`;
const ContentInput = styled.textarea`
  width: 100%;
  height: 300px;
  outline: none;
  padding: 10px 10px 10px 12px;
  border: 1px solid lightgray;
  resize: none;
  margin-bottom: 10px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Button = styled.button`
  cursor: pointer;
  padding: 10px;
  border: none;
  background-color: #dbe4ff;
  &:hover {
    background-color: #bac8ff;
  }
  &:active {
    background-color: #91a7ff;
  }
  transition: all 0.1s linear;
`;

const Editor = () => {
  const t = useT();
  const history = useHistory();
  const loggedIn = Boolean(useUser());

  const [state, setState] = useState({
    type: '',
    title: '',
    content: '',
  });
  const { type, title, content } = state;

  const onChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    console.log(type, title, content);

    if (type === '') {
      alert('게시판을 선택해 주세요');
      return;
    } else if (title.trim() === '' || title.trim().length < 2) {
      alert('제목은 2자 이상 입력해 주세요');
      return;
    } else if (content.trim().length < 6) {
      // byte
      alert('내용은 6자 이상 입력해 주세요');
      return;
    }

    const data = {
      title,
      content,
    };
    const ok = window.confirm('게시물을 등록하시겠습니까?');
    ok &&
      boardApi
        .sendPost(type, data, t)
        .then((res) => {
          console.log('send pos res', res);
          const id = res.data.id;
          history.push(`/board/${type}/${id}`);
        })
        .catch((err) => {
          console.log('send post err', err || err.response.data);
        });
  };

  const cancelWrite = () => {
    const ok = window.confirm('취소하시겠습니까?');
    ok && history.goBack(); // 뒤로이동
  };

  return (
    <>
      {loggedIn ? (
        <EditorContainer>
          <Title>새 글 쓰기</Title>
          <Select name="type" required onChange={onChange}>
            <option value="" defaultChecked>
              게시판 선택
            </option>
            <option value="qna">QnA</option>
            <option value="tech">Tech</option>
            <option value="free">Free</option>
          </Select>
          <TitleInput
            placeholder="제목을 입력해 주세요"
            name="title"
            value={title}
            onChange={onChange}
            maxLength="50"
            required
          />
          <ContentInput
            name="content"
            value={content}
            onChange={onChange}
            required
          />
          <ButtonContainer>
            <Button onClick={cancelWrite}>취소하기</Button>
            <Button type="submit" onClick={onSubmit}>
              등록하기
            </Button>
          </ButtonContainer>
        </EditorContainer>
      ) : (
        <>
          <div>작성권한없음</div>
          <Redirect to="/" />
        </>
      )}
    </>
  );
};

export default Editor;
