import React, { useState, createRef } from 'react';
import { Redirect, useHistory, withRouter } from 'react-router';
import styled from 'styled-components';
import { useT, useUser } from '../context';
import { boardApi } from '../api';

import Prism from 'prismjs';
// 여기 css를 수정해서 코드 하이라이팅 커스텀 가능
import 'prismjs/themes/prism.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const Container = styled.div`
  width: 700px;
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
const EditorContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  background-color: white;
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

const EditPost = withRouter(({ history: h }) => {
  console.log('EditPost history', h);

  const editorRef = createRef();

  const {
    location: {
      state: { type: preType, id, title: preTitle, content: preContent },
    },
  } = h;
  console.log('Editor component', preType, preTitle, preContent);
  const t = useT();
  const history = useHistory();
  const loggedIn = Boolean(useUser());

  let typeText;
  if (preType === 'qna') typeText = 'Q&A';
  if (preType === 'tech') typeText = 'Tech';
  if (preType === 'free') typeText = '자유게시판';

  const [state, setState] = useState({
    type: preType,
    title: preTitle,
    content: preContent,
  });
  const { type, title, content } = state;

  const onChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSave = () => {
    console.log(title, content);

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
    const ok = window.confirm('게시물을 수정하시겠습니까?');
    ok &&
      boardApi
        .fixPost(id, data, t)
        .then((res) => {
          console.log('fixPost res', res);
          // window.location.href = `/board/${type}/${id}`;
          history.push(`/board/${type}/${id}`);
        })
        .catch((err) => {
          console.log('fixPost err', err || err.response.data);
        });
  };

  const cancelWrite = () => {
    const ok = window.confirm('취소하시겠습니까?');
    ok && history.goBack(); // 뒤로이동
  };

  return (
    <>
      {loggedIn ? (
        <Container>
          <Select name="type" required onChange={onChange} disabled>
            <option value={type} defaultChecked>
              {typeText}
            </option>
          </Select>
          <TitleInput
            placeholder="제목을 입력해 주세요"
            name="title"
            value={title}
            onChange={onChange}
            maxLength="50"
            required
          />
          <EditorContainer>
            <Editor
              id="editor-input"
              initialValue={preContent}
              previewStyle="vertical"
              initalEditType="markdown"
              plugins={[
                colorSyntax,
                [codeSyntaxHighlight, { highlighter: Prism }],
              ]}
              ref={editorRef}
              // onChange={onChangeEditorTextHandler}
              height="600px"
              useCommandShortcut={true}
            />
          </EditorContainer>
          <ButtonContainer>
            <Button onClick={cancelWrite}>취소하기</Button>
            <Button type="submit" onClick={onSave}>
              저장하기
            </Button>
          </ButtonContainer>
        </Container>
      ) : (
        <>
          <div>작성권한없음</div>
          <Redirect to="/" />
        </>
      )}
    </>
  );
});

export default EditPost;
