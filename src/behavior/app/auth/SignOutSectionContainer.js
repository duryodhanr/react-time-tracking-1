import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as SignOutActions from './sign-out/SignOutActions';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(SignOutActions, dispatch),
});

class SignOutSectionContainer extends Component {
  componentDidMount() {
    this.props.actions.signOut().then(() => browserHistory.push('/'));
  }

  render() {
    return <div />;
  }
}

SignOutSectionContainer.propTypes = {
  actions: PropTypes.shape({
    signOut: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignOutSectionContainer);
