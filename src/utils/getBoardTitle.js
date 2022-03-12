export default function getBoardTitle(type, isBoard = false) {
  let title;
  if (type === 'qna') title = 'Q&A';
  if (type === 'tech') title = 'Tech';
  if (type === 'free') {
    title = isBoard ? '자유게시판' : '사는얘기';
  }
  return title;
}
