import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from '../routes/Home';
import Login from '../routes/Login';
import Signup from '../routes/Signup';
import UserInfo from '../routes/UserInfo';
import Write from '../routes/Write';
import EditPost from '../routes/EditPost';
import Detail from '../routes/Detail';
import Board from '../routes/Board';

const Router = () => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/user/info/:id" component={UserInfo} />
          <Route exact path="/user/info/:id/*" component={UserInfo} />

          <Route exact path="/board/qna" component={Board} />
          <Route exact path="/board/tech" component={Board} />
          <Route exact path="/board/free" component={Board} />

          <Route exact path="/write" component={Write} />
          <Route exact path="/edit" component={EditPost} />
          <Route exact path="/board/:type/:id" component={Detail} />

          <Redirect from="*" to="/" />
          {/* <Route component={NotFoune} /> */}
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default Router;
