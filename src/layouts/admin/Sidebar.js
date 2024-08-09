import axios from "axios";
import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  useHistory,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import swal from "sweetalert";
import routes from "../../routes/routes";
import MasterLayout from "./MasterLayout";
import Home from "../../components/Home";
import AllEvent from "./AllEvent";
import Swal from "sweetalert2";

import { useSelector,useDispatch } from "react-redux";
import { logoutSuccess } from "../../authActions";

// import Logo from "../../assets/img/klout_logo.png";
// import Logo from "./../../assets/img/Klout-Club.svg";
// import mobileLogo from "../../assets/img/klout_mobile_logo.jpg";

import Logo from "./../../assets/img/Klout-Club-whitelogo.png";

import mobileLogo from "./../../assets/img/Klout-Club-whitelogo.png";

function Sidebar({ menuOpen, setMenuOpen, toggleMenu }) {
  const authToken = useSelector(state => state.auth.token);
  const history = useHistory();
  const [logoPath, setLogoPath] = useState(null)

  const dispatch = useDispatch();



  useEffect(() => {
    axios.post(`/api/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.user)
        // setFormInput(res.data.user);
        setLogoPath(res.data.user.company_logo)

      }
    });
  }, []);

  //for mobile view
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 768;

  const logoutSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title:
        '<span style="font-size: 24px;">Are you sure want to Logout?</span>',
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/logout`).then(function (res) {
          if (res.data.status === 200) {
            dispatch(logoutSuccess());

            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });

            history.push("/login");

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        });
      }
    });
  };

  return (
    <>
      <ul
        // className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${
          menuOpen ? "toggled" : ""
        }`}
        id="accordionSidebar"
      >
        {/* <!-- Sidebar - Brand --> */}
        <Link
          to="/organiser/admin/dashboard"
          className="sidebar-brand d-flex align-items-center justify-content-center"
          style={{
            padding: "0px",
          }}
        >
          <div className="sidebar-brand-icon rotate-n-15"></div>
          <div className="sidebar-brand-text mx-3">
            <img
              className="sidebar-card-illustration mb-2"

              style={{width: '150px', marginTop: '15px'}}
              src={logoPath? `https://api.klout.club/${logoPath}`: Logo}
              // src={logoPath? `https://api.klout.club/uploads/companylogo/1720532777.jpg`: Logo}
              // src={logoPath? `https://api.klout.club/uploads/companylogo/1720609835.jpg`: Logo}
              

              alt="Klout Club"
              // style={{ 
              //   height: "60px",
              //   width: "100%",
              //   background: "#efefef",
              //   marginTop: "1.5rem",
              // }}
            />
          </div>
        </Link>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item active">
          <Link to="/organiser/admin/dashboard" className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Events</div>

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTwo1"
            aria-expanded="true"
            aria-controls="collapseTwo1"
          >
            <i className="fa fa-solid fa-calendar"></i>
            <span>Events</span>
          </a>
          <div
            id="collapseTwo1"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link to="/organiser/admin/all-events" className="collapse-item">
                All Events
              </Link>
              <Link to="/organiser/admin/add-event" className="collapse-item">
                Create New Event
              </Link>
            </div>
          </div>
        </li>

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
        <li className="nav-item">
          <Link to="/organiser/admin/all-attendee-list" className="nav-link">
            <i className="fa fa-solid fa-users"></i>
            <span>All Attendees</span>
          </Link>

          <Link to="/organiser/admin/sponsors" className="nav-link">
            <i className="fa fa-solid fa-user-secret"></i>
            <span>All Sponsors</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Utilities Collapse Menu --> */}
        {/* <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fa fa-solid fa-inbox"></i>
            <span>Utilities</span>
          </a>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Email Manager:</h6>
              <Link to="/organiser/admin/email-manager" className="collapse-item">
                Email Manager
              </Link>
              <Link to="/organiser/admin/mass-mailing" className="collapse-item">
                Mass Mailing
              </Link>
            </div>
          </div>
        </li> */}

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Addons</div>

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
        {/* <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapsePages"
            aria-expanded="true"
            aria-controls="collapsePages"
          >
            <i className="fas fa-fw fa-folder"></i>
            <span>All Contacts</span>
          </a>
          <div
            id="collapsePages"
            className="collapse"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              {/* <h6 className="collapse-header">Login Screens:</h6> */}
        {/* <Link to="/organiser/admin/all-contacts" className="collapse-item">
                All Contacts
              </Link>
              <Link to="/organiser/admin/contact-status" className="collapse-item">
                Contact Status
              </Link>
            </div>
          </div>
        </li> */}

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
        {/* <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseThree"
            aria-expanded="true"
            aria-controls="collapseThree"
          >
            <i className="fa fa-solid fa-database"></i>
            <span>Mapping Data</span>
          </a>
          <div
            id="collapseThree"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link to="/organiser/admin/add-skills" className="collapse-item">
                Add Skills
              </Link>
              <Link to="/organiser/admin/add-country" className="collapse-item">
                Add Country
              </Link>
              <Link to="/organiser/admin/add-state" className="collapse-item">
                Add State
              </Link>
              <Link to="/organiser/admin/add-city" className="collapse-item">
                Add City
              </Link>
              <Link to="/organiser/admin/add-industry" className="collapse-item">
                Add Industry
              </Link>
              <Link to="/organiser/admin/add-company" className="collapse-item">
                Add Company
              </Link>
              <Link to="/organiser/admin/add-job-title" className="collapse-item">
                Add Job Title
              </Link>
            </div>
          </div>
        </li> */}

        <li className="nav-item">
          <Link className="nav-link" to="/organiser/admin/all-reports">
            <i class="fa fa-flag" aria-hidden="true"></i>
            <span>All Reports</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/organiser/admin/all-feedbacks">
            <i className="fas fa-table"></i>
            <span>Feedbacks</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Charts --> */}
        <li className="nav-item">
          <Link className="nav-link" to="/organiser/admin/get-help">
            <i className="fas fa-hands-helping"></i>
            <span>Get Help</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Tables --> */}
        <li className="nav-item">
          <Link className="nav-link" to="/organiser/admin/faqs">
            <i className="fa fa-solid fa-question"></i>
            <span>FAQ's</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Logout --> */}
        <li className="nav-item">
          <button className="nav-link" onClick={logoutSubmit}>
            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            <span>Logout</span>
          </button>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>

        {/* <!-- Sidebar Message --> */}
        {/* <div className="sidebar-card d-none d-lg-flex"> */}
        {/* <img
            className="sidebar-card-illustration mb-2"
            src="assets/img/undraw_rocket.svg"
            alt="..."
          /> */}
        {/* <p className="text-center mb-2">
            <strong>Klout Club Pro</strong> is packed with premium features,
            components, and more!
          </p>
          <Link className="btn btn-success btn-sm" to="/upgrade">
            Upgrade to Pro!
          </Link> */}
        {/* </div> */}
      </ul>
    </>
  );
}

export default Sidebar;
