import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Header from './Header';
import Home from '../routes/Home';
import Login from '../routes/Login';
import Signup from '../routes/Signup';
import QnA from '../routes/QnA';
import Tech from '../routes/Tech';
import Free from '../routes/Free';
import Profile from '../routes/Profile';
import Editor from './Editor';
import Detail from '../routes/Detail';
import BoardTest from './BoardTest';

const Router = () => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/board/qna" component={QnA} />
          <Route exact path="/board/tech" component={Tech} />
          <Route exact path="/board/free" component={Free} />
          <Route exact path="/write" component={Editor} />
          <Route exact path="/board/:type/:id" component={Detail} />
          <Redirect from="*" to="/" />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default Router;
