export const homeRoute = 'home';
export const resultsRoute = 'results';
export const classesRoute = 'classes';
export const studentsRoute = 'students';
export const notificationsRoute = 'notifications';
export const settingsRoute = 'settings';
export const loginRoute = 'login';

export enum PageRoute{
  Home,
  Result,
  Classes,
  Students,
  Notifications,
  Settings,
  Login,
  None,
}

export interface IAppPages {
  title?: string;
  url?: string;
  icon?: string;
  pageRoute?: PageRoute;
  handler?: () => void;
}

export const authRoutes = [loginRoute];

export const nonAuthRoutes = [homeRoute, classesRoute, resultsRoute, studentsRoute, notificationsRoute, settingsRoute];