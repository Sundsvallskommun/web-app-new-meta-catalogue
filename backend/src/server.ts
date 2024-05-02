import App from '@/app';
import { MDVOrganizationController } from '@/controllers/mdviewer/organization.controller';
import { MDVResponsibilityController } from '@/controllers/mdviewer/responsibility.controller';
import { IndexController } from '@controllers/index.controller';
import { UserController } from '@controllers/user.controller';
import validateEnv from '@utils/validateEnv';
import { AlertController } from './controllers/alert-banner.controller';
import { EmployeeController } from './controllers/employee/employee.controller';
import { FeedbackController } from './controllers/feedback.controller';
import { MDVEmployeeController } from './controllers/mdviewer/employment.controller';
import { MDVOperationController } from './controllers/mdviewer/operation.controller';
import { MDVSearchController } from './controllers/mdviewer/search.controller';
import { OrgChangeActivityController } from './controllers/orgchange/activity.controller';
import { OrgChangeDraftController } from './controllers/orgchange/draft.controller';
import { OrgChangeEmploymentController } from './controllers/orgchange/employment.controller';
import { OrgChangeObjectController } from './controllers/orgchange/object.controller';
import { OrgChangeOperationController } from './controllers/orgchange/operation.controller';
import { OrgChangeInitialOrganizationExportController } from './controllers/orgchange/organization.controller';
import { OrgChangeOrgNodeController } from './controllers/orgchange/orgnode.controller';
import { OrgChangePATeamController } from './controllers/orgchange/pateam.controller';
import { OrgChangeProjectController } from './controllers/orgchange/project.controller';
import { OrgChangeResponsibilityController } from './controllers/orgchange/responsibility.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  MDVResponsibilityController,
  MDVOrganizationController,
  MDVEmployeeController,
  AlertController,
  MDVOperationController,
  EmployeeController,
  MDVSearchController,
  FeedbackController,

  OrgChangeDraftController,
  OrgChangeEmploymentController,
  OrgChangeOperationController,
  OrgChangeObjectController,
  OrgChangeActivityController,
  OrgChangeProjectController,
  OrgChangeOrgNodeController,
  OrgChangePATeamController,
  OrgChangeResponsibilityController,
  OrgChangeInitialOrganizationExportController,
]);

app.listen();
