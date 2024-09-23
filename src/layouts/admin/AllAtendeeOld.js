import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import loadingGif from "../../assets/images/load.gif";

function AllAttendee(props) {
  const [loading, setLoading] = useState(false);
  const [attendees, setAddendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [excelAttendees, setExcelAttendees] = useState([]);

  const [event, setEvent] = useState([]);

  const [search, setSearch] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [emailIDFilter, setEmailIDFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [checkinFilter, setCheckinFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // Add state for role filter
  const [currentPage, setCurrentPage] = useState(1);

  const [forward, setIsForwarding] = useState(false);

  const itemsPerPage = 10;

  const [event_id, setEventID] = useState(props.match.params.id);

  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    axios.post(`/api/totalattendees/${event_id}`).then((res) => {
      if (res.data.status === 200) {
        setAddendees(res.data.data);
        setFilteredAttendees(res.data.data);
        setExcelAttendees(res.data.excel_data);
      }
      setLoading(false);
    });

    axios.get(`/api/events/${event_id}`).then((res) => {
      if (res.data.status === 200) {
        setEvent(res.data.data);

        // Get the current date
        const currentDate = new Date();

        // Convert event_end_date to a Date object
        const eventEndDateObj = new Date(res.data.data.event_end_date);

        // Compare the dates
        if (eventEndDateObj < currentDate) {
          setIsPast(true);
        } else {
          setIsPast(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    // Apply filters whenever name, email, phoneFilter or roleFilter changes
    const filtered = attendees.filter((attendee) => {
      const firstnameMatch = attendee.first_name
        .toLowerCase()
        .includes(firstNameFilter.toLowerCase());

      const emailMatch = attendee.email_id
        .toLowerCase()
        .includes(emailIDFilter.toLowerCase());

      const companyMatch = attendee.company_name
        .toLowerCase()
        .includes(companyFilter.toLowerCase());

      const checkinMatch =
        checkinFilter === "" || 
        (checkinFilter === "1" && attendee.check_in == 1) ||
        (checkinFilter === "0" && attendee.check_in == 0);

      const roleMatch =
        roleFilter === "All" || attendee.status.toLowerCase() === roleFilter.toLowerCase();

      return firstnameMatch && emailMatch && companyMatch && checkinMatch && roleMatch;
    });

    // Apply search filter
    const searchFiltered = filtered.filter((attendee) =>
      attendee.first_name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredAttendees(searchFiltered);
  }, [firstNameFilter, emailIDFilter, companyFilter, checkinFilter, roleFilter, search, attendees]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredAttendees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    // Convert attendee data to Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelAttendees);

    // Create a workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");

    // Export the workbook to Excel file
    XLSX.writeFile(workbook, "attendee_list.xlsx");
  };

  const capitalizeWord = (str) => {
    return str;
  };

  const sendAttendeeListByEmail = (e, id) => {
    e.preventDefault();

    const button = e.target;

    button.disabled = true;

    setIsForwarding(true);

    const file_type = "pdf";

    const formData = new FormData();

    formData.append("event_id", id);
    formData.append("file_type", file_type);

    axios
      .post("/api/send_attendee_list_by_email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");
        } else if (res.data.status === 422) {
          swal("Warning", res.data.message, "warning");
        }
      })
      .finally(() => {
        setIsForwarding(false);
        button.disabled = false;
      });
  };

  const deleteAttendee = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/attendees/${id}`)
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            thisClicked.closest("tr").remove();
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "An Error Occured!",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  let AttendeeList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    AttendeeList = paginatedData.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{capitalizeFirstLetter(item.first_name)}</td>
          <td>{capitalizeFirstLetter(item.last_name)}</td>
          <td>{capitalizeFirstLetter(item.job_title)}</td>
          <td>{capitalizeFirstLetter(item.company_name)}</td>
          <td>{item.email_id}</td>
          <td>{item.phone_number === null ? "" : item.phone_number}</td>
          <td>{capitalizeFirstLetter(item.status)}</td>
          <td>{item.check_in == 1 ? "Yes" : "No"}</td>
          <td className="d-flex">
            <Link
              to={`/organiser/admin/view-attendee-details/${item.uuid}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Attendee Detail"
              className="btn btn-sm btn-info btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i className="fas fa-eye"></i>
            </Link>
            &nbsp; &nbsp;
            <Link
              to={`/organiser/admin/edit-attendee/${item.uuid}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Edit Attendee"
              className="btn btn-sm btn-primary btn-circle"
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-edit"></i>
            </Link>
            &nbsp; &nbsp;
            <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Attendee"
              className="btn btn-sm btn-danger btn-circle"
              onClick={(e) => deleteAttendee(e, item.id)}
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  function capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.slice(1);
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          All Attendees for Event - {event.title} - Total Attendee - {attendees.length}
        </h1>

        <div className="d-none d-sm-inline-block shadow-sm py-3 px-3">
          <Link
            to={`/organiser/admin/all-events`}
            className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
          </Link>
          &nbsp; &nbsp;
          <Link
            to={`/organiser/admin/add-attendee/${event_id}`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-user-plus"></i> &nbsp; Add Attendee or
            Import Excel
          </Link>
          {attendees.length > 0 && (
            <>
              &nbsp; &nbsp;
              <Link
                to={`/organiser/admin/send-notification-attendee/${event_id}`}
                className="btn btn-sm btn-info shadow-sm my-2"
                style={{
                  borderColor: "#0dcaf0",
                  color: "white",
                  borderRadius: "12px",
                }}
              >
                <i className="fa fa-solid fa-paper-plane"></i> &nbsp; Send
                Reminder
              </Link>
              &nbsp; &nbsp;
              <Link
                to={`/organiser/admin/send-notification-attendee-invitation/${event_id}`}
                className="btn btn-sm btn-dark shadow-sm my-2"
                style={{
                  borderColor: "#0dcaf0",
                  color: "white",
                  borderRadius: "12px",
                }}
              >
                <i className="fa fa-solid fa-paper-plane"></i> &nbsp; Send
                Invitation
              </Link>
              &nbsp; &nbsp;
              <Link
                to={`/organiser/admin/send-notification-attendee-samedayinvitaion/${event_id}`}
                className="btn btn-sm btn-warning shadow-sm my-2"
                style={{
                  borderColor: "#0dcaf0",
                  color: "white",
                  borderRadius: "12px",
                }}
              >
                <i className="fa fa-solid fa-paper-plane"></i> &nbsp; Send
                Same Day Reminder
              </Link>
              &nbsp; &nbsp;
              <Link
                onClick={(e) => sendAttendeeListByEmail(e, event_id)}
                className="btn btn-sm btn-danger shadow-sm my-2"
                style={{
                  borderColor: "#0dcaf0",
                  color: "white",
                  borderRadius: "12px",
                }}
                disabled={forward}
              >
                {forward ? (
                  <>
                    <img
                      src={loadingGif}
                      alt="Loading..."
                      style={{ width: "20px", height: "20px" }}
                    />
                    &nbsp; Sending Now
                  </>
                ) : (
                  <>
                    <i className="fa fa-solid fa-paper-plane"></i>
                    &nbsp; Forward List to Sponsors
                  </>
                )}
              </Link>
              &nbsp; &nbsp;
            </>
          )}
          &nbsp; &nbsp;
          <Link
            to={`/organiser/admin/pending-attendee/${event_id}`}
            className="btn btn-sm btn-info shadow-sm my-2"
            style={{
              borderColor: "#0dcaf0",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-user"></i> &nbsp; Pending User Request
          </Link>
        </div>
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Attendee List</h6>
          </div>
          <div className="card-body">
            <div className="row pb-4">
              <div className="col-12 col-lg-3 mb-3">
                <input
                  type="text"
                  placeholder="Filter by First Name"
                  value={firstNameFilter}
                  className="form-control"
                  onChange={(e) => setFirstNameFilter(e.target.value)}
                />
              </div>

              <div className="col-12 col-lg-3 mb-3">
                <input
                  type="text"
                  placeholder="Filter by Email"
                  value={emailIDFilter}
                  className="form-control"
                  onChange={(e) => setEmailIDFilter(e.target.value)}
                />
              </div>

              <div className="col-12 col-lg-3 mb-3">
                <input
                  type="text"
                  placeholder="Filter by Company"
                  value={companyFilter}
                  className="form-control"
                  onChange={(e) => setCompanyFilter(e.target.value)}
                />
              </div>

              <div className="col-12 col-lg-3 mb-3">
                <select
                  value={checkinFilter}
                  className="form-control"
                  onChange={(e) => setCheckinFilter(e.target.value)}
                >
                  <option value="">Filter by Check In</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div className="col-12 col-lg-3 mb-3">
                <select
                  value={roleFilter}
                  className="form-control"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Delegate">Delegate</option>
                  <option value="Sponsor">Sponsor</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Panelist">Panelist</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="col-12 col-lg-3">
                {attendees.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="btn btn-success"
                    style={{
                      color: "white",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="fa fa-solid fa-download"></i> &nbsp; Export to
                    Excel
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Attendee-ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Designation</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Role</th>
                    <th>Check In</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {AttendeeList.length > 0 ? (
                    AttendeeList
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={9}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <nav aria-label="Page navigation comments" className="mt-4">
                {filteredAttendees.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(
                      filteredAttendees.length / itemsPerPage
                    )}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                  />
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllAttendee;