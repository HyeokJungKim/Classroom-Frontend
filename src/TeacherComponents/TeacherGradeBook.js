import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Container, Table, Grid, Divider} from 'semantic-ui-react'

import AddNewAssignmentForm from './AddNewAssignmentForm'
import AddNewStudentForm from './AddNewStudentForm'
import AddExistingStudentForm from './AddExistingStudentForm'
import ListOfExistingStudents from './ListOfExistingStudents'
import EditAssignmentForm from './EditAssignmentForm'
import EditGradeForm from './EditGradeForm'
import NoStudentsAvailable from './NoStudentsAvailable'

class TeacherGradeBook extends Component{
  state={
    editGrade: false,
    editAssignment: false,
    addExistingStudent: false,
    gradeID: "",
    assignmentID: "",
    students: [],
  }

  renderAssignments = () => {
    const {displayedClassroom} = this.props
    if(this.props.validDisplay() && displayedClassroom.assignments.length > 0){
      return displayedClassroom.assignments.map(assignment => {
        return <Table.HeaderCell className="hover" onClick={() => this.editAssignment(assignment)} textAlign="center" key={assignment.id}>{assignment.description}</Table.HeaderCell>
       })
    } else{
      return <Table.HeaderCell textAlign="center"> You don't have any assignments!</Table.HeaderCell>
    }
  }

  editAssignment = (assignment) => {
    this.setState({assignmentID: assignment.id, editAssignment: true})
  }

  renderStudents= () => {
    const {displayedClassroom} = this.props
    if(this.props.validDisplay() && displayedClassroom.students.length > 0 ){
      const assignmentIds = displayedClassroom.assignments.map(assignment => {
        return assignment.id
      })

      displayedClassroom.students.sort((a,b) => {
        if(a.firstName < b.firstName) return -1
        if(a.firstName > b.firstName) return 1
        return 0
      })

      return displayedClassroom.students.map(student => {
        let grades = student.grades.filter(grade =>{
          return assignmentIds.includes(grade.assignment_id)
        })

        let orderedGrades = grades.sort((a,b) => {
          return a.assignment_id - b.assignment_id
        })

        let filteredGrades = orderedGrades.map(grade => {
          if(grade.grade <= 65){
            return <Table.Cell negative className="hover redhover" textAlign="center" key={grade.id} onClick={() => this.changeGrade(grade)}>{grade.grade}</Table.Cell>
          } else{
            return <Table.Cell className="hover" textAlign="center" key={grade.id} onClick={() => this.changeGrade(grade)}>{grade.grade}</Table.Cell>
          }
        })
        return (
          <Table.Row key={student.id}>
            <Table.Cell collapsing>{`${student.firstName} ${student.lastName}`}</Table.Cell>
            {filteredGrades}
          </Table.Row>
        )
      })
    } else {
      return <Table.Row><Table.Cell>You don't have any students!</Table.Cell></Table.Row>
    }
  }

  changeGrade = (grade) => {
    this.setState({editGrade: true, gradeID: grade.id})
  }

  closeEdit = () => {
    this.setState({editGrade: false, gradeID: ""})
  }

  closeAssignmentEdit = () => {
    this.setState({editAssignment: false, assignmentID: ""})
  }

  renderClassName = () => {
    const {displayedClassroom} = this.props
    if(this.props.validDisplay()){
      return <h1>{displayedClassroom.name}</h1>
    }
  }

  setStudents = (studentsArr) => {
    this.setState({students: studentsArr, addExistingStudent: true})
  }

  resetStudents = () => {
    this.setState({students: [], addExistingStudent: false})
  }

  render(){
    const assignments = this.renderAssignments()
    const students = this.renderStudents()
    const className = this.renderClassName()
    return(
      <Container fluid>
        {className}
        <Grid columns={3}>
          <Grid.Row>

            <Grid.Column>
              <AddNewAssignmentForm/>
            </Grid.Column>

            <Grid.Column>
              <AddExistingStudentForm setStudents={this.setStudents}/>
            </Grid.Column>

            <Grid.Column>
              <AddNewStudentForm/>
            </Grid.Column>

          </Grid.Row>
        </Grid>
        <Divider hidden/>
        <Container fluid className="gradebook">

          <Table fixed definition compact collapsing>
            <Table.Header>
              <Table.HeaderCell />
                {assignments}
            </Table.Header>
            <Table.Body>
              {students}
            </Table.Body>
          </Table>

          <Divider hidden/>
        </Container>

          {this.state.editGrade ?
            <EditGradeForm gradeID={this.state.gradeID} editGrade={this.state.editGrade} closeEdit={this.closeEdit}/>
            :
            null
          }

          {this.state.students.length > 0 && this.state.addExistingStudent ?
            <ListOfExistingStudents resetStudents={this.resetStudents} students={this.state.students}/>
            :
            <NoStudentsAvailable resetStudents={this.resetStudents} addExistingStudent={this.state.addExistingStudent}/>
          }

          {this.state.editAssignment ?
            <EditAssignmentForm assignmentID={this.state.assignmentID} editAssignment={this.state.editAssignment} closeAssignmentEdit={this.closeAssignmentEdit} />
            :
            null
          }
      </Container>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    displayedClassroom: state.displayedClassroom,
  }
}


export default connect(mapStateToProps)(TeacherGradeBook)
