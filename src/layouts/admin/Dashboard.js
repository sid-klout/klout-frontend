import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EventCard.css";
import { useSelector } from 'react-redux';

function Dashboard() {

  const authToken = useSelector(state => state.auth.token);
  
  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalSponsors, setTotalSponsors] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [upcomingEventsData, setUpcomingEventsData] = useState([]);


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    axios
      .post("/api/totalevents", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        setTotalEvents(response.data.total_events);
      })
      .catch((error) => {
        console.error("Error fetching event count:", error);
      });

    axios
      .post("/api/totalattendeesOrganizer", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        setTotalAttendees(response.data.total_attendees.length);
      })
      .catch((error) => {
        console.error("Error fetching attendee count:", error);
      });

    axios
      .post("/api/totalsponsors", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        setTotalSponsors(response.data.totalsponsors);
      })
      .catch((error) => {
        console.error("Error fetching attendee count:", error);
      });

    axios
      .post("/api/upcomingevents", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        setUpcomingEvents(response.data.upcoming_events);
        setUpcomingEventsData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching attendee count:", error);
      });

    axios.post("/api/events", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((res) => {
      if (res.data.status === 200) {
        setEvents(res.data.data);
      }
    });
  }, []);

  return (
    <>
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <Link
          to="/admin/add-event"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm mx-1"></i> Create New Event
        </Link>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row m-3">
        {/* <!-- Total Events --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div
            className="card border-left-primary shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Events</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalEvents}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Total Attendees --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div
            className="card border-left-success shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Attendees</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalAttendees}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Total Sponsors --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div
            className="card border-left-warning shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Sponsors</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalSponsors}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fa fa-solid fa-user-secret fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Upcoming Events --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div
            className="card border-left-danger shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Upcoming Events</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {upcomingEvents}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-support fa-table fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Upcoming Events--> */}
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Upcoming Events</h1>
        {upcomingEventsData.length > 0 && (
          <Link
            to="/admin/all-events"
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            View All Upcoming Events <i className="fa fa-arrow-right mx-1"></i>
          </Link>
        )}
      </div>

      <div className="row m-3">
        {/* <!-- Area Chart --> */}
        {upcomingEventsData.length > 0 ? (
          <div className="col-12">
            <div>
              <Slider {...settings}>
                {upcomingEventsData.map((item) => (
                  <div className="card event-card" key={item.id}>
                    <img
                      className="event-image"
                      src={imageBaseUrl + item.image}
                      alt={item.title}
                      style={{
                        borderRadius: "20px",
                        objectFit: "cover",
                        padding: "10px 8px",
                        width: "100%",
                      }}
                    />

                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.event_date}</p>
                      <p className="card-text">{item.location}</p>
                      <Link
                        to={`view-event/${item.uuid}`}
                        className="btn btn-primary"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : (
          <div className="card event-card p-3 text-center">No Data Found</div>
        )}
      </div>

      {/* <!-- All Events--> */}
      <div className="d-sm-flex d-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">All Events</h1>
        {events.length > 0 && (
          <Link
            to="/admin/all-events"
            className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "rgb(220 210 68)",
              borderColor: "rgb(220 210 68)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            View All Events <i className="fa fa-arrow-right"></i>
          </Link>
        )}
      </div>

      <div className="row m-3">
        {/* <!-- Area Chart --> */}
        {events.length > 0 ? (
          <div className="col-12">
            <div>
              <Slider {...settings}>
                {events.map((item) => (
                  <div className="card event-card" key={item.id}>
                    <div class="events-sec">
                      <img
                        className="event-image"
                        src={imageBaseUrl + item.image}
                        alt={item.title}
                        style={{
                          borderRadius: "20px",
                          objectFit: "cover",
                          padding: "10px 8px",
                          width: "100%",
                        }}
                      />

                      <div class="slick-img-content card-body">
                        {item.status === 0 && <p>Pending</p>}
                        {item.status === 1 && <p>Live</p>}
                        {item.status === 2 && <p>Cancelled</p>}
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.event_date}</p>
                      <p className="card-text">{item.location}</p>
                      <Link
                        to={`view-event/${item.uuid}`}
                        className="btn btn-primary"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : (
          <div className="card event-card p-3 text-center"> No Data Found</div>
        )}
      </div>

      {/* <!-- /.container-fluid --> */}
    </>
  );
}

export default Dashboard;
