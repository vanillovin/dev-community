import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import MainNavigation from './layout/MainNavigation';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UserInfo from '../pages/UserInfo';
import Write from '../pages/Write';
import EditPost from '../pages/EditPost';
import DetailPost from '../pages/DetailPost';
import Board from '../pages/Board';
import Footer from '../components/layout/Footer';

const Router = () => {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <div>
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
            <Route exact path="/board/:type/:id" component={DetailPost} />

            <Redirect from="*" to="/" />
            {/* <Route component={NotFoune} /> */}
          </Switch>
          <Footer />
        </div>
      </>
    </BrowserRouter>
  );
};

export default Router;
