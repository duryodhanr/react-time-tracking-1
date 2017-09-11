import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class EmailSignInForm extends Component {

  state = {
    email: this.props.email || '',
    password: '',
  }

  emailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  }

  passwordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  }

  submitHandler = (e) => {
    e.preventDefault();
    this.props.submitHandler(this.state.email, this.state.password);
  }

  render() {
    const submitButtonAttrs = {};
    if (this.props.isFetching) {
      submitButtonAttrs.disabled = 'disabled';
    }

    return (
      <form className="EmailSignInForm">
        <TextField
          hintText="email"
          onChange={this.emailChangeHandler}
          type="email"
          value={this.state.email}
        />
        <TextField
          hintText="password"
          onChange={this.passwordChangeHandler}
          type="password"
          value={this.state.password}
        />
        <RaisedButton
          primary
          fullWidth
          disabled={this.props.isFetching}
          style={{ marginTop: 20 }}
          label="Sign In"
          onClick={this.submitHandler}
        />
      </form>
    );
  }
}

EmailSignInForm.propTypes = {
  email: PropTypes.string,
  isFetching: PropTypes.bool,
  submitHandler: PropTypes.func.isRequired,
};

EmailSignInForm.defaultProps = {
  email: '',
  isFetching: false,
};

export default EmailSignInForm;
