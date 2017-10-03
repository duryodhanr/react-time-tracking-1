import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from 'material-ui/Toolbar';
import AppBar from './AppBar';
import AppBarTitle from './AppBarTitle';
import AppBarDrawer from './AppBarDrawer';
import MenuIconButton from '../common/MenuIconButton';
import withDrawer from '../common/withDrawer';

const SimpleAppBar = props => (
  <AppBar>
    <ToolbarGroup firstChild>
      <MenuIconButton onClick={props.onToggleDrawer} />
      <AppBarTitle title={props.title} />
    </ToolbarGroup>
    {props.children}
  </AppBar>
);

SimpleAppBar.propTypes = {
  children: PropTypes.node,
  onToggleDrawer: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

SimpleAppBar.defaultProps = {
  children: null,
};

export default withDrawer(SimpleAppBar, AppBarDrawer);
