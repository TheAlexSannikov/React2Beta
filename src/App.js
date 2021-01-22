import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import PreviousCourseArea from './PreviousCourseArea';
import RecommendedCourseArea from './RecommendedCourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interestAreas: [],
      currentInterest: "All",
      cartCourses: {},
      previousCourses: {},
      previousCoursesNumbers: {},
      ratedCourses: {},
      coursesNotTaken: {},
    };
    this.handleCourseRating = this.handleCourseRating.bind(this);
    this.propagateInterest = this.propagateInterest.bind(this);
  }



  componentDidMount() {
    this.loadInitialState()
  }

  async loadInitialState() {
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();
    let previousCourseData = await (await fetch("http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed")).json();


    await this.setState({ allCourses: courseData, coursesNotTaken: this.getNotTakenCourses(previousCourseData.data, courseData) });
    this.attachFailedRequisites()
    await this.setState({ filteredCourses: this.getNotTakenCourses(previousCourseData.data, courseData), subjects: this.getSubjects(courseData), interestAreas: this.getInterestAreas(courseData), previousCoursesNumbers: previousCourseData.data, })
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }
    return subjects;
  }

  getInterestAreas(courses) {
    let interestAreas = [];
    interestAreas.push("All");

    for (let i = 0; i < courses.length; i++) {
      for (let j = 0; j < courses[i].keywords.length; j++) {
        if (interestAreas.indexOf(courses[i].keywords[j]) === -1)
          interestAreas.push(courses[i].keywords[j]);
      }
    }
    interestAreas.sort()
    return interestAreas;
  }

  async propagateInterest(interestArea) {
    if (typeof interestArea !== 'undefined') {
      
      await this.setState({
        currentInterest: interestArea
      })
      console.log(this.state.currentInterest)
    }
  }


  //TA helped write this for loop
  getPreviousCourses() {
    let prevCourses = [];
    for (const courseNum of Object.keys(this.state.previousCoursesNumbers)) {
      let course = this.state.allCourses.find((k) => { return k.number === this.state.previousCoursesNumbers[courseNum] })
      prevCourses.push(course)
    }
    return prevCourses;
  }

  getNotTakenCourses(previousCourseNumbers, courseData) {
    let copyCourseData = JSON.parse(JSON.stringify(courseData))

    for (let i = 0; i < courseData.length; i++) {
      let courseIndex = copyCourseData.findIndex((x) => { return x.number === previousCourseNumbers[i] })

      if (courseIndex !== -1)
        copyCourseData.splice(courseIndex, 1) //remove the course that was taken
    }

    return copyCourseData;
  }

  handleCourseRating(prevCourse) {
    let newRatedCourses = JSON.parse(JSON.stringify(this.state.ratedCourses))
    newRatedCourses[prevCourse['name']] = prevCourse
    this.setState({
      ratedCourses: newRatedCourses
    })
  }

  getRecommendedCourses() {
    let courses = {}
    let allKeywords = {}

    // generate array of keywords
    for (const courseName in this.state.ratedCourses) {
      let courseData = this.state.ratedCourses[courseName]
      if (typeof allKeywords[courseData.rating] === 'undefined')
        allKeywords[courseData.rating] = []
      allKeywords[courseData.rating] = allKeywords[courseData.rating].concat(courseData.keywords)
    }

    for (const courseName in this.state.coursesNotTaken) {
      let courseData = this.state.coursesNotTaken[courseName]
      courses[courseName] = courseData;
      courseData['recommendScore'] = 0;

      for (const word of courseData.keywords) {
        if (word === this.state.currentInterest)
          courseData['recommendScore'] += 4
      }

      for (let i = 1; i < 6; i++) {
        for (var word of courseData.keywords) {
          let keywordWeightArray = allKeywords[i]
          if ((typeof keywordWeightArray !== 'undefined'))
            if (keywordWeightArray.includes(word)) {
              
              courseData.recommendScore += 2 * (i - 2) / courseData.keywords.length
            }
        }
      }
    }

    let recommendedCourses = []
    for (const k in courses) {
      if (courses[k].recommendScore > 1) {
        recommendedCourses.push(courses[k])
      }
    }

    recommendedCourses.sort(function (a, b) { return parseFloat(b.recommendScore) - parseFloat(a.recommendScore) }); //SORTS IN DESCENDING ORDER!
    return recommendedCourses
  }


  attachFailedRequisites() {

    let coursesNotTaken = this.state.coursesNotTaken
    let copyAllCourses = JSON.parse(JSON.stringify(this.state.allCourses))

    for (let courseIndex = 0; courseIndex < copyAllCourses.length; courseIndex++) {
      let requisites = [...copyAllCourses[courseIndex]['requisites']]
      // let failedRequisites = copyAllCourses[courseIndex]['failedRequisites']

      if (typeof copyAllCourses[courseIndex]['failedRequisites'] === 'undefined')
        copyAllCourses[courseIndex]['failedRequisites'] = []

      for (let i = 0; i < requisites.length; i++) {
        let requisite = requisites[i]
        for (let j = 0; j < requisite.length; j++) {
          for (let k = 0; k < coursesNotTaken.length; k++) {
            let course = coursesNotTaken[k]
            if (requisite[j] === course.number) { //if 'course' matches a requisite, add it to the list of failedRequisites
              copyAllCourses[courseIndex]['failedRequisites'].push(course)
            }
          }
        }
      }
    }
    this.setState({
      allCourses: copyAllCourses,
    })
  }


  alertFailedRequisites(course) {
    let intermediate = []
    let requiredCoursesString = ""
    let failedRequisites = course['failedRequisites']

    for (const i in failedRequisites) {
      let reqSubarray = failedRequisites[i]

      console.log(reqSubarray)
      if (typeof reqSubarray === 'array') {
        for (let j = 0; j < reqSubarray.length; j++) {
          console.log(reqSubarray[j])
          requiredCoursesString = intermediate.join(" AND ")
        }
        
      } else {
        requiredCoursesString += reqSubarray.number + " OR "
      }
    }
    alert("you cant enroll in this course. You are missing requisites. You must take " + requiredCoursesString + " before taking this course")
  }



  setCourses(courses) {
    this.setState({ filteredCourses: courses })
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deep copy
    let courseIndex = this.state.allCourses.findIndex((x) => { return x.number === data.course })
    if (courseIndex === -1) {
      return
    }


    if (typeof this.state.allCourses[courseIndex]['failedRequisites'] !== 'undefined')
      if (this.state.allCourses[courseIndex]['failedRequisites'].length > 0)
        this.alertFailedRequisites(this.state.allCourses[courseIndex])

    if ('subsection' in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if ('section' in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }


      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++) {
        newCartCourses[data.course][i] = [];

        for (let c = 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c++) {
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if ('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if ('section' in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => { return x.number === courseKey })

      cartData.push(course);
    }
    return cartData;
  }



  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white' }}>
          <Tab eventKey="search" title="Search" style={{ paddingTop: '5vh' }}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interestAreas={this.state.interestAreas} propagateInterest={this.propagateInterest} interestAreaStatus={this.props.interestArea} recommendMode={false} currentInterest={this.state.currentInterest}/>
            <div style={{ marginLeft: '20vw' }}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} cartMode={false}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Planner" style={{ paddingTop: '5vh' }}>
            <div style={{ marginLeft: '20vw' }}>
              <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} cartMode={true}/>
            </div>
          </Tab>
          <Tab eventKey="completedCourses" title="Completed courses" style={{ paddingTop: '5vh' }}>
            <div style={{ marginLeft: '20vw' }}>
              <PreviousCourseArea data={this.getPreviousCourses()} handleCourseRating={this.handleCourseRating} />
            </div>
          </Tab>
          <Tab eventKey="recommendedCourses" title="Recommended courses" style={{ paddingTop: '5vh' }}>
          <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interestAreas={this.state.interestAreas} propagateInterest={this.propagateInterest} interestAreaStatus={this.props.interestArea} recommendMode={true} currentInterest={this.state.currentInterest}/>
            <div style={{ marginLeft: '20vw' }}>
              <RecommendedCourseArea data={this.getRecommendedCourses()} />
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;