import './App.css';
import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import HomePage from './components/home-page';
import LoginForm from './components/login-form';
import SignupForm from './components/signup-form';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/signup">
          <SignupForm />
          <Link to="/login">Already have an account?</Link>
        </Route>
        <Route exact path="/login">
          <LoginForm />
          <Link to="/signup">Don't have an account yet?</Link>
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
