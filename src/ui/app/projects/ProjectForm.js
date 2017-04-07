import React, { Component, PropTypes } from 'react'

class ProjectForm extends Component {

  state = {
    name: (this.props.project && this.props.project.name) ? this.props.project.name : ''
  }

  changeHandler = e => {
    this.setState({ name: e.target.value })
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('ProjectForm().componentWillReceiveProps() - nextProps: ', nextProps)

    if (!nextProps.project) return

    this.setState({
      name: nextProps.project.name
    })
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
    let content
    if (this.props.isFetching) {
      content = <p>Connecting, please wait...</p>
    } else {
      content = <div className="ProjectForm">
        <input
          type="text"
          placeholder="Project name"
          autoFocus="true"
          value={this.state.name}
          onChange={this.changeHandler}
        />
        <button onClick={this.saveHandler}>Save</button>
      </div>
    }

    return content
  }
}

ProjectForm.propTypes = {
  isFetching: PropTypes.bool,
  project: PropTypes.object
}

export default ProjectForm
