import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';

class Tag extends React.Component {
  render() {
    return (
      <div style={{border: '2px solid #888888', borderRadius: 20, padding: 5, marginRight: 5, marginBottom: 5, alignItems: 'center', backgroundColor: '#fafafa'}}>
        {this.props.name}
        <Button variant='light' onClick={() => this.props.removeTag(this.props.name)} style={{padding: 0, width: 28, height: 28, margin: 0, fontSize: 10, borderRadius: 14}}>╳</Button>
      </div>
    )
  }
}

export default Tag;
