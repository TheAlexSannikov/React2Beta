import React from 'react';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)) {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <Course key={i} data={this.props.data[i]} courseKey={this.props.data[i].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses} />
        )
      }
    }
    else {
      for (const course of Object.keys(this.props.data)) {
        courses.push(
          <Course key={this.props.data[course].number} data={this.props.data[course]} courseKey={this.props.data[course].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses} />
        )
      }
    }

    if (courses.length === 0 && this.props.cartMode) {
      return (<div style={{ marginLeft: '-20vw', height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        This is empty. Add a course to you planner first.
      </div>
      )
    } else if (courses.length === 0 && !this.props.cartMode) {
      return (<div style={{ marginLeft: '-20vw', height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        This is empty. Enable your VPN and refresh.
      </div>
      )
    }

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

export default CourseArea;
