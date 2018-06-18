import React, { Component } from 'react';
import './App.css';

import AppContainer from './Containers/AppContainer'
import HomeContainer from './Containers/HomeContainer'
import CreateClassForm from './TeacherComponents/CreateClassForm'
import {Switch, Route, Redirect} from 'react-router-dom'

class App extends Component {
  state={
    firstTime: true,
    addClassForm: true
  }

  close = () => {
    this.setState({firstTime: false, addClassForm: false})
  }

  render() {
    return (
      <Switch>
        <Route path='/' exact render={(props) => <AppContainer {...props}/>}>
        </Route>

        <Route path='/register'>
          <p>REGISTER PATH IN APP.JS</p>
        </Route>


        <Route path='/login'>
          <p>LOGIN PATH IN APP.JS</p>
        </Route>

        <Route path='/create_first_class' render={(props) => <CreateClassForm {...props} firstTime={this.state.firstTime} closeFirstTime={this.close} addClassForm={this.state.addClassForm}/>}/>

        {localStorage.getItem('token') ?
          <Route path='/home' render={(props) => <HomeContainer {...props}/> }></Route>
            :
          <Redirect to='/'/> }
      </Switch>
    )
  }
}

export default App;
