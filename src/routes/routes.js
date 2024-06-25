import Faqs from "../layouts/admin/Faqs";
import Blank from "../layouts/admin/Blank";
import Event from "../layouts/admin/Event";
import Reports from "../layouts/admin/Reports";
import GetHelp from "../layouts/admin/GetHelp";
import Profile from "../layouts/admin/Profile";
import AllEvent from "../layouts/admin/AllEvent";
import Settings from "../layouts/admin/Settings";
import AddSkills from "../layouts/admin/AddSkills";
import ViewEvent from "../layouts/admin/ViewEvent";
import EditEvent from "../layouts/admin/EditEvent";
import Dashboard from "../layouts/admin/Dashboard";
import AllReports from "../layouts/admin/AllReports";
import ViewSponsor from "../layouts/admin/ViewSponsor";
import AddSponsors from "../layouts/admin/AddSponsors";
import AddAttendee from "../layouts/admin/AddAttendee";
import AllContacts from "../layouts/admin/AllContacts";
import AllSponsors from "../layouts/admin/AllSponsors";
import AllAttendee from "../layouts/admin/AllAttendee";
import ActivityLog from "../layouts/admin/ActivityLog";
import ViewAttendee from "../layouts/admin/ViewAttendee";
import EditAttendee from "../layouts/admin/EditAttendee";
import EmailManager from "../layouts/admin/EmailManager";
import AllFeedbacks from "../layouts/admin/AllFeedbacks";
import EmailMailing from "../layouts/admin/EmailMailing";
import EditSponsors from "../layouts/admin/EditSponsors";
import Page404Dashboard from "../errors/Page404Dashboard";
import ContactStatus from "../layouts/admin/ContactStatus";
import SponsorStatus from "../layouts/admin/SponsorStatus";
import ChangePassword from "../layouts/admin/ChangePassword";
import AllAttendeeList from "../layouts/admin/AllAttendeeList";
import SendSmsAttendee from "../layouts/admin/SendSmsAttendee";
import SendMailAttendee from "../layouts/admin/SendMailAttendee";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsAndConditions from "../components/TermsAndConditions";

const routes = [
  { path: "/admin", exact: true, name: "Admin", component: Dashboard },
  {
    path: "/admin/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  { path: "/admin/profile", exact: true, name: "Profile", component: Profile },
  {
    path: "/admin/change-password",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
  },
  { path: "/admin/add-event", exact: true, name: "Event", component: Event },
  {
    path: "/admin/all-events",
    exact: true,
    name: "AllEvent",
    component: AllEvent,
  },
  {
    path: "/admin/view-event/:id",
    exact: true,
    name: "ViewEvent",
    component: ViewEvent,
  },
  {
    path: "/admin/edit-event/:id",
    exact: true,
    name: "EditEvent",
    component: EditEvent,
  },
  {
    path: "/admin/send-notification-attendee/:id",
    exact: true,
    name: "SendSmsAttendee",
    component: SendSmsAttendee,
  },
  {
    path: "/admin/send-mail-attendee/:id",
    exact: true,
    name: "SendMailAttendee",
    component: SendMailAttendee,
  },
  {
    path: "/admin/all-attendee-list",
    exact: true,
    name: "AllAttendeeList",
    component: AllAttendeeList,
  },
  {
    path: "/admin/all-attendee/:id",
    exact: true,
    name: "AllAttendee",
    component: AllAttendee,
  },
  {
    path: "/admin/add-attendee/:id",
    exact: true,
    name: "AddAttendee",
    component: AddAttendee,
  },
  {
    path: "/admin/edit-attendee/:id",
    exact: true,
    name: "EditAttendee",
    component: EditAttendee,
  },
  {
    path: "/admin/view-attendee-details/:id",
    exact: true,
    name: "ViewAttendee",
    component: ViewAttendee,
  },
  {
    path: "/admin/add-skills",
    exact: true,
    name: "AddSkills",
    component: AddSkills,
  },
  {
    path: "/admin/sponsors",
    exact: true,
    name: "AllSponsors",
    component: AllSponsors,
  },
  {
    path: "/admin/add-sponsors/:id",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/admin/add-sponsor",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/admin/edit-sponsor/:id",
    exact: true,
    name: "EditSponsors",
    component: EditSponsors,
  },
  {
    path: "/admin/view-sponsor-details/:id",
    exact: true,
    name: "ViewSponsor",
    component: ViewSponsor,
  },
  {
    path: "/admin/sponsor-status",
    exact: true,
    name: "SponsorStatus",
    component: SponsorStatus,
  },
  {
    path: "/admin/email-manager",
    exact: true,
    name: "EmailManager",
    component: EmailManager,
  },
  {
    path: "/admin/mass-mailing",
    exact: true,
    name: "EmailMailing",
    component: EmailMailing,
  },
  {
    path: "/admin/all-contacts",
    exact: true,
    name: "AllContacts",
    component: AllContacts,
  },
  {
    path: "/admin/contact-status",
    exact: true,
    name: "ContactStatus",
    component: ContactStatus,
  },
  { path: "/admin/get-help", exact: true, name: "GetHelp", component: GetHelp },
  {
    path: "/admin/all-feedbacks",
    exact: true,
    name: "AllFeedbacks",
    component: AllFeedbacks,
  },

  { path: "/admin/faqs", exact: true, name: "Faqs", component: Faqs },
  {
    path: "/admin/settings",
    exact: true,
    name: "Settings",
    component: Settings,
  },
  {
    path: "/admin/all-reports",
    exact: true,
    name: "AllReports",
    component: AllReports,
  },
  {
    path: "/admin/reports",
    exact: true,
    name: "Reports",
    component: Reports,
  },
  {
    path: "/admin/activity-log",
    exact: true,
    name: "ActivityLog",
    component: ActivityLog,
  },
  {
    path: "/admin/blank",
    exact: true,
    name: "Blank",
    component: Blank,
  },
  {
    path: "/privacy-policy",
    exact: true,
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/terms-and-condition",
    exact: true,
    name: "TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    path: "/admin/blank",
    exact: true,
    name: "Blank",
    component: Blank,
  },
  {
    path: "/admin/404",
    exact: true,
    name: "Page404",
    component: Page404Dashboard,
  },
];

export default routes;
