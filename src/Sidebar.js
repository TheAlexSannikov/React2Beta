import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.interestArea = React.createRef();
    this.interestArea.current = "Mathematics"
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
  }

  setCourses() {
    if (this.subject.current != null && this.minimumCredits.current != null && this.maximumCredits.current != null) {
      this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.search.current.value, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value, this.interestArea.current.value));
    }
  }

  handleCreditsKeyDown(e) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      this.addTag(this.search.current.value);
      this.search.current.value = '';
      this.setCourses();
    }
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for (const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  getInterestOptions() {
    let interestOptions = [];

    for (const interest of this.props.interestAreas) {
      interestOptions.push(<option key={interest}>{interest}</option>);
    }

    return interestOptions;
  }

  determineRender() {
    if (!this.props.recommendMode) {
      return (
        <>
          <Card style={{ width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 52px)', position: 'fixed' }}>
            <Card.Body>
              <Card.Title>Search and Filter</Card.Title>
              <Form>
                <Form.Group controlId="formKeywords" onKeyDown={(e) => this.handleSearchKeyDown(e)} onChange={() => this.setCourses()} style={{ width: '100%' }}>
                  <Form.Label>Search</Form.Label>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Form.Control type="text" placeholder="keyword search" autoComplete="off" ref={this.search} />
                  </div>
                </Form.Group>


                <Form.Group controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control as="select" ref={this.subject} onClick={() => this.setCourses()}>
                    {this.getSubjectOptions()}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formInterest">
                  <Form.Label>Interest Area</Form.Label>
                  <Form.Control as="select" ref={this.interestArea} onChange={async () => { await this.setCourses(); this.props.propagateInterest(this.interestArea.current.value) }}>
                    {this.getInterestOptions()}
                  </Form.Control>
                </Form.Group>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                    <Form.Label>Credits</Form.Label>
                    <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits} />
                  </Form.Group>
                  <div style={{ marginLeft: '5px', marginRight: '5px', marginTop: '38px' }}>to</div>
                  <Form.Group controlId="maximumCredits" style={{ marginTop: '32px' }} onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                    <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits} />
                  </Form.Group>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </>
      )
    } else {
      return (
        <>
          <Card style={{ width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 52px)', position: 'fixed' }}>
            <Card.Body>

              <Form>


                <Form.Group controlId="formInterest">
                  <Form.Label>Interest Area</Form.Label>
                  <Form.Control as="select" ref={this.interestArea} onChange={async () => { await this.setCourses(); this.props.propagateInterest(this.interestArea.current.value) }}>
                    {this.getInterestOptions()}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </>
      )
    }
  }


  render() {
    return this.determineRender();
  }
}

export default Sidebar;
