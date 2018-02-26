import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {

  const IndexPage = dynamic({
    app,
    models: () => [
      import('./models/User'),
      import('./models/Paper'),
    ],
    component: () => import('./routes/IndexPage'),
  });

  const Login = dynamic({
    app,
    models: () => [
      import('./models/User'),
    ],
    component: () => import('./routes/Login/Login'),
  });

  const SignUp = dynamic({
    app,
     models: () => [
       import('./models/User'),
     ],
    component: () => import('./routes/SignUp/SignUp'),
  });

  const Dashboard = dynamic({
    app,
    models: () => [
      import('./models/User'),
      import('./models/Paper'),
      import('./models/Tag'),
    ],
    component: () => import('./routes/Dashboard/Dashboard'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/signUp" exact component={SignUp}/>
        <Route path="/dashboard" component={Dashboard}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
