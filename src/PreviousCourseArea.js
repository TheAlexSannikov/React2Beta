import React from 'react';
import './App.css';
import PreviousCourse from './PreviousCourse';
// import Course from './Course';

class PreviousCourseArea extends React.Component {

     getCourses() {
          let courses = [];
          for (const course of Object.keys(this.props.data)) {
               courses.push(
                    <PreviousCourse key={this.props.data[course].number} data={this.props.data[course]} courseNumber={this.props.data[course].number} handleCourseRating={(prevCourse) => this.props.handleCourseRating(prevCourse)} keywords={this.props.data.keywords} />
               )
          }
          if (courses.length === 0)
               return (<div style={{ marginLeft: '-20vw', height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    This is empty. Come back next semester, freshman!
               </div>
               )
          return courses;
     }

     shouldComponentUpdate(nextProps) {
          return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
     }

     render() {
          return (
               <div style={{ margin: 5, marginTop: -5 }}>
                    {this.getCourses()}
               </div>
          )
     }
}
export default PreviousCourseArea;