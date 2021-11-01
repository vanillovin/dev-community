import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineLike } from 'react-icons/ai';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useUser } from '../context';

const Container = styled.div`
  padding: 10px;
  border-bottom: 1px solid lightgray;
  white-space: pre-line;
  overflow-wrap: break-word;
`;
const Content = styled.div`
  width: 100%;
  padding: 10px 0 12px 0;
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-wrap: break-word;
`;
const LikeContainer = styled.div`
  width: 100%;
`;
const LikeButton = styled.div`
  background-color: #fff;
  color: #495057;
  display: flex;
  align-items: center;
  cursor: pointer;
  display: flex;
  & > div {
    font-size: 14px;
    margin-left: 5px;
  }
  &:hover {
    color: #adb5bd;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled(LikeButton)`
  color: #868e96;
  font-size: 15px;
  &:first-child {
    margin-right: 15px;
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
`;
const EditButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  &:first-child {
    background: #e9ecef;
    :hover {
      background: #ced4da;
    }
  }
  &:last-child {
    background: #bac8ff;
    :hover {
      background: #91a7ff;
    }
  }
`;

const Comment = ({ cmt, delComment, fixComment }) => {
  console.log('Comment', cmt);

  const user = useUser();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(cmt.content);

  const onChagne = (e) => setText(e.target.value);

  return (
    <>
      <Container>
        <div>
          <div
            style={{
              height: 25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 15, marginRight: 5 }}>
              <span style={{ fontSize: 14, marginRight: 5, color: '#5c7cfa' }}>
                {cmt.author}
              </span>
              <span style={{ color: 'gray', fontSize: 12 }}>
                {cmt.createdDate &&
                  `${cmt.createdDate.split('T')[0]} ${cmt.createdDate
                    .split('T')[1]
                    .substring(0, 8)} 작성`}
              </span>
              <span style={{ color: 'gray', fontSize: 12 }}>
                {cmt.createdDate &&
                  cmt.lastModifiedDate &&
                  (cmt.createdDate === cmt.lastModifiedDate
                    ? ''
                    : ` ∙ ${
                        cmt.lastModifiedDate.split('T')[0]
                      } ${cmt.lastModifiedDate
                        .split('T')[1]
                        .substring(0, 8)} 수정`)}
              </span>
            </div>
            {user && cmt.memberId === user.id && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ButtonContainer>
                  <Button>
                    <FiEdit onClick={() => setEdit(!edit)} />
                  </Button>
                  <Button>
                    <FiTrash onClick={() => delComment(cmt.id)} />
                  </Button>
                </ButtonContainer>
              </div>
            )}
          </div>
        </div>

        {!edit ? (
          <>
            <Content>{cmt.content}</Content>
            <LikeContainer>
              <LikeButton>
                <AiOutlineLike />
                <div style={{ marginLeft: 5 }}>{cmt.likes}</div>
              </LikeButton>
            </LikeContainer>
          </>
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
