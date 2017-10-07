import React from 'react';
import { UserIsAuthenticated, UserIsNotAuthenticated } from './behavior/app/auth/UserAuthWrappers';
import Layout from './ui/Layout';
import WebsiteLayout from './behavior/website/WebsiteLayout';
import FaqScreen from './ui/website/faq/FaqScreen';
import LandingScreenContainer from './behavior/website/landing/LandingScreenContainer';
import AppLayout from './behavior/app/AppLayout';
import SignUpScreenContainer from './behavior/app/auth/SignUpScreenContainer';
import SignUpSuccessScreen from './ui/app/auth/SignUpSuccessScreen';
import SignUpConfirmationScreenContainer from './behavior/app/auth/SignUpConfirmationScreenContainer';
import SignInScreenContainer from './behavior/app/auth/SignInScreenContainer';
import SignOutScreenContainer from './behavior/app/auth/SignOutScreenContainer';
import StopwatchScreenContainer from './behavior/app/stopwatch/StopwatchScreenContainer';
import StopwatchDescriptionScreenContainer from './behavior/app/stopwatch/DescriptionScreenContainer';
import ProjectListScreenContainer from './behavior/app/projects/ProjectListScreenContainer';
import ProjectFormScreenContainer from './behavior/app/projects/ProjectFormScreenContainer';
import withPagination from './behavior/app/utils/withPagination';

// const AuthenticatedAppContainer = UserIsAuthenticated((props) => props.children);
const AuthenticatedAppContainer = UserIsAuthenticated(props =>
  React.cloneElement(props.children, { user: props.authData.user }),
);
const NotAuthenticatedAppContainer = UserIsNotAuthenticated(props => props.children);

// eslint-disable-next-line import/prefer-default-export
export default {
  component: Layout,
  childRoutes: [
    {
      path: '/',
      component: WebsiteLayout,
      indexRoute: { component: LandingScreenContainer },
      childRoutes: [
        { path: '/faq', component: FaqScreen },
      ],
    },
    {
      component: AppLayout,
      childRoutes: [
        { path: '/sign-out', component: SignOutScreenContainer },
        {
          component: NotAuthenticatedAppContainer,
          childRoutes: [
            { path: '/sign-up', component: SignUpScreenContainer },
            { path: '/sign-up/success', component: SignUpSuccessScreen },
            { path: '/sign-up/confirmation', component: SignUpConfirmationScreenContainer },
            { path: '/sign-in', component: SignInScreenContainer },
          ],
        },
        {
          component: AuthenticatedAppContainer,
          childRoutes: [
            { path: '/app', component: StopwatchScreenContainer },
            { path: '/app/log-description', component: StopwatchDescriptionScreenContainer },
            { path: '/app/projects',
              component: withPagination(ProjectListScreenContainer),
            },
            { path: '/app/projects/new', component: ProjectFormScreenContainer },
            { path: '/app/projects/:projectId', component: ProjectFormScreenContainer },
          ],
        },
      ],
    },
  ],
};
