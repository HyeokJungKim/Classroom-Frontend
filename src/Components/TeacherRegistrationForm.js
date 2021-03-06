import React, { Component } from 'react'
import {Form, Divider, Dropdown} from 'semantic-ui-react'
import TeacherAdapter from '../Adapters/TeacherAdapter'
import SchoolAdapter from '../Adapters/SchoolAdapter'
import {connect} from 'react-redux'
import {initializeTeacher} from '../Redux/ActionCreators'


class TeacherRegistrationForm extends Component{
  state = {
    schools: [],
    schoolPassword: "",
    schoolID: "",
    validSchool: false,

    firstName:"Ms.",
    lastName:"",
    username:"",
    password:"",
    passwordConfirmation:"",
    isDisabled: true,

    errors:[],
  }

  componentDidMount = () => {
    SchoolAdapter.getSchools()
    .then(resp => {
        let schools = resp.map(school => {
          return {id:school.id, key: school.id, value: `${school.name}`, text: `${school.name}`}
        })
        this.setState({schools: schools})
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, ()=>{
      if(!this.state.validSchool && this.state.schoolPassword && this.state.schoolID){
        this.setState({isDisabled: false})
      }else if(this.state.validSchool && this.state.firstName && this.state.lastName && this.state.username && this.state.password && this.state.passwordConfirmation){
        this.setState({isDisabled:false})
      } else{
        this.setState({isDisabled:true})
      }
    })
  }

  handleSelect = (event) => {
    this.setState({schoolID: event.currentTarget.id})
  }

  createSurname = () => {
    return (
      [
        {id: 1, value: "Ms.", text: "Ms."},
        {id: 2, value: "Mrs.", text: "Mrs."},
        {id: 3, value: "Mr.", text: "Mr."},
        {id: 4, value: "Dr.", text: "Dr."},
      ]
    )
  }

  setSchool = () => {
    const {schoolPassword, schoolID} = this.state
    const schoolInfo = {schoolPassword}
    SchoolAdapter.validateSchool(schoolID, schoolInfo)
    .then(resp => {
      if(resp.valid){
        this.setState({errors:[]})
        this.setState({validSchool: resp.valid, isDisabled: true})
        this.props.showRadio()
      } else{
        this.setState({errors:["Invalid School Password"]})
      }
    })
  }

  setLocalStorage = (json) => {
    localStorage.setItem("token", json.token)
    localStorage.setItem("id", json.id)
    localStorage.setItem("name", json.name)
  }

  setTeacher = () => {
    const {firstName, lastName, username, password, passwordConfirmation, schoolID} = this.state
    if(password === passwordConfirmation){
      const userInfo = {firstName, lastName, username, password, schoolID}
      TeacherAdapter.register(userInfo)
      .then(json => {
        if(json.errors){
          this.setState({errors:json.errors, isDisabled: false})
        } else {
          this.setLocalStorage(json)
          TeacherAdapter.getClasses()
          .then(classes => {
            this.props.history.push('/create_first_class')
            this.props.resetState()
          })
        }
      })
    } else{
      this.setState({errors:["Password confirmation does not match password."]})
    }
  }

  handleClick = () => {
    if(!this.state.validSchool){
      this.setSchool()
    } else {
      this.setTeacher()
    }
  }

  handleSurname = (event) => {
    this.setState({firstName: event.currentTarget.innerText})
  }

 render(){
   const errors = this.state.errors.map(error => <h4>{error}</h4>)
   return(
     <div>
       <Form>
         {errors}
         {this.state.validSchool ?
           <div>
             <h2>Enter Your Information</h2>
                <div className="field">
                  <label className="ui form field">Surname</label>
                  <Dropdown className="dropdown" onChange={this.handleSurname} value={this.state.firstName} compact selection options={this.createSurname()}/>
                </div>

              <Form.Input onChange={this.handleChange} value={this.state.lastName} label='Last Name' name="lastName" placeholder="Last Name" />
              <Form.Input onChange={this.handleChange} value={this.state.username} label="Username" name="username" placeholder="Username" />
              <Form.Input onChange={this.handleChange} value={this.state.password} type="password" label="Password" name="password" placeholder="Password" />
              <Form.Input onChange={this.handleChange} value={this.state.passwordConfirmation} type="password" label="Password Confirmation" name="passwordConfirmation" placeholder="Password Confirmation" />
           </div>
            :
            <div>
              <div className="field">
                <label className="ui form field">Choose a School</label>
                <Dropdown className="dropdown" onChange={this.handleSelect} fluid search selection options={this.state.schools}/>
              </div>
              <Form.Input type="password" onChange={this.handleChange} label="School Password" name="schoolPassword" value={this.state.schoolPassword} placeholder="School Password"/>
            </div>
         }
      </Form>
      <Divider hidden/>
      <Form.Button onClick={this.handleClick} disabled={this.state.isDisabled}>Register Teacher</Form.Button>
    </div>
   )
 }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeTeacher: (classroomsJSON) =>{
      return dispatch(initializeTeacher(classroomsJSON))
    },
  }
}

export default connect(null, mapDispatchToProps)(TeacherRegistrationForm)
