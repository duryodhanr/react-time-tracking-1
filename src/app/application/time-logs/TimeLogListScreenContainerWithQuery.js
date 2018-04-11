import pipe from 'lodash/fp/pipe';
import withPagination from '../utils/withPagination';
import withQuery from '../utils/withQuery';
import {
  generateQueryForPagination,
  generateQueryForRelationship,
} from '../../infrastructure/jsonapi-redux-client/requests/queries/Utils';
import TimeLogListScreenContainer from './TimeLogListScreenContainer';

const composeQueryFunction = itemsPerPage => page => (
  pipe([
    generateQueryForRelationship('author,project'),
    generateQueryForPagination({ page, itemsPerPage, sort: '-created-at' }),
  ])()
);

export default itemsPerPage => (
  pipe([
    withPagination,
    withQuery(composeQueryFunction(itemsPerPage)),
  ])(TimeLogListScreenContainer)
);
