import pipe from 'lodash/fp/pipe';
import withQuery from '../utils/withQuery';
import { generateQueryForRelationship } from '../api/QueryUtils';
import CreateStopwatchScreenContainer from './StopwatchScreenContainer';
import CreateProjectDropdownContainer from './StopwatchProjectDropdownContainer';

// eslint-disable-next-line import/prefer-default-export
export const CreateEnhancedStopwatchScreen = (ProjectDropdown) => {
  const ScreenWithDropdown = CreateStopwatchScreenContainer(
    CreateProjectDropdownContainer(ProjectDropdown),
  );

  return pipe([
    withQuery(generateQueryForRelationship('project')),
  ])(ScreenWithDropdown);
};
