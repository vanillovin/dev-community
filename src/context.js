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
      const response = await memberApi.user(userLS.memberId);
      setState({
        ...state,
        loading: false,
        t: userLS.token,
        user: response.data,
        error: null,
      });
    } catch (err) {
      console.log(err, err.response.data);
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
  }, []);

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
