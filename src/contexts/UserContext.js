import React, { createContext, useContext, useState, useEffect } from 'react';

import memberApi from '../apis/memberApi';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [state, setState] = useState({
    isLoading: true,
    t: null,
    user: null,
    isError: null,
  });

  const userLS = JSON.parse(localStorage.getItem('user'));
  console.log('context userLS', userLS);

  const getUser = async () => {
    if (!userLS) return;

    const expireDate = new Date(userLS.expireDate);
    const now = new Date();
    if (expireDate.getTime() < now.getTime()) {
      localStorage.removeItem('user');
      return;
    }

    try {
      const { data } = await memberApi.getUser(userLS.memberId);
      console.log('context getUser => res.data', data);
      setState({
        ...state,
        isLoading: false,
        t: userLS.token,
        user: { id: userLS.memberId, ...data },
        isError: null,
      });
    } catch (err) {
      console.log('context getUser => err', err);
      // localStorage.removeItem('user');
      // 로그인페이지이동
      setState({
        ...state,
        isLoading: false,
        user: null,
        isError: err,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ state, setState }}>
      {children}
    </UserContext.Provider>
  );
}

export function useS() {
  const { state } = useContext(UserContext);
  return state;
}

export function useT() {
  const {
    state: { t },
  } = useContext(UserContext);
  return t;
}

export function useUser() {
  const {
    state: { user },
  } = useContext(UserContext);
  return user;
}

export function useSetUser() {
  const { setState } = useContext(UserContext);
  return setState;
}
