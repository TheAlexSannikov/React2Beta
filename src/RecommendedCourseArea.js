import React from 'react';
import './App.css';
import RecommendedCourse from './RecommendedCourse';
// import Course from './Course';

class RecommendedCourseArea extends React.Component {

     getCourses() {
          let courses = [];
          for (const course of Object.keys(this.props.data)) {
               courses.push(
                    <RecommendedCourse key={this.props.data[course].name} data={this.props.data[course]} />
               )
          }

          return courses;
     }

     shouldComponentUpdate(nextProps) {
          return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
     }


     determineRender() {
          let courses = this.getCourses()
          if (courses.length === 0) {
               return (<div style={{ marginLeft: '-20vw', height: "80vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    This is empty. Go rate your completed courses or select an interest area.
               </div>
               )
          } else {
               return (<i className={"fa fa-trash"} style={{ margin: 5, marginTop: -5 }}>
                    {courses}
               </i>
               )
          }
     }

     render() {
          return (
               <>
               {this.determineRender()}
               </>
          )
     }
}
export default RecommendedCourseArea;