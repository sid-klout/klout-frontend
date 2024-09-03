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
import AllAgenda from "../layouts/admin/AllAgenda";
import AddAgenda from "../layouts/admin/AddAgenda";
import ViewAgenda from "../layouts/admin/ViewAgenda";
import EditAgenda from "../layouts/admin/EditAgenda";
import AllPendingAttendee from "../layouts/admin/AllPendingAttendee";
import SendWhatsappAttendee from "../layouts/admin/SendWhatsappAttendee";
import SendSamedayinvitationAttendee from "../layouts/admin/SendSamedayinvitationAttendee";
import CheckInForm from "../components/CheckInForm";
import WhatsappReport from "../layouts/admin/WhatsappReport";

const routes = [
  { path: "/admin", exact: true, name: "Admin", component: Dashboard },
  {
    path: "/organiser/admin/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  { path: "/organiser/admin/profile", exact: true, name: "Profile", component: Profile },
  {
    path: "/organiser/admin/change-password",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
  },
  { path: "/organiser/admin/add-event", exact: true, name: "Event", component: Event },
  {
    path: "/organiser/admin/all-events",
    exact: true,
    name: "AllEvent",
    component: AllEvent,
  },
  {
    path: "/organiser/admin/view-event/:id",
    exact: true,
    name: "ViewEvent",
    component: ViewEvent,
  },
  {
    path: "/organiser/admin/edit-event/:id",
    exact: true,
    name: "EditEvent",
    component: EditEvent,
  },
  {
    path: "/organiser/admin/send-notification-attendee/:id",
    exact: true,
    name: "SendSmsAttendee",
    component: SendSmsAttendee,
  },
  {
    path: "/organiser/admin/send-notification-attendee-invitation/:id",
    exact: true,
    name: "SendWhatsappAttendee",
    component: SendWhatsappAttendee,
  },
  {
    path: "/organiser/admin/send-notification-attendee-samedayinvitaion/:id",
    exact: true,
    name: "SendSamedayinvitationAttendee",
    component: SendSamedayinvitationAttendee,
  },
  {
    path: "/organiser/admin/send-mail-attendee/:id",
    exact: true,
    name: "SendMailAttendee",
    component: SendMailAttendee,
  },
  {
    path: "/organiser/admin/all-attendee-list",
    exact: true,
    name: "AllAttendeeList",
    component: AllAttendeeList,
  },
  {
    path: "/organiser/admin/all-attendee/:id",
    exact: true,
    name: "AllAttendee",
    component: AllAttendee,
  },
  {
    path: "/organiser/admin/add-attendee/:id",
    exact: true,
    name: "AddAttendee",
    component: AddAttendee,
  },
  {
    path: "/organiser/admin/edit-attendee/:id",
    exact: true,
    name: "EditAttendee",
    component: EditAttendee,
  },
  {
    path: "/organiser/admin/view-attendee-details/:id",
    exact: true,
    name: "ViewAttendee",
    component: ViewAttendee,
  },
  {
    path: "/organiser/admin/add-skills",
    exact: true,
    name: "AddSkills",
    component: AddSkills,
  },
  {
    path: "/organiser/admin/sponsors",
    exact: true,
    name: "AllSponsors",
    component: AllSponsors,
  },
  {
    path: "/organiser/admin/add-sponsors/:id",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/organiser/admin/add-sponsor",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/organiser/admin/edit-sponsor/:id",
    exact: true,
    name: "EditSponsors",
    component: EditSponsors,
  },
  {
    path: "/organiser/admin/view-sponsor-details/:id",
    exact: true,
    name: "ViewSponsor",
    component: ViewSponsor,
  },
  {
    path: "/organiser/admin/sponsor-status",
    exact: true,
    name: "SponsorStatus",
    component: SponsorStatus,
  },
  {
    path: "/organiser/admin/email-manager",
    exact: true,
    name: "EmailManager",
    component: EmailManager,
  },
  {
    path: "/organiser/admin/mass-mailing",
    exact: true,
    name: "EmailMailing",
    component: EmailMailing,
  },
  {
    path: "/organiser/admin/all-contacts",
    exact: true,
    name: "AllContacts",
    component: AllContacts,
  },
  {
    path: "/organiser/admin/contact-status",
    exact: true,
    name: "ContactStatus",
    component: ContactStatus,
  },
  { path: "/organiser/admin/get-help", exact: true, name: "GetHelp", component: GetHelp },
  {
    path: "/organiser/admin/all-feedbacks",
    exact: true,
    name: "AllFeedbacks",
    component: AllFeedbacks,
  },

  { path: "/organiser/admin/faqs", exact: true, name: "Faqs", component: Faqs },
  {
    path: "/organiser/admin/settings",
    exact: true,
    name: "Settings",
    component: Settings,
  },
  {
    path: "/organiser/admin/all-reports",
    exact: true,
    name: "AllReports",
    component: AllReports,
  },
  {
    path: "/organiser/admin/reports",
    exact: true,
    name: "Reports",
    component: Reports,
  },
  {
    path: "/organiser/admin/activity-log",
    exact: true,
    name: "ActivityLog",
    component: ActivityLog,
  },
  {
    path: "/organiser/admin/blank",
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
    path: "/organiser/admin/blank",
    exact: true,
    name: "Blank",
    component: Blank,
  },
  {
    path: "/organiser/admin/404",
    exact: true,
    name: "Page404",
    component: Page404Dashboard,
  },
  {
    path: "/organiser/admin/all-agenda/:id",
    exact: true,
    name: "AllAgenda",
    component: AllAgenda,
  },
  {
    path: "/organiser/admin/add-agenda/:id",
    exact: true,
    name: "AddAgenda",
    component: AddAgenda,
  },
  {
    path: "/organiser/admin/view-agenda-details/:id",
    exact: true,
    name: "ViewAgenda",
    component: ViewAgenda,
  },
  {
    path: "/organiser/admin/edit-agenda/:id",
    exact: true,
    name: "EditAgenda",
    component: EditAgenda,
  },
  {
    path: "/organiser/admin/pending-attendee/:id",
    exact: true,
    name: "AllPendingAttendee",
    component: AllPendingAttendee,
  },
  {
    path: "/organiser/admin/whatsapp-report/:id",
    exact: true,
    name: "WhatsappReport",
    component: WhatsappReport,
  },
  
];

export default routes;
