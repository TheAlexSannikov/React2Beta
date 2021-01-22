import React from 'react';
import './App.css';
import Tag from './Tag';

class TagArea extends React.Component {
  getTags() {
    let tags = [];

    for(const tag of this.props.tags) {
      tags.push (
        <Tag key={tag} name={tag} removeTag={() => this.props.removeTag(tag)}/>
      )
    }

    return tags;
  }

  render() {
    return (
      <div style={{margin: 5, marginTop: -5, display: 'flex', flexWrap: 'wrap'}}>
        {this.getTags()}
      </div>
    )
  }
}

export default TagArea;
