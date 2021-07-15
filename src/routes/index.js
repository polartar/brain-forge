import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { MainLayout } from 'containers/Layouts'
import { LogInPage, RegisterPage, EmailVerifyPage, PasswordResetPage } from 'containers/Pages'
import { userIsAuthenticated, userIsNotAuthenticated, userIsSuperAdmin, userIsNotSuperAdmin } from 'utils/auth-wrappers'
import ScrollToTop from 'components/ScrollToTop'

import {
  AboutPage,
  AnalysisRunPage,
  AnalysisStartPage,
  AnalysisResultPage,
  AnalysisPlanPage,
  AnalysisDetailPage,
  MyInfoPage,
  MySitePage,
  Page404,
  ParameterSetListPage,
  ParameterSetDetailPage,
  ProtocolMappingPage,
  SiteDetailPage,
  SiteListPage,
  StudyListPage,
  StudyDetailPage,
  SolutionPage,
  DataDirectoryPage,
  DataFilePage,
  PreprocessingSummaryPage,
  ScannerListPage,
  ScannerDetailPage,
  StatusPage,
  TagListPage,
  TagDetailPage,
  UserPage,
  UserProfilePage,
  CLIDownloadPage,
} from 'containers/Pages'

const ParameterSetRoutes = () => (
  <Switch>
    <Route exact path="/parameter-set" component={ParameterSetListPage} />
    <Route exact path="/parameter-set/:parameterSetId" component={ParameterSetDetailPage} />
  </Switch>
)

const StudyRoutes = () => (
  <Switch>
    <Route exact path="/study" component={StudyListPage} />
    <Route exact path="/study/:studyId" component={StudyDetailPage} />
  </Switch>
)

const SiteRoutes = () => (
  <Switch>
    <Route exact path="/site" component={userIsSuperAdmin(SiteListPage)} />
    <Route exact path="/site/:siteId" component={userIsSuperAdmin(SiteDetailPage)} />
  </Switch>
)

const ScannerRoutes = () => (
  <Switch>
    <Route exact path="/scanner" component={ScannerListPage} />
    <Route exact path="/scanner/:scannerId" component={ScannerDetailPage} />
  </Switch>
)

const AnalysisRoutes = () => (
  <Switch>
    <Route exact path="/analysis/:analysisId" component={AnalysisDetailPage} />
    <Route exact path="/analysis/:analysisId/result" component={AnalysisResultPage} />
  </Switch>
)

const TagRoutes = () => (
  <Switch>
    <Route exact path="/tag" component={TagListPage} />
    <Route exact path="/tag/:tagId" component={TagDetailPage} />
  </Switch>
)

const UserRoutes = () => (
  <Switch>
    <Route exact path="/users" component={UserPage} />
    <Route exact path="/users/profile/:userId" component={UserProfilePage} />
  </Switch>
)

const AuthenticatedRoutes = () => (
  <MainLayout>
    <Switch>
      <Redirect exact from="/" to="/study" />
      <Route exact path="/status" component={StatusPage} />
      <Route exact path="/me/:page" component={MyInfoPage} />
      <Route exact path="/my-site" component={userIsNotSuperAdmin(MySitePage)} />
      <Route exact path="/protocol-mapping" component={ProtocolMappingPage} />
      <Route exact path="/data-directory" component={DataDirectoryPage} />
      <Route exact path="/analysis-plans" component={AnalysisPlanPage} />
      <Route exact path="/analysis-run" component={AnalysisRunPage} />
      <Route exact path="/analysis-start/:analysisType" component={AnalysisStartPage} />
      <Route path="/analysis" component={AnalysisRoutes} />
      <Route path="/parameter-set" component={ParameterSetRoutes} />
      <Route path="/preprocessing-summary/:studyLabel" component={PreprocessingSummaryPage} />
      <Route path="/solution/:solutionId" component={SolutionPage} />
      <Route path="/site" component={userIsSuperAdmin(SiteRoutes)} />
      <Route path="/study" component={StudyRoutes} />
      <Route path="/scanner" component={ScannerRoutes} />
      <Route path="/tag" component={userIsSuperAdmin(TagRoutes)} />
      <Route path="/about" component={AboutPage} />
      <Route path="/users" component={userIsSuperAdmin(UserRoutes)} />
      <Route path="/cli-download" component={CLIDownloadPage} />
      <Route exact path="/data/new" component={DataFilePage} />
      <Route component={Page404} />
    </Switch>
  </MainLayout>
)

const Routes = () => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/login" component={userIsNotAuthenticated(LogInPage)} />
        <Route exact path="/register" component={userIsNotAuthenticated(RegisterPage)} />
        <Route exact path="/email-verify" component={EmailVerifyPage} />
        <Route exact path="/password-reset" component={PasswordResetPage} />
        <Route path="/" component={userIsAuthenticated(AuthenticatedRoutes)} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
)

export default Routes
