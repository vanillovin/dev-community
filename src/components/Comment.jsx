import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AiOutlineLike,
  AiOutlineCheck,
  AiOutlineComment,
} from 'react-icons/ai';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useUser } from '../context';
import { useHistory } from 'react-router';
import dateFormatter from '../dateFormatter';

const Container = styled.div`
  padding: 10px;
  border-bottom: 1px solid lightgray;
  white-space: pre-line;
  overflow-wrap: break-word;

  .author {
    cursor: pointer;
    color: #5c7cfa;
    font-size: 14px;
    margin-right: 5px;
    :hover {
      text-decoration: underline;
    }
  }
  .date {
    color: gray;
    font-size: 10px;
  }
`;
const Top = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: orange,
`;
const SButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: 6px;
  border-radius: 50%;
  background-color: #edf2ff;
  border: 1px solid #f1f3f5;
  cursor: ${(props) => props.some && 'pointer'};
  color: ${(props) => props.selected && '#fff'};
  background-color: ${(props) => (props.selected ? '#94d82d' : '#edf2ff')};
  &:hover {
    color: ${(props) => props.some && '#fff'};
    background-color: ${(props) => props.some && '#94d82d'};
  }
`;
const Content = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-wrap: break-word;
  padding: 14px 10px 10px 4px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #495057;
  cursor: pointer;
  &:hover {
    color: #adb5bd;
  }
  color: #868e96;
  & + & {
    margin-left: 20px;
  }
`;
const EditForm = styled.div`
  width: 100%;
  display: flex;
  margin: 8px 0;
  border: 1px solid lightgray;
`;
const EditInput = styled.textarea`
  width: 90%;
  height: 85px;
  resize: none;
  padding: 8px;
  border: none;
  outline: none;
`;
const EditButtonContainer = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  border-left: 1px solid lightgray;
`;
const EditButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  &:first-child {
    background: #f1f3f5;
    border-bottom: 1px solid lightgray;
    :hover {
      background: #dee2e6;
    }
  }
  &:last-child {
    background: #bac8ff;
    :hover {
      background: #91a7ff;
    }
  }
`;

const Comment = ({
  cmt,
  some,
  author,
  delComment,
  fixComment,
  likeComment,
  selectComment,
}) => {
  console.log('Comment', author, cmt);
  const history = useHistory();
  const user = useUser();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(cmt.content);

  const onChagne = (e) => setText(e.target.value);

  return (
    <>
      <Container>
        <div>
          <Top>
            <ButtonContainer>
              {some ? (
                cmt.selected ? (
                  <SButton selected={cmt.selected} title="채택된 댓글">
                    <AiOutlineCheck />
                  </SButton>
                ) : (
                  <SButton selected={cmt.selected}>
                    <AiOutlineComment />
                  </SButton>
                )
              ) : (
                <>
                  {author && (
                    <SButton
                      title="댓글 채택"
                      some={!some}
                      onClick={() => selectComment(cmt.id)}
                    >
                      <AiOutlineCheck />
                    </SButton>
                  )}
                  {!author && (
                    <SButton>
                      <AiOutlineComment />
                    </SButton>
                  )}
                </>
              )}
              <div>
                <div
                  className="author"
                  onClick={() =>
                    history.push({
                      pathname: `/user/info/${cmt.memberId}`,
                      state: {
                        memberId: cmt.memberId,
                      },
                    })
                  }
                >
                  {cmt.author}
                </div>
                <div>
                  <span className="date">
                    {cmt.createdDate &&
                      dateFormatter(cmt.createdDate, 'created', '작성')}
                  </span>
                  <span className="date">
                    {cmt.createdDate &&
                      cmt.lastModifiedDate &&
                      cmt.createdDate !== cmt.lastModifiedDate &&
                      dateFormatter(cmt.lastModifiedDate, 'modified', '수정')}
                  </span>
                </div>
              </div>
            </ButtonContainer>

            <ButtonContainer>
              <Button onClick={() => likeComment(cmt.id)} title="댓글 좋아요">
                <AiOutlineLike />
                <span style={{ marginLeft: 4 }}>{cmt.likes}</span>
              </Button>
              {user && cmt.memberId === user.id && (
                <>
                  <Button title="댓글 수정">
                    <FiEdit
                      onClick={() => {
                        cmt.selected
                          ? alert('채택된 댓글은 수정할 수 없습니다.')
                          : setEdit(!edit);
                      }}
                    />
                  </Button>
                  <Button title="댓글 삭제">
                    <FiTrash
                      onClick={() => {
                        cmt.selected
                          ? alert('채택된 댓글은 삭제할 수 없습니다.')
                          : delComment(cmt.id);
                      }}
                    />
                  </Button>
                </>
              )}
            </ButtonContainer>
          </Top>
        </div>

        {!edit ? (
          <Content>{cmt.content}</Content>
        ) : (
          <EditForm>
            <EditInput value={text} onChange={onChagne} />
            <EditButtonContainer>
              <EditButton onClick={() => setEdit(false)}>취소</EditButton>
              <EditButton
                onClick={() => {
                  fixComment(cmt.id, text);
                  setEdit(false);
                }}
              >
                저장
              </EditButton>
            </EditButtonContainer>
          </EditForm>
        )}
      </Container>
    </>
  );
};

export default Comment;
