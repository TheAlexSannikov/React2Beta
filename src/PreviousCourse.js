import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactTooltip from "react-tooltip";


class PreviousCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: -1,
      expanded: false,
    }
    this.handleRating = this.handleRating.bind(this);
  }

  async handleRating(event) {
    console.log(this.state.rating)
    if(this.state.rating === parseInt(event.target.value)){
      await this.setState({ rating: -1 });
      
    } else {
      await this.setState({ rating: parseInt(event.target.value) });
    }

    
    this.props.handleCourseRating({courseNum: this.props.courseNumber, name: this.props.data.name, keywords: this.props.data.keywords, rating: this.state.rating,})
  }

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
          <ul data-tip data-for="ratingTip">
            <li>
              <label> 1
                <input
                  type="checkbox"
                  value="1"
                  checked={this.state.rating === 1}
                  onChange={this.handleRating} />
              </label>
            </li>
            <li>
              <label> 2 
                <input
                  type="checkbox"
                  value="2"
                  checked={this.state.rating === 2}
                  onChange={this.handleRating} />
              </label>
            </li>
            <li>
              <label> 3
                <input
                  type="checkbox"
                  value="3"
                  checked={this.state.rating === 3} 
                  onChange={this.handleRating} />
              </label>
            </li>
            <li>
              <label> 4
                <input
                  type="checkbox"
                  value="4"
                  checked={this.state.rating === 4}
                  onChange={this.handleRating} />
              </label>
            </li>
            <li>
              <label> 5
                <input
                  type="checkbox"
                  value="5"
                  checked={this.state.rating === 5}
                  onChange={this.handleRating} />
              </label>
            </li>
          </ul>
          <ReactTooltip id="ratingTip" place="top" effect="solid" delayShow={750}>
          Rate this course | low is bad, high is good
    </ReactTooltip>
        </Card.Body>
      </Card>
    )
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

  getCredits() {
    if (this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
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
}
export default PreviousCourse;