import { useQuery } from 'react-query';
import boardApi from '../apis/boardApi';

const getDetailPost = async (postId) => {
  const { data } = await boardApi.getPost(postId);
  return data;
};

export function useDetailPost(postId) {
  return useQuery(['Detail', postId], () => getDetailPost(postId), {
    retry: 5,
    staleTime: 5 * 60 * 1000,
  });
}

// const sendComment = ({ postId, data, t }) =>
//   commentApi.sendComment(postId, data, t);

// export function useSendComment() {
//   const queryClient = useQueryClient();
//   // mutate에 넘겨준 매개변수가옴. 서버에서온게data, context는
//   return useMutation(sendComment, {
//     onSuccess: (data, variables, context) => {
//       console.log('useSendComment success', data, variables);
//       // queryClient.invalidateQueries(['Detail', data.boardId]);
//       // variables.clear();
//     },
//     onError: (err, variables, context) => {
//       console.log('useSendComment error', err, variables);
//     },
//   });
// }

// const deleteComment = ({ postId, commentId, t }) => {
//   return commentApi.deleteComment(postId, commentId, t);
// };

// export function useDeleteComment() {
//   return useMutation(deleteComment);
// }
