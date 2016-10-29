import React, { Component, PropTypes } from 'react'

class ProjectForm extends Component {

  static propTypes = {
    heading: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  state = {
    name: this.props.name || ''
  }

  changeHandler = e => {
    this.setState({ name: e.target.value })
  }

  saveHandler = e => {
    const data = {
      name: this.state.name
    }

    this.props.submitHandler(data)
      .then((data) => {
        this.setState({ name: '' })
      })
  }

  render() {
    return (
      <div className="ProjectForm">
        <h3>
          {this.props.heading}
        </h3>
        <input
          type="text"
          placeholder="Project name"
          autoFocus="true"
          value={this.state.name}
          onChange={this.changeHandler}
        />
        <button onClick={this.saveHandler}>Save</button>
      </div>
    )
  }
}

export default ProjectForm
