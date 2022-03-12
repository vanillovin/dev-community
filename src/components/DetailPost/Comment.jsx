import React, { useState } from 'react';
import {
  AiOutlineLike,
  AiOutlineCheck,
  AiOutlineComment,
} from 'react-icons/ai';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useUser } from '../../contexts/UserContext';
import dateFormatter from '../../utils/dateFormatter';

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled.div`
  padding: 10px;
  border-bottom: 1px solid lightgray;
  white-space: pre-line;
  overflow-wrap: break-word;
  .author {
    cursor: pointer;
    color: #5c7cfa;
    font-size: 14px;
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
  line-height: 1;
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
const CommentContent = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-wrap: break-word;
  padding: 14px 10px 10px 4px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  color: #868e96;
  & + & {
    margin-left: 15px;
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
  isSelected,
  isPostUser,
  handleDeleteComment,
  handleFixComment,
  handleLikeComment,
  handleSelectComment,
}) => {
  const user = useUser();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(cmt.content);
  const [textInput, setTextInput] = useState(cmt.content);
  const isCommentUser = +cmt.memberId === +user?.id;

  return (
    <>
      <Container>
        <div>
          <Top>
            <ButtonContainer>
              {isSelected ? (
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
                  {isPostUser && (
                    <SButton
                      title="댓글 채택"
                      some={!isSelected}
                      onClick={() => handleSelectComment(cmt.id)}
                    >
                      <AiOutlineCheck />
                    </SButton>
                  )}
                  {!isPostUser && (
                    <SButton>
                      <AiOutlineComment />
                    </SButton>
                  )}
                </>
              )}
              <div>
                <Link
                  className="author"
                  to={{
                    pathname: `/user/info/${cmt.memberId}`,
                    state: { memberId: cmt.memberId },
                  }}
                >
                  {cmt.author}
                </Link>
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
              <Button
                onClick={() => handleLikeComment(cmt.id)}
                title="댓글 좋아요"
              >
                <AiOutlineLike />
                <span style={{ marginLeft: 4 }}>{cmt.likes}</span>
              </Button>
              {isCommentUser && (
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
                          : handleDeleteComment(cmt.id);
                      }}
                    />
                  </Button>
                </>
              )}
            </ButtonContainer>
          </Top>
        </div>

        {!edit ? (
          <CommentContent>{cmt.content}</CommentContent>
        ) : (
          <EditForm>
            <EditInput
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <EditButtonContainer>
              <EditButton onClick={() => setEdit(false)}>취소</EditButton>
              <EditButton
                onClick={() => {
                  handleFixComment(cmt.id, textInput, setText);
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
