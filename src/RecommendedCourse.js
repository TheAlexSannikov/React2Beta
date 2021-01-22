import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactTooltip from "react-tooltip";


class RecommendedCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: -1,
      expanded: false,
    }
    this.handleRating = this.handleRating.bind(this);
  }

  async handleRating(event) {
    await this.setState({ rating: parseInt(event.target.value) });
    this.props.handleCourseRating({ key: this.props.name, courseNum: this.props.courseNumber, rating: this.state.rating, keywords: this.props.keywords })
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
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()} | confidence {this.getConfidence()}</Card.Subtitle>

          {this.getDescription()}

        </Card.Body>
      </Card>
    )
  }


  getConfidence() {
    return (
      <>
        <button data-tip data-for="registerTip" style={{ display: 'inline-block', borderRadius: '500px', backgroundColor:"lightblue"}}>
          {this.props.data.recommendScore}
        </button>

        <ReactTooltip id="registerTip" place="top" effect="solid"  delayShow={750}>
          Based on how you rated similar courses and your selected interest area.
    </ReactTooltip>

      </>
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


export default RecommendedCourse;