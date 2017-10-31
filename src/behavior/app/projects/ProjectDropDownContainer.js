import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { readEntities } from '../projects/ProjectActions';
import { getEntities } from '../projects/ProjectState';
import ProjectDropDown from '../../../ui/app/projects/ProjectDropDown';

class ProjectDropDownContainer extends Component {
  componentDidMount() {
    this.props.actions.readEntities();
  }

  render() {
    return (
      <ProjectDropDown
        isConnecting={this.props.isConnecting}
        name={this.props.name}
        onCreateProjectClick={() => this.context.router.history.push('/app/projects/new')}
        onItemPick={this.props.onItemPick}
        projects={this.props.entities}
        selectedItemId={this.props.selectedItemId}
      />
    );
  }
}

ProjectDropDownContainer.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

ProjectDropDownContainer.propTypes = {
  actions: PropTypes.shape({
    readEntities: PropTypes.func.isRequired,
  }).isRequired,
  entities: PropTypes.arrayOf(PropTypes.object),
  isConnecting: PropTypes.bool,
  name: PropTypes.string,
  onItemPick: PropTypes.func.isRequired,
  selectedItemId: PropTypes.string,
};

ProjectDropDownContainer.defaultProps = {
  entities: undefined,
  isConnecting: false,
  name: undefined,
  selectedItemId: undefined,
};

const mapStateToProps = state => ({
  entities: getEntities(state),
  isConnecting: state.projects.isConnecting,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ readEntities }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDropDownContainer);
