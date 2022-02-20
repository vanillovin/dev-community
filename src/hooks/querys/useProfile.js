import { useQuery } from 'react-query';

// hooks/query/useBooks.js

// import { useQuery, queryCache } from 'react-query';
// import BookAPI from '../api/books';

// export default function useBooks(authorId) {
//   const queryKey = ['retrieveBooks', { authorId }];
//   return {
//     ...useQuery((queryKey, { authorId }), () => BookAPI.get(authorId)),
//     invalidate: queryCache.invalidateQueries(queryKey),
//   };
// }
