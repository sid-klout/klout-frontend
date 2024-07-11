import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import Banner from "../../assets/images/event_1879044253.jpg";
// import QrCode from "../../assets/images/Qr.png";
// import { format } from "date-fns";
import swal from "sweetalert";
import Defaultuser from "../../assets/images/defaultuser.png";

function ViewAgenda() {
  // const history = useHistory();
//   const navigate = useNavigate();

  //Attendee ID
  const id = useParams().id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [agenda, setAgenda] = useState(null);

  const [eventId, setEventId] = useState(null);
  
  // const [eventdate, setEventDate] = useState({});

  useEffect(() => {
    axios.get(`/api/agendas/${id}`).then((res) => {
      if (res.data.status === 200) {
        setAgenda(res.data.data);
        console.log(imageBaseUrl + res.data.data.image_path);
        setEventId(res.data.event_id);
      } else if (res.data.status === 400) {
        swal("Warning", res.data.message, "warning");
        // history.push("admin/all-attendee");
      }
    });
  }, [id]);

  const capitalizeWord = (str) => {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };

  if (!agenda) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <!-- Page Heading --> */}

      <div className="row">
        <div
          className="col-12"
          style={{
            backgroundColor: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
          }}
        >
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Agenda Details</h1>
            <button
            //   to={`/admin/all-agendas/${uuid}`}
            onClick={() => {window.history.back();}}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i class="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4 p-4">
            <div className="row">
              <div
                className="col-12 col-lg-4 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <div className="image-container p-4">
                  {agenda.image_path ? (
                    <img
                      src={imageBaseUrl + agenda.image_path}
                      width="200"
                      alt={agenda.image_path}
                      style={{ borderRadius: "14px" }}
                    />
                  ) : (
                    <img
                      src={Defaultuser}
                      width="200"
                      alt={"default-user"}
                      style={{ borderRadius: "14px" }}
                    />
                  )}
                </div>
              </div>

              <div
                className="col-12 col-md-12 col-lg-8 user-container p-4 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <p>
                  <b>Title : </b>
                  {capitalizeWord(agenda.title)}
                  {/* {" "}
                  {capitalizeWord(agenda.last_name)} */}
                </p>
                <p>
                  <b> Description : </b> {agenda.description}
                </p>
                <p>
                  <b> Event Date : </b>
                  {agenda.event_date}
                </p>

                <p>
                  <b> Event Time : </b>
                  {agenda.start_time+ ':'+ agenda.start_minute_time + ' ' + agenda.start_time_type.toUpperCase() + ' ' + '-' + ' ' + agenda.end_time + ':'+ agenda.end_minute_time + ' ' +  agenda.end_time_type.toUpperCase()}
                </p>

                {/* <p>
                  <b>LinkedIn Profile Link: </b>
                </p>
                <p>
                  {agenda.linkedin_page_link &&
                    agenda.linkedin_page_link !== "null" && (
                      <a
                        href={agenda.linkedin_page_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {agenda.linkedin_page_link}
                      </a>
                    )}
                </p> */}
              </div>

              {/* <div className="col-12 col-md-12 col-lg-4 p-4">
                <p>
                  <b>Job Title : </b>
                  {agenda.job_title}
                </p>

                <p>
                  <b>Company Name : </b>
                  {capitalizeWord(agenda.company_name)}
                </p>

                <p>
                  <b> Industry : </b>
                  {capitalizeWord(agenda.industry)}
                </p>

                <p>
                  <b> Website : </b>
                  {agenda.website && agenda.website !== "null" && (
                    <a
                      href={agenda.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {agenda.website}
                    </a>
                  )}
                </p>

                <p>
                  <b>Employee Size: </b>
                  {agenda.employee_size}
                </p>

                <p>
                  <b>Company Turn Over : </b>
                  {agenda.company_turn_over}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAgenda;
