import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ProjectActions from './ProjectActions';
import { readEntityById } from './ProjectReducers';
import ProjectFormScreen from '../../../ui/app/projects/ProjectFormScreen';
import Notifications from '../../../ui/app/utils/Notifications';
import { getNotifications } from '../utils';

class ProjectFormScreenContainer extends Component {

  componentDidMount() {
    const id = this.props.params.projectId;
    if (id) this.props.actions.readEntity(id, '?include=author');
  }

  getSubmitHandler = () => (
    (this.props.projects.data) ? this.updateEntity : this.createEntity
  )

  createEntity = (data) => {
    this.props.actions.createEntity(data, this.redirectToList);
  }

  deleteHandler = (id) => {
    this.props.actions.deleteEntity(id, this.redirectToList);
  }

  updateEntity = (data) => {
    // this is needed to fix an issue with UI.
    // due to the use of ref={} in child component,
    // form component gets outdated when editing a project
    // when calling callback to submit data.
    // this.setState({
    //  project: Object.assign({}, this.state.project, data),
    // });

    const id = this.props.projects.data.id;
    this.props.actions.updateEntity(id, data, this.redirectToList);
  }

  redirectToList = () => {
    browserHistory.push('/app/projects');
  }

  render() {
    const { error, isConnecting, data } = this.props.projects;

    return (
      <div>
        <ProjectFormScreen
          delete={this.deleteHandler}
          submitHandler={this.getSubmitHandler()}
          error={this.props.projects.error}
          isEditing={this.props.params.projectId != null}
          isConnecting={isConnecting}
          project={data}
          user={this.props.user}
        />
        <Notifications notifications={getNotifications(error, isConnecting)} />
      </div>
    );
  }
}

ProjectFormScreenContainer.propTypes = {
  actions: PropTypes.shape({
    createEntity: PropTypes.func.isRequired,
    readEntity: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    deleteEntity: PropTypes.func.isRequired,
  }).isRequired,

  params: PropTypes.shape({
    projectId: PropTypes.string,
  }).isRequired,

  projects: PropTypes.shape({
    data: PropTypes.object,
    error: PropTypes.array,
    isConnecting: PropTypes.bool,
  }).isRequired,

  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

ProjectFormScreenContainer.defaultProps = {
  projects: {
    data: {},
  },
};

const mapStateToProps = (state, { params }) => ({
  projects: {
    data: readEntityById(state, params.projectId),
    error: state.projects.error,
    isConnecting: state.projects.isConnecting,
  },
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ProjectActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectFormScreenContainer);
