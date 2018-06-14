import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Container, Table, Icon} from 'semantic-ui-react'

class TeacherInformationForStudent extends Component{

  renderClassName = () => {
    const {displayedClassroom} = this.props
    if(this.props.validDisplay()){
      return <h1>{displayedClassroom.name}</h1>
    }
  }

  renderStudents = () => {
    const {displayedClassroom} = this.props
    if(this.props.validDisplay() && displayedClassroom.students.length > 0 ){
      const assignmentIds = displayedClassroom.assignments.map(assignment => {
        return assignment.id
      })

      return displayedClassroom.students.map(student => {
          let average = 0
          let counter = 0
          student.grades.forEach(grade => {
            if(assignmentIds.includes(grade.assignment_id)){
              average += grade.grade
              counter += 1
            }
          })
          average = Math.round(average/counter * 100)/100

          return(
          <Table.Row>
            <Table.Cell>{`${student.firstName} ${student.lastName}`}</Table.Cell>
            {student.isAccount ?
              <Table.Cell>{`${student.username}`}</Table.Cell>
            :
              <Table.Cell error><Icon name='attention' />{`${student.username}`}</Table.Cell>
            }
            <Table.Cell>{average}</Table.Cell>
          </Table.Row>
          )
        })
    } else {
      return []
    }
  }

  render(){
    const className = this.renderClassName()
    const students = this.renderStudents()
    return(
      <Container>
        {className}
        <Table singleLine>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Average</Table.HeaderCell>
          </Table.Row>

          {students}
        </Table>
      </Container>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    displayedClassroom: state.displayedClassroom,
  }
}

export default connect(mapStateToProps)(TeacherInformationForStudent)
