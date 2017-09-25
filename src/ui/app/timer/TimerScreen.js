import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import MainNav from '../nav/MainNav';
import PlayPauseControls from './PlayPauseControls';
import TimeElapsed from './TimeElapsed';
import DatePicker from './DatePicker';
import ProjectListDropDown from './ProjectListDropDown';

const RESET_TIMER = 'app/timer/reset/requested';

class TimerScreen extends Component {

  state = {
    menuActive: false,
  }

  toggleMenu = () => {
    this.setState({ menuActive: !this.state.menuActive });
  }

  iconMenuItemClickHandler = (event, child) => {
    if (child.props.value === RESET_TIMER) {
      console.log('TimerScreen().iconMenuItemClickHandler() - RESET TIMER');
    }
  }

  render() {
    const { palette } = this.context.muiTheme;
    const toolbarStyles = {
      backgroundColor: palette.primary1Color,
      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    };

    return (
      <div className="TimerScreen">
        <Toolbar style={toolbarStyles}>
          <ToolbarGroup firstChild>
            <IconButton onClick={this.toggleMenu}>
              <FontIcon
                className="material-icons"
                color={palette.alternateTextColor}
              >
                menu
              </FontIcon>
            </IconButton>
            <ToolbarTitle
              text="Timer"
              style={{ color: palette.alternateTextColor }}
            />
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              iconStyle={{ color: palette.alternateTextColor }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onItemTouchTap={this.iconMenuItemClickHandler}
            >
              <MenuItem primaryText="Reset timer" value={RESET_TIMER} />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        <Drawer
          docked={false}
          open={this.state.menuActive}
          onRequestChange={this.toggleMenu}
        >
          <MainNav user={this.props.user} />
        </Drawer>
        <PlayPauseControls
          isPlaying={this.props.isPlaying}
          toggle={this.props.toggle}
        />
        <TimeElapsed
          hourPicked={this.props.hourPicked}
          minutePicked={this.props.minutePicked}
        />
        <div style={{ margin: 10 }}>
          <DatePicker datePicked={this.props.datePicked} />
          <ProjectListDropDown
            itemPicked={this.props.projectPicked}
            projects={this.props.projects}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon
              color="#3f2da5"
              style={{ marginRight: 20 }}
            />
            <TextField
              hintText="Description (optional)"
              multiLine
              rowsMax={4}
            />
          </div>
        </div>
        <FlatButton
          label="Save"
          primary
          onClick={this.props.submit}
          style={{ position: 'fixed', bottom: 10, right: 0 }}
        />
      </div>
    );
  }
}

TimerScreen.contextTypes = {
  muiTheme: PropTypes.shape({
    palette: PropTypes.object,
  }),
};

TimerScreen.propTypes = {
  isPlaying: PropTypes.bool,
  datePicked: PropTypes.func.isRequired,
  hourPicked: PropTypes.func.isRequired,
  minutePicked: PropTypes.func.isRequired,
  projectPicked: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  submit: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

TimerScreen.defaultProps = {
  isPlaying: false,
  projects: null,
  user: null,
};

export default TimerScreen;
