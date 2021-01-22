import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 


class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
    }
  }


  // getRatingArea() {
  //   // console.log("here")
  //   // console.log(this.props)
  //   if(typeof this.props.data.failedRequisites !== 'undefined')
  //     if(this.props.data.failedRequisites.length > 0)
  //       return <div>How do you think you would like to take this course?</div>
  //   return <h3>You may enroll in this course</h3>
  // }

  render() {
    return (
      <Card style={{ width: '33%', marginTop: '5px', marginBottom: '5px' }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>
              {this.props.data.name}
            </div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          {this.getDescription()}
          {/* {this.getRatingArea()} */}
          <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
        </Card.Body>
        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.getSections()}
          </Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>)
  }

  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if (this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {
    let sections = [];


    for (let i = 0; i < this.props.data.sections.length; i++) {
      sections.push(
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{ height: 63, display: 'flex', alignItems: 'center' }}>
            {"Section " + i}
            {this.getSectionButton(i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(this.props.data.sections[i].time)}
              {this.getSubsections(i, this.props.data.sections[i])}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{ position: 'absolute', right: 20 }}>{buttonText}</Button>
  }

  addCourse() {
    this.props.addCartCourse(
      { course: this.props.courseKey });
  }

  removeCourse() {
    this.closeModal()
    confirmAlert({
      title: 'Remove ' + this.props.data.name + " from planner?",
      message: `You can add it back from the 'search' tab`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.removeCartCourse(
            {
              course: this.props.courseKey
            }
          )
        },
        {
          label: 'No',
          
        }
      ]
    });


  }

  addSection(e, section) {
    e.stopPropagation();
    this.props.addCartCourse(
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse(
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse(
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse(
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i = 0; i < sectionValue.subsections.length; i++) {
      subsections.push(
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{ height: 63, display: 'flex', alignItems: 'center' }}>
            {i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        if (this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{ position: 'absolute', right: 20 }}>{buttonText}</Button>
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  setExpanded(value) {
    this.setState({ expanded: value });
  }

  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if (this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{ width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20 }} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if (this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if (this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }

}

export default Course;
