import React, { useState, createRef, useEffect } from 'react';
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
  width: 750px;
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
  margin-bottom: 6px;
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

// Viewer 사용
function PostView() {
  return <Viewer plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]} />;
}

// Editor 사용
const Write = ({
  match,
  location: {
    state: { type: bType },
  },
}) => {
  //   console.log(match, bType);
  const t = useT();
  const history = useHistory();
  const loggedIn = Boolean(useUser());

  const [state, setState] = useState({
    type: bType,
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
    // e.preventDefault();
    const content = editorRef.current.getInstance().getMarkdown();
    console.log('Write onSubmit', type, title, content, content.length);

    // if (type === '') {
    //   alert('게시판을 선택해 주세요');
    //   return;
    // }
    // if (title.trim() === '' || title.trim().length < 2) {
    //   alert('제목은 2자 이상 입력해 주세요');
    //   return;
    // }
    const instance = editorRef.current.getInstance();
    const data = instance.getMarkdown();

    if (!data) {
      // ...
      instance.focus(); // ERROR
    }

    // if (content.trim().length < 4) {
    //   // byte
    //   alert('내용은 4자 이상 입력해 주세요');
    //   return;
    // }

    // const data = {
    //   title,
    //   content: editorRef.current.getInstance().getMarkdown(),
    // };

    // const ok = window.confirm('게시물을 등록하시겠습니까?');
    // ok &&
    //   boardApi
    //     .sendPost(type, data, t)
    //     .then((res) => {
    //       console.log('sendPost res =>', res);
    //       const id = res.data.id;
    //       history.push(`/board/${type}/${id}`);
    //     })
    //     .catch((err) => {
    //       console.log('sendPost err =>', err || err.response?.status);
    //       // localStorage.removeItem('user');
    //       // window.location.href = '/'
    //     });
  };

  const cancelWrite = () => {
    const ok = window.confirm('취소하시겠습니까?');
    ok && history.goBack(); // 뒤로이동
  };

  let typeText;
  if (type === 'qna') typeText = 'Q&A';
  if (type === 'tech') typeText = 'Tech';
  if (type === 'free') typeText = '자유게시판';

  const editorRef = createRef();

  const onChangeEditorTextHandler = () => {
    console.log(editorRef.current.getInstance().getMarkdown());
    // console.log(editorRef.current);
  };

  useEffect(() => {
    console.log(editorRef.current.getInstance());
    console.log(editorRef.current.getInstance());
    editorRef.current.getInstance().focus();
    // console.log(editorRef.current.getInstance().getCurrentModeEditor().focus);
  }, []);

  return (
    <>
      {loggedIn ? (
        <Container>
          <Title>새 글 쓰기</Title>
          <Select name="type" required onChange={onChange}>
            <option value={type} defaultChecked>
              {typeText || '게시판 선택'}
            </option>
            <option value="qna">QnA</option>
            <option value="tech">Tech</option>
            <option value="free">자유게시판</option>
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
              initialValue="마크다운으로 내용을 입력하세요."
              previewStyle="vertical"
              initalEditType="markdown"
              plugins={[
                colorSyntax,
                [codeSyntaxHighlight, { highlighter: Prism }],
              ]}
              ref={editorRef}
              onChange={onChangeEditorTextHandler}
              height="600px"
              useCommandShortcut={true}
            />
          </EditorContainer>

          <ButtonContainer>
            <Button onClick={cancelWrite}>취소하기</Button>
            <Button type="submit" onClick={onSubmit}>
              등록하기
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
};

export default withRouter(Write);
