// location 전역상태

// 함수를 만들어서 export
// export const { isLoading, data } = useQuery(
//   [`${boardType}Board`, curPage, sort, searchMode, keyword],
//   async () => {
//     if (!keyword) {
//       return boardApi
//         .getPosts(curPage, sort, boardType)
//         .then((res) => res.data);
//     } else {
//       return boardApi
//         .searchPosts(keyword, curPage, searchMode, boardType)
//         .then((res) => res.data);
//     }
//   }
// );
