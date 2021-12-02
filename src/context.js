import React, { createContext, useContext, useState, useEffect } from 'react';
import { memberApi } from './api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    t: null,
    user: null,
    error: null,
  });
  const userLS = JSON.parse(localStorage.getItem('user'));

  const getUser = async () => {
    if (!userLS) return;
    try {
      const { data } = await memberApi.getUser(userLS.memberId);
      console.log('context getUser res.data', data);
      setState({
        ...state,
        loading: false,
        t: userLS.token,
        user: { id: userLS.memberId, data },
        error: null,
      });
    } catch (err) {
      console.log('context getUser err', err);
      localStorage.removeItem('user');
      // 로그인페이지이동
      setState({
        ...state,
        loading: false,
        user: null,
        error: err,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ state }}>{children}</UserContext.Provider>
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
