import React, { Component } from 'react'

import {Form, Button, Divider, Radio} from 'semantic-ui-react'
import TeacherAdapter from '../Adapters/TeacherAdapter'
import StudentAdapter from '../Adapters/StudentAdapter'

import {initializeTeacher, initializeStudent} from '../Redux/ActionCreators'
import {connect} from 'react-redux'

class RegistrationForm extends Component{
  state={
    firstName:"",
    lastName:"",
    username:"",
    password:"",
    passwordConfirmation:"",
    isDisabled:true,
    errors:[],
    forWhom: "teacher",
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, ()=>{
      if(this.state.firstName && this.state.lastName && this.state.username && this.state.password && this.state.passwordConfirmation){
        this.setState({isDisabled:false})
      } else (
        this.setState({isDisabled:true})
      )
    })
  }

  setLocalStorage = (json) => {
    localStorage.setItem("token", json.token)
    localStorage.setItem("id", json.id)
    localStorage.setItem("name", json.name)
  }

  handleRadio = (event, {value}) => {
    this.setState({forWhom: value})
  }

  handleClick = (event) => {
    const {firstName, lastName, username, password, passwordConfirmation} = this.state
    if(password === passwordConfirmation){
      const userInfo = {firstName, lastName, username, password}

      if(this.state.forWhom === "teacher"){
        TeacherAdapter.register(userInfo)
        .then(json => {
          if(json.error){
            this.setState({error:json.error})
          } else {
            this.setLocalStorage(json)
            TeacherAdapter.getClasses()
            .then(classes => {
              this.props.initializeTeacher(classes)
              this.props.history.push('/home')
            })
          }
        })
      } else{
        StudentAdapter.register(userInfo)
        .then(json => {
          if(json.error){
            this.setState({error:json.error})
          } else {
            this.setLocalStorage(json)
            StudentAdapter.getClasses()
            .then(classes =>{
              this.props.initializeStudent(classes)
              this.props.history.push('/home')
            })
          }
        })
      }

    } else{
      this.setState({errors:["Password confirmation does not match password."]})
    }
  }

  render(){
    const errors = this.state.errors.map(error => <h4>{error}</h4>)
    return(
      <div>
        {errors}
        <Form>

          <Form.Input onChange={this.handleChange} value={this.state.firstName} label='First Name' name="firstName" placeholder="First Name" />
          <Form.Input onChange={this.handleChange} value={this.state.lastName} label='Last Name' name="lastName" placeholder="Last Name" />
          <Form.Input onChange={this.handleChange} value={this.state.username} label="Username" name="username" placeholder="Username" />
          <Form.Input onChange={this.handleChange} value={this.state.password} type="password" label="Password" name="password" placeholder="Password" />
          <Form.Input onChange={this.handleChange} value={this.state.passwordConfirmation} type="password" label="Password Confirmation" name="passwordConfirmation" placeholder="Password Confirmation" />
          <Form.Field>
            <Radio label="I am a teacher" value="teacher" name="forWhom" checked={this.state.forWhom === "teacher"} onChange={this.handleRadio}/>
          </Form.Field>
          <Form.Field>
            <Radio label="I am registering for a school" value="student" name="forWhom" checked={this.state.forWhom === "student"} onChange={this.handleRadio}/>
          </Form.Field>
        </Form>
        <Divider hidden/>
        <Button onClick={this.handleClick} disabled={this.state.isDisabled} content="Register"/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeTeacher: (classroomsJSON) =>{
      return dispatch(initializeTeacher(classroomsJSON))
    },
    initializeStudent: (classroomsJSON) =>{
      return dispatch(initializeStudent(classroomsJSON))
    },

  }
}

export default connect(null, mapDispatchToProps)(RegistrationForm)
