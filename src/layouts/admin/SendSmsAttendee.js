import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Editor } from "@tinymce/tinymce-react";

import loadingGif from "../../assets/images/load.gif";

import DefaultBanner from "../../assets/images/default-banner.jpg";

function SendSmsAttendee(props) {
  const history = useHistory();

  const eventId = props.match.params.id;
  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0];

  //Dropdown for Time (Minute)- 00 to 60
  const minuteOptions = Array.from({ length: 61 }, (_, index) => {
    const value = index < 10 ? `0${index}` : `${index}`;
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  //Dropdown for Time (Hour)- 00 to 12
  const hourOptions = Array.from({ length: 12 }, (_, index) => {
    const value = (index + 1).toString().padStart(2, "0");
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  //12 Hours Interval till 96 hours
  const intervals = Array.from({ length: 24 }, (_, index) => (index + 1) * 1);

  const roles = [
    "All",
    "Speaker",
    "Delegate",
    "Sponsor",
    "Moderator",
    "Panelist",
  ];

  const [selectedRoles, setSelectedRoles] = useState(["All"]);

  const [event, setEvent] = useState({});

  const [readSMSMessage, setReadSMSMessage] = useState(false);
  const [readWhastAppMessage, setReadWhatsAppMessage] = useState(false);

  const [showAlert, setShowAlert] = useState(true);

  const [showInput, setShowInput] = useState(true);

  const [scheduleInput, setScheduleInput] = useState(false);

  const handleRoleChange = (event) => {
    const value = event.target.value;

    if (value === "All") {
      setSelectedRoles(["All"]); // Selecting "All" will deselect other roles
    } else {
      const updatedRoles = selectedRoles.includes("All")
        ? [value]
        : selectedRoles.includes(value)
        ? selectedRoles.filter((role) => role !== value)
        : [...selectedRoles, value];

      setSelectedRoles(updatedRoles);
      setFormInput({ ...formInput, send_to: updatedRoles });
    }
  };

  useEffect(() => {
    setFormInput({ ...formInput, send_to: selectedRoles });

    axios.get(`/api/display/${eventId}`).then((res) => {
      if (res.data.status === 200) {
        setEvent(res.data.data);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-events");
      }
    });
  }, [history, eventId]);

  const [formInput, setFormInput] = useState({
    event_id: eventId,
    send_to: null,
    send_method: "email",
    subject: "",
    message: "",
    start_date: currentDate,
    delivery_schedule: "now",
    start_date_time: "01",
    start_date_type: "am",
    end_date: currentDate,
    end_date_time: "01",
    end_date_type: "pm",
    no_of_times: "1",
    hour_interval: "1",
    status: 1,
  });

  const handleSendMethodChange = (event) => {
    if (event.target.value === "email") {
      setErrors({ message: "" });
      setShowInput(true);
      setReadSMSMessage(false);
      setReadWhatsAppMessage(false);
    } else if (event.target.value === "sms") {
      setErrors({ message: "" });

      setShowInput(false);
      setReadSMSMessage(true);
      setReadWhatsAppMessage(false);
    } else if (event.target.value === "whatsapp") {
      setErrors({ message: "" });

      setShowInput(false);
      setReadSMSMessage(false);
      setReadWhatsAppMessage(true);
    } else {
      setErrors({ message: "" });

      setShowInput(true);
      setReadSMSMessage(false);
      setReadWhatsAppMessage(false);
    }

    setFormInput({ ...formInput, send_method: event.target.value });
  };

  const handleDeliveryScheduleChange = (event) => {
    if (event.target.value === "later") {
      setScheduleInput(true);
    } else {
      setScheduleInput(false);
    }

    setFormInput({ ...formInput, delivery_schedule: event.target.value });
  };

  const handleInput = (e) => {
    e.persist();
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleStartDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    setFormInput({
      ...formInput,
      start_date: formattedDate,
    });
  };

  const handleLastDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    setFormInput({
      ...formInput,
      end_date: formattedDate,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    const currentDate = new Date();

    switch (name) {
      case "subject":
        if (value === "") {
          fieldErrors[name] = "Subject is required.";
        } else if (value.length > 500) {
          fieldErrors[name] = "Maximum 500 Characters Allowed.";
        }
        break;

      // case "message":
      //   if (value === "" && showInput) {
      //     fieldErrors[name] = "Message is required.";
      //   }
      //   break;

      case "start_date":
        if (value === "") {
          fieldErrors[name] = "Start Date is required.";
        } else if (value > event.event_start_date) {
          fieldErrors[name] = "Start Date should not greater Event Start Date.";
        }
        break;

      case "end_date":
        if (value === "") {
          fieldErrors[name] = "End Date is required.";
        } else if (value > event.event_end_date) {
          fieldErrors[name] = "End Date should not greater Event End Date.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const button = e.target;

    button.disabled = true;

    setIsLoading(true);

    const fieldErrors = {};

    if (formInput.send_to.length === 0) {
      fieldErrors.send_to = "Roles is required.";
    }

    if (formInput.send_method === "email") {
      if (
        formInput.subject === "" &&
        /^\s*$/.test(formInput.subject) &&
        formInput.subject.length === 0
      ) {
        fieldErrors.subject = "Subject is required.";
      } else if (formInput.subject.length > 500) {
        fieldErrors.subject = "Maximum 500 Characters Allowed.";
      }
    }

    if (formInput.start_date === "" || formInput.start_date === 0) {
      fieldErrors.start_date = "Start Date is required.";
    }
    //  else if (formInput.start_date > event.event_start_date) {
    //   fieldErrors.start_date =
    //     "Start Date should not greater Event Start Date.";
    // }
    else if (
      formInput.start_date !== "" &&
      formInput.start_date > formInput.end_date
    ) {
      fieldErrors.start_date = "Start Date is Invalid";
    }

    if (formInput.end_date === "" || formInput.end_date === 0) {
      fieldErrors.end_date = "End Date is required.";
    } else if (formInput.end_date > event.event_end_date) {
      fieldErrors.end_date = "End Date should not greater Event End Date.";
    } else if (
      formInput.end_date !== "" &&
      formInput.start_date > formInput.end_date
    ) {
      fieldErrors.end_date = "Start Date is Invalid";
    }

    if (Object.keys(fieldErrors).length === 0) {
      const formData = new FormData();

      formData.append("event_id", formInput.event_id);
      formData.append("send_to", formInput.send_to);
      formData.append("subject", formInput.subject);
      formData.append("send_method", formInput.send_method);
      formData.append(
        "message",
        formInput.message === "" ? "Template" : formInput.message
      );
      formData.append("start_date", formInput.start_date);
      formData.append("start_date_time", formInput.start_date_time);
      formData.append("start_date_type", formInput.start_date_type);
      formData.append("end_date", formInput.end_date);
      formData.append("end_date_time", formInput.end_date_time);
      formData.append("end_date_type", formInput.end_date_type);
      formData.append("no_of_times", formInput.no_of_times);
      formData.append("hour_interval", formInput.hour_interval);
      formData.append("delivery_schedule", formInput.delivery_schedule);

      axios
        .post(`/api/notifications`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setErrors({});

            history.push(`/admin/all-attendee/${eventId}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            setShowAlert(true);
            setErrors({ error: res.data.message });
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
            history.push("login");
          }
        })
        .finally(() => {
          setIsLoading(false);
          button.disabled = false;
        });
    } else {
      setErrors(fieldErrors);
    }
    setIsLoading(false);
  };

  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content, editor) => {
    setFormInput({ ...formInput, message: content });
  };

  return (
    <>
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
            <h1 className="h3 mb-0 text-gray-800">
              Send Email / SMS to Attendee{" "}
            </h1>
            <Link
              to={`/admin/all-attendee/${eventId}`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        <div className="col-12 col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Send Email / SMS to Attendee for {event.title}
              </h6>
            </div>
            <div className="card-body">
              {/* <h5 className="text-center">Send Email / SMS to Attendee</h5>
              <hr /> */}

              <form
                className="user"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {errors.error && showAlert && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {errors.error}
                    <br />

                    <button className="close" onClick={closeAlert}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}
                {/* Send Message To*/}
                <div className="form-group row">
                  <div className="col-12">
                    <label>Select Roles</label>

                    <div className="form-group mt-1">
                      {roles.map((role) => (
                        <div
                          className="form-check form-check-inline"
                          key={role}
                        >
                          <input
                            type="checkbox"
                            id={role}
                            name={role}
                            value={role}
                            checked={selectedRoles.includes(role)}
                            onChange={handleRoleChange}
                          />
                          <label className="form-check-label" forhtml={role}>
                            &nbsp; {role}
                          </label>
                        </div>
                      ))}

                      {errors.send_to && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: errors.send_to ? "block" : "none",
                            textAlign: "left",
                          }}
                        >
                          {errors.send_to}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Send Method */}
                <div className="form-group row">
                  <div className="col-12">
                    <label>Send By</label>

                    <div className="form-group ml-4">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="email"
                          checked={formInput.send_method === "email"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox3"
                        >
                          Email
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="sms"
                          checked={formInput.send_method === "sms"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox1"
                        >
                          SMS
                        </label>
                      </div>
                      <div className="form-check form-check-inline my-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="whatsapp"
                          checked={formInput.send_method === "whatsapp"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox2"
                        >
                          WhatsApp
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Subject */}
                {showInput && (
                  <div className="form-group row">
                    <div className="col-12 mb-sm-0">
                      <label forhtml="subject">Subject *</label>

                      <div className="form-group">
                        <input
                          className={`form-control ${
                            errors.subject ? "is-invalid" : ""
                          }`}
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          value={formInput.subject}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />
                        {errors.subject && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.subject}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Message */}
                {showInput && (
                  <div className="form-group row">
                    <div className="col-12">
                      <label>Message *</label>

                      <div className="form-group">
                        <Editor
                          apiKey="nv4qeg7zimei3mdz8lj1yzl5bakrmw4li6baiikh87f8vksz" // Get your API key from TinyMCE
                          value={formInput.message}
                          className={`form-control ${
                            errors.message ? "is-invalid" : ""
                          }`}
                          initialValue="<p>Please type here...</p>"
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
                          }}
                          onEditorChange={handleEditorChange}
                          onBlur={handleBlur}
                          // onFocus={handleInputFocus}
                        />

                        {errors.message && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {readSMSMessage && (
                  <div className="form-group row">
                    <div className="col-12">
                      <label> Your Message *</label>

                      <div className="form-group">
                        <div class="col-6">
                          <p
                            style={{
                              backgroundColor: "#efefef",
                              padding: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            Hi "<b>firstName</b>", just a reminder for our event
                            "<b>Event-Title</b>" on "<b>Event-Date-Time</b>".We
                            look forward to seeing you there! Regards, KloutClub
                            by Insightner Marketing Services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {readWhastAppMessage && (
                  <div className="form-group row">
                    <div className="col-12">
                      <label> Your Message *</label>

                      <div className="form-group">
                        <div class="col-6">
                          <p
                            style={{
                              backgroundColor: "#efefef",
                              padding: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            Hi "<b>firstName</b>", just a reminder for our event
                            "<b>Event-Title</b>" on "<b>Event-Date-Time</b>".We
                            look forward to seeing you there! Regards, KloutClub
                            by Insightner Marketing Services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Schedule */}
                <div className="form-group row">
                  <div className="col-12">
                    <label>Delivery Schedule</label>

                    <div className="form-group ml-4">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="delivery_schedule"
                          value="now"
                          checked={formInput.delivery_schedule === "now"}
                          onChange={handleDeliveryScheduleChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox3"
                        >
                          Now
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="delivery_schedule"
                          value="later"
                          checked={formInput.delivery_schedule === "later"}
                          onChange={handleDeliveryScheduleChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox1"
                        >
                          Later
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {scheduleInput && (
                  <>
                    {/* Start date End Date */}
                    <div className="form-group row">
                      <h6 className="text-title">
                        <b>Schedule Date & Time </b>
                      </h6>
                    </div>

                    <div className="form-group row">
                      <label forhtml="venue" className="col-form-label">
                        Start Date *
                      </label>

                      <div className="col-3">
                        <div className="form-group">
                          {/* <input
                        type="date"
                        className={`form-control ${
                          errors.start_date ? "is-invalid" : ""
                        }`}
                        name="start_date"
                        min={currentDate}
                        value={formInput.start_date}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      /> */}

                          <DatePicker
                            selected={formInput.start_date}
                            onChange={handleStartDateChange}
                            dateFormat="yyyy-MM-dd"
                            className={`form-control ${
                              errors.start_date ? "is-invalid" : ""
                            }`}
                            name="start_date"
                            minDate={new Date()} // or you can use minDate={currentDate}
                            value={formInput.start_date}
                            placeholderText="YYYY-MM-DD"
                            showTimeSelect={false}
                          />

                          {errors.start_date && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.start_date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-2">
                        <div className="form-group">
                          <select
                            className={`form-control ${
                              errors.start_time ? "is-invalid" : ""
                            }`}
                            name="start_date_time"
                            placeholder="Hour"
                            value={formInput.start_date_time}
                            onChange={handleInput}
                            onFocus={handleInputFocus}
                            onBlur={handleBlur}
                          >
                            {hourOptions}
                          </select>
                          {errors.start_date_time && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.start_date_time}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <div
                            className="form-check form-check-inline mx-3"
                            style={{ padding: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="radio"
                              name="start_date_type"
                              value="am"
                              checked={
                                formInput.start_date_type === "am" ||
                                formInput.start_date_type === "AM"
                              }
                              onChange={handleInput}
                              onFocus={handleInputFocus}
                            />
                            <label
                              className="form-check-label"
                              forhtml="inlineRadio1"
                            >
                              AM
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="start_date_type"
                              value="pm"
                              checked={
                                formInput.start_date_type === "pm" ||
                                formInput.start_date_type === "PM"
                              }
                              onChange={handleInput}
                              onFocus={handleInputFocus}
                            />
                            <label
                              className="form-check-label"
                              forhtml="inlineRadio2"
                            >
                              PM
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label forhtml="" className="col-form-label">
                        End Date *
                      </label>

                      <div className="col-3">
                        <div className="form-group">
                          <DatePicker
                            selected={formInput.end_date}
                            onChange={handleLastDateChange}
                            dateFormat="yyyy-MM-dd"
                            className={`form-control ${
                              errors.end_date ? "is-invalid" : ""
                            }`}
                            name="end_date"
                            minDate={new Date()} // or you can use minDate={currentDate}
                            value={formInput.end_date}
                            placeholderText="YYYY-MM-DD"
                            showTimeSelect={false}
                          />

                          {/* <input
                        type="date"
                        className={`form-control ${
                          errors.end_date ? "is-invalid" : ""
                        }`}
                        name="end_date"
                        min={currentDate}
                        value={formInput.end_date}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      /> */}

                          {errors.end_date && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.end_date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-2">
                        <div className="form-group">
                          <select
                            className={`form-control ${
                              errors.end_date_time ? "is-invalid" : ""
                            }`}
                            name="end_date_time"
                            placeholder="Hour"
                            value={formInput.end_date_time}
                            onChange={handleInput}
                            onFocus={handleInputFocus}
                            onBlur={handleBlur}
                          >
                            {hourOptions}
                          </select>

                          {errors.end_date_time && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.end_date_time}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <div
                            className="form-check form-check-inline mx-3"
                            style={{ padding: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="radio"
                              name="end_date_type"
                              value="am"
                              checked={
                                formInput.end_date_type === "am" ||
                                formInput.end_date_type === "AM"
                              }
                              onChange={handleInput}
                              onFocus={handleInputFocus}
                            />
                            <label
                              className="form-check-label"
                              forhtml="inlineRadio1"
                            >
                              AM
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="end_date_type"
                              value="pm"
                              checked={
                                formInput.end_date_type === "pm" ||
                                formInput.end_date_type === "PM"
                              }
                              onChange={handleInput}
                              onFocus={handleInputFocus}
                            />
                            <label
                              className="form-check-label"
                              forhtml="inlineRadio2"
                            >
                              PM
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-5">
                        <div className="form-group">
                          Notification should be sent once every
                        </div>
                      </div>

                      {/* <div className="col-1">
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className={`form-control ${
                          errors.no_of_times ? "is-invalid" : ""
                        }`}
                        name="no_of_times"
                        placeholder="Hour"
                        value={formInput.no_of_times}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                        readOnly
                      />

                      {errors.no_of_times && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.no_of_times}
                        </div>
                      )}
                    </div>
                  </div> */}

                      {/* <div className="col-2">
                    <div className="form-group">Time Every</div>
                  </div> */}

                      <div className="col-2">
                        <div className="form-group">
                          <select
                            className={`form-control ${
                              errors.hour_interval ? "is-invalid" : ""
                            }`}
                            name="hour_interval"
                            value={formInput.hour_interval}
                            onChange={handleInput}
                            onFocus={handleInputFocus}
                          >
                            {intervals.map((interval) => (
                              <option key={interval} value={interval}>
                                {interval}
                              </option>
                            ))}
                          </select>

                          {errors.hour_interval && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.hour_interval}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-2">
                        <div className="form-group">
                          {" "}
                          {formInput.hour_interval > 1 ? "Hours" : "Hour"}.
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="form-group row">
                  <div className="col-11 mt-4">
                    {/* <button
                      className="btn btn-primary btn-user btn-sm"
                      style={{
                        backgroundColor: "rgb(176 166 166)",
                        borderColor: "rgb(176 166 166)",
                        fontSize: "14px",
                        padding: "1% 6%",
                        float: "left",
                      }}
                      disabled={true}
                    >
                      {isLoading ? (
                        <img
                          src={loadingGif}
                          alt="Loading..."
                          style={{ width: "20px", height: "20px" }}
                        />
                      ) : (
                        "Save Draft"
                      )}
                    </button> */}

                    <button
                      className="btn btn-primary btn-user btn-lg"
                      style={{
                        // backgroundColor: "#F5007E",
                        // borderColor: "#F5007E",
                        fontSize: "14px",
                        padding: "1% 6%",
                        float: "left",
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <img
                          src={loadingGif}
                          alt="Loading..."
                          style={{ width: "20px", height: "20px" }}
                        />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {event && (
          <div className="col-12 col-lg-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Event Details
                </h6>
              </div>

              <div className="row p-4">
                <div
                  className="col-12"
                  style={{ borderRight: "2px solid #dbdbdb" }}
                >
                  <div
                    className="image-container mb-2"
                    style={{
                      position: "relative",
                      opacity: "1",
                      border: "1px solid #efefef",
                      borderRadius: "20px",
                    }}
                  >
                    {event.image ? (
                      <img
                        src={imageBaseUrl + event.image}
                        width="100%"
                        alt="EventLogo"
                        style={{ borderRadius: "14px", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        src={DefaultBanner}
                        width="884"
                        alt="EventLogo"
                        style={{ borderRadius: "14px" }}
                      />
                    )}

                    {/* <div
                    className="text-overlay"
                    style={{
                      position: "absolute",
                      bottom: "1%",
                      left: "1%",
                      textAlign: "left",
                      padding: "20px",
                    }}
                  >
                    <h2>{event.title}</h2>
                  
                  </div> */}
                  </div>
                  <div className="text-overlay">
                    <h5>
                      {event.title}

                      <Link
                        to={`/admin/view-event/${eventId}`}
                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                        style={{
                          backgroundColor: "#F5007E",
                          borderColor: "#F5007E",
                          color: "white",
                          borderRadius: "12px",
                          float: "right",
                          margin: "8px",
                        }}
                      >
                        Click Here to View Event &nbsp;
                        <i className="fa fa-arrow-right"></i>
                      </Link>
                    </h5>
                  </div>
                </div>

                {/* <div className="col-12">
                  <div style={{ padding: "20px" }}>
                    <b>Event QR Code</b>

                    <div
                      style={{
                        padding: "10px",
                        border: "2px solid #efefef",
                        width: "80%",
                      }}
                    >
                      {event.qr_code ? (
                        <img
                          src={imageBaseUrl + event.qr_code}
                          width="120px"
                          alt="QrCode"
                        />
                      ) : (
                        <img src={QrCode} alt="banner" width="100%" />
                      )}
                    </div>

                    <span style={{ fontSize: "11px" }}>Scan to Know More</span>
                  </div>
                </div> */}
              </div>

              <div className="row">
                <div className="col-12 mb-1">
                  <div
                    style={{
                      border: "2px solid #f6f6f6",
                      width: "90%",
                      margin: "auto",
                      backgroundColor: "#f6f6f6",
                      borderradius: "8px",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                      }}
                    >
                      <h6 className="">
                        <b>Date</b>
                      </h6>
                      <p>
                        Start Date - {event.event_start_date}
                        <br />
                        End Date - {event.event_end_date}
                      </p>

                      <h6 className="">
                        <b>Time</b>
                      </h6>

                      <p className="">
                        {" From "} {event.start_time}:{event.start_minute_time}{" "}
                        {event.start_time_type} {" - "}
                        {event.end_time}:{event.end_minute_time}{" "}
                        {event.end_time_type}
                      </p>

                      <h6 className="">
                        <b>Location</b>{" "}
                      </h6>
                      <p>
                        {event.event_venue_name}
                        {", "} {event.event_venue_address_1}
                        {", "} {event.city}
                        {", "} {event.state}
                        {", "} {event.country}
                        {", "} {event.pincode}
                      </p>
                    </div>
                    {/* <hr /> */}
                    <div
                      style={{
                        padding: "10px",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="col-12 pt-1" style={{ padding: "0 2rem" }}>
                  <h5>
                    <b>Description</b>
                  </h5>
                  <p>{event.description}</p>
                  {/* 
                <h6 className=""> Location </h6>
                <p>
                  {event.event_venue_name}
                  {", "} {event.venue_address_1}
                  {", "} {event.city}
                  {", "} {event.state}
                  {", "} {event.country}
                  {", "} {event.pincode}
                </p> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SendSmsAttendee;
