import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Container, Table, Button, Icon, Segment, Grid, Divider} from 'semantic-ui-react'
import OneClassInfo from './OneClassInfo'

class StudentGradeBook extends Component{
  state={
    display:"none",
  }

  validDisplay = () => {
    const {displayedClassroom} = this.props
    return displayedClassroom && displayedClassroom.assignments
  }

  renderAssignments = () => {
    const {displayedClassroom} = this.props
    if(this.validDisplay() && displayedClassroom.assignments.length > 0){
      let gradeSum = 0
      let counter = 0
      const assignmentIds = displayedClassroom.assignments.map(assignment => {
        return assignment.id
      })

      const gradesToDisplay = displayedClassroom.assignments.map(assignment => {
        let filteredGrades = assignment.grades.filter(grade => {
          return grade.student_id === parseInt(localStorage.getItem("id")) && assignmentIds.includes(grade.assignment_id)
        })

        let studentGrades = filteredGrades.map(grade => {
          gradeSum += grade.grade
          counter += 1
          if(grade.grade <= 65){
            return <Table.Cell negative textAlign="center" key={grade.id} id={grade.id}>{grade.grade}</Table.Cell>
          }else {
            return <Table.Cell  textAlign="center" key={grade.id} id={grade.id}>{grade.grade}</Table.Cell>
          }

        })

        if(assignment.pdf){
          return(
            <Table.Row key={assignment.id}>
              <Table.Cell >{assignment.description}<a href={assignment.pdf} target="_blank"> <Icon name="download"/></a></Table.Cell>
              {studentGrades}
            </Table.Row>
          )
        } else {
          return(
            <Table.Row key={assignment.id}>
              <Table.Cell>{assignment.description}</Table.Cell>
              {studentGrades}
            </Table.Row>
          )
        }
      })

      return([gradesToDisplay, Math.round(gradeSum/counter * 100)/100])
    } else{
      return([<Table.Row>
        <Table.Cell>No assignments for this class!</Table.Cell>
      </Table.Row>, 0]

      )
    }
  }

  //


  renderClassName = () => {
    const {displayedClassroom} = this.props
    const teacher = displayedClassroom.teacher
    if(this.validDisplay()){
      return (
            <Container textAlign="center" basic>
              <h1>{displayedClassroom.name}</h1>
              <h4>{`Taught by: ${teacher.firstName} ${teacher.lastName}`}</h4>
            </Container>
      )

    }
  }

  handleClick = (event) => {
    this.setState({display: event.currentTarget.name})
  }

  render(){
    let assignmentAndAverage = this.renderAssignments()
    let assignments = assignmentAndAverage[0]
    let average = assignmentAndAverage[1]
    let className = this.renderClassName()
    return(
      <Segment basic>
        <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            {className}
            <Divider hidden/>
            <Container textAlign="center">
              <Button.Group>
                <Button onClick={this.handleClick} name="bar" icon> <Icon name='chart bar' /> </Button>
                <Button onClick={this.handleClick} name="line" icon> <Icon name='line graph' /> </Button>
                <Button onClick={this.handleClick} name="none" icon> <Icon name='hide' /> </Button>
              </Button.Group>
            </Container>

          </Grid.Column>

          <Grid.Column width={8}>
            <Table fixed definition compact>
              <Table.Header>
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="center" >{`Average: ${average}`}</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                  {assignments}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        </Grid>
        <Divider hidden/>

          <Container>
            <OneClassInfo display={this.state.display} validDisplay={this.validDisplay}/>
          </Container>

      </Segment>

    )
  }
}


const mapStateToProps = (state) => {
  return {
    displayedClassroom: state.displayedClassroom,
  }
}


export default connect(mapStateToProps)(StudentGradeBook)
