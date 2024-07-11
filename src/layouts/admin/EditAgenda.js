import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function EditAgenda(props) {
  const history = useHistory();

  const uuid = props.match.params.id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [eventId, setEventId] = useState("");

  const [orginalEventId, setOrginalEventId] = useState(null);
  // const [file, setFile] = useState(null);
  // const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    image_path: null,
    event_id: eventId,
    event_date: "",
    start_time: "",
    start_minute_time: "",
    start_time_type: "",
    end_minute_time: "",
    end_time: "",
    end_time_type: "",
    position: "",
    image: null,
    new_image: null,
  });



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

         //Dropdown for Time (Hour)- 00 to 12
         const priorityOption = Array.from({ length: 100 }, (_, index) => {
          const value = (index + 1).toString().padStart(2, "0");
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        });

  useEffect(() => {
    axios.get(`/api/agendas/${uuid}`).then((res) => {
      if (res.data.status === 200) {
        setEventId(res.data.data.event_id);
        setFormInput(res.data.data);
        console.log(res.data.data)
        // setOrginalEventId(res.data.event_id);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-agendas");
      }
    });
  }, [uuid]);

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
        case "title":
          if (value === "") {
            fieldErrors[name] = "Title is required.";
          } 
          // else if (!/^[a-zA-Z\s]*$/.test(value)) {
          //   fieldErrors[name] =
          //     "First Name should only contain alphabets and spaces.";
          // } else if (value.length > 30) {
          //   fieldErrors[name] = "Maximum 30 Characters Allowed.";
          // }
          break;
  
        case "description":
          if (value === "") {
            fieldErrors[name] = "Description is required.";
          } 
          // else if (!/^[a-zA-Z\s]*$/.test(value)) {
          //   fieldErrors[name] =
          //     "Description should only contain alphabets and spaces.";
          // } else if (value.length > 30) {
          //   fieldErrors[name] = "Maximum 30 Characters Allowed.";
          // }
          break;
        case "event_date":
          if (value === "") {
            fieldErrors[name] = "Event Date is required.";
          }
          break;
  
        case "start_time":
          if (value === "") {
            fieldErrors[name] = "Event Start Time is required.";
          } else if (value.length > 100) {
            fieldErrors[name] = "Maximum 100 Characters Allowed.";
          }
          break;
  
        case "start_minute_time":
          if (value === "") {
            fieldErrors[name] = "Start minute time is required.";
          } else if (value.length > 50) {
            fieldErrors[name] = "Maximum 50 Characters Allowed.";
          }
          break;
  
          case "start_time_type":
          if (value === "") {
            fieldErrors[name] = "Start time type time is required.";
          } else if (value.length > 50) {
            fieldErrors[name] = "Maximum 50 Characters Allowed.";
          }
          break;
  
          case "end_time":
          if (value === "") {
            fieldErrors[name] = "Event End Time is required.";
          } else if (value.length > 100) {
            fieldErrors[name] = "Maximum 100 Characters Allowed.";
          }
          break;
  
        case "end_minute_time":
          if (value === "") {
            fieldErrors[name] = "Event end minute time is required.";
          } else if (value.length > 50) {
            fieldErrors[name] = "Maximum 50 Characters Allowed.";
          }
          break;
  
          case "end_time_type":
          if (value === "") {
            fieldErrors[name] = "End time type time is required.";
          } else if (value.length > 50) {
            fieldErrors[name] = "Maximum 50 Characters Allowed.";
          }
  
          case "position":
          if (value === "") {
            fieldErrors[name] = "position is required.";
          }
          break;
  
      //   case "industry":
      //     if (value === "") {
      //       fieldErrors[name] = "Industry is required.";
      //     } else if (value.length > 30) {
      //       fieldErrors[name] = "Maximum 30 Characters Allowed.";
      //     }
      //     break;
  
      //   case "website":
      //     if (value !== "") {
      //       if (value.length > 100) {
      //         fieldErrors[name] = "Maximum 100 Characters Allowed in website.";
      //       } else if (value.length > 100) {
      //         fieldErrors[name] = "Maximum 100 Characters Allowed in website.";
      //       }
      //     }
      //     break;
  
      //   case "employee_size":
      //     if (value !== "") {
      //       if (value.length > 8) {
      //         fieldErrors[name] = "At Most 8 Digits only";
      //       }
      //     }
      //     break;
  
      //   case "status":
      //     if (value === "") {
      //       fieldErrors[name] = "Status is required";
      //     }
      //     break;
  
        default:
          break;
      }
    // Add other validation rules as needed for other fields

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

  const handleFileChange = (e) => {
    // setFile(event.target.files[0]);
    const file = e.target.files[0];

    setFormInput((prevData) => ({
      ...prevData,
      new_image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const button = e.target;

    button.disabled = true;

    setIsLoading(true);

    const fieldErrors = {};

      // if (
    //   !formInput.first_name === "" ||
    //   /^\s*$/.test(formInput.first_name) ||
    //   formInput.first_name.length === 0
    // ) {
    //   fieldErrors.first_name = "First Name is required.";
    // } else if (!/^[a-zA-Z\s]*$/.test(formInput.first_name)) {
    //   fieldErrors.first_name =
    //     "Last Name should only contain alphabets and spaces.";
    // }

    // if (
    //   formInput.last_name === "" ||
    //   /^\s*$/.test(formInput.last_name) ||
    //   formInput.last_name.length === 0
    // ) {
    //   fieldErrors.last_name = "Last Name is required.";
    // }
    // if (
    //   formInput.email_id === "" ||
    //   /^\s*$/.test(formInput.email_id) ||
    //   formInput.email_id.length === 0
    // ) {
    //   fieldErrors.email_id = "Email is required.";
    // } else if (!/\S+@\S+\.\S+/.test(formInput.email_id)) {
    //   fieldErrors.email_id = "Invalid email format.";
    // } else if (formInput.email_id.length > 100) {
    //   fieldErrors.email_id = "Maximum 100 Characters Allowed in Email.";
    // }

    // if (formInput.phone_number !== "") {
    //   if (
    //     /^\s*$/.test(formInput.phone_number) ||
    //     !/^\d{10}$/.test(formInput.phone_number)
    //   ) {
    //     fieldErrors.phone_number = "Invalid phone number. Must be 10 digits.";
    //   }
    // }

    // if (formInput.alternate_mobile_number !== "") {
    //   if (
    //     /^\s*$/.test(formInput.alternate_mobile_number) ||
    //     !/^\d{10}$/.test(formInput.alternate_mobile_number)
    //   ) {
    //     fieldErrors.alternate_mobile_number =
    //       "Invalid Alt phone number. Must be 10 digits.";
    //   }
    // }

    // if (
    //   formInput.alternate_mobile_number !== "" &&
    //   formInput.alternate_mobile_number.length !== 0
    // ) {
    //   if (formInput.alternate_mobile_number === formInput.phone_number) {
    //     fieldErrors.alternate_mobile_number =
    //       "Alt. phone number should be different from Phone Number.";
    //   }
    // }

    // if (formInput.job_title === "" || /^\s*$/.test(formInput.job_title)) {
    //   fieldErrors.job_title = "Job Title is required.";
    // } else if (formInput.job_title.length > 100) {
    //   fieldErrors.job_title = "Maximum 100 Characters Allowed in website.";
    // }

    // if (
    //   formInput.company_name === "" ||
    //   /^\s*$/.test(formInput.company_name) ||
    //   formInput.company_name.length === 0
    // ) {
    //   fieldErrors.company_name = "Company Name is required.";
    // }

    // if (
    //   formInput.industry === "" ||
    //   /^\s*$/.test(formInput.industry) ||
    //   formInput.industry.length === 0
    // ) {
    //   fieldErrors.industry = "Industry is required.";
    // }

    if (formInput.new_image) {
        const allowedFormats = ["image/jpeg", "image/png", "image/gif","image/jpg"];
        if (!allowedFormats.includes(formInput.new_image.type)) {
          fieldErrors.new_image =
            "Invalid file format. Only JPEG, PNG, and GIF formats are allowed.";
        }
      }
  
      // if (formInput.website !== "") {
      //   if (/^\s*$/.test(formInput.website)) {
      //     fieldErrors.website = "Invalid website link.";
      //   } else if (formInput.website.length > 100) {
      //     fieldErrors.website = "Maximum 100 Characters Allowed in website.";
      //   }
      // }
  
      // if (formInput.linkedin_page_link !== "") {
      //   if (/^\s*$/.test(formInput.website)) {
      //     fieldErrors.linkedin_page_link =
      //       "Invalid LinkedIn profile format. Include full profile URL.";
      //   }
      // }
  
      // if (formInput.company_turn_over !== "") {
      //   if (/^\s*$/.test(formInput.company_turn_over)) {
      //     fieldErrors.company_turn_over =
      //       "Invalid company turn over. Must be a number.";
      //   }
      // }
  
      // if (formInput.status === "") {
      //   fieldErrors.status = "Status is required.";
      // }
  
      if (
          formInput.title === "" ||
          /^\s*$/.test(formInput.title) ||
          formInput.title.length === 0
        ) {
          fieldErrors.title = "Last Name is required.";
        }
  
        if (
          formInput.description === "" ||
          /^\s*$/.test(formInput.description) ||
          formInput.description.length === 0
        ) {
          fieldErrors.description = "Last Name is required.";
        }
  
  
      if (formInput.start_time !== "") {
          if (/^\s*$/.test(formInput.start_time)) {
            fieldErrors.start_time =
              "Event Start Time Must be a number.";
          }
      }
  
      if (formInput.start_minute_time !== "") {
          if (/^\s*$/.test(formInput.start_minute_time)) {
            fieldErrors.start_minute_time =
              "Event Start Time Must be a number.";
          }
      }
  
      if (formInput.end_time !== "") {
          if (/^\s*$/.test(formInput.end_time)) {
            fieldErrors.end_time =
              "Event Start Time Must be a number.";
          }
      }
  
      if (formInput.end_minute_time !== "") {
          if (/^\s*$/.test(formInput.end_minute_time)) {
            fieldErrors.end_minute_time =
              "Event Start Time Must be a number.";
          }
      }

      console.log(fieldErrors)
  
      if (Object.keys(fieldErrors).length === 0) {
        const formData = new FormData();
  
        formData.append("image_path", formInput.image_path);
        formData.append("title", formInput.title);
        formData.append("description", formInput.description);
        formData.append("event_id", eventId);
        formData.append("event_date", formInput.event_date);
        formData.append("start_time", formInput.start_time);
        formData.append("start_minute_time", formInput.start_minute_time);
        formData.append("start_time_type", formInput.start_time_type);
        formData.append("end_minute_time", formInput.end_minute_time);
        formData.append("end_time", formInput.end_time);
        formData.append("end_time_type", formInput.end_time_type);
        formData.append("position", formInput.position);
        formData.append("_method", 'PUT');

        console.log(formInput)
        
      axios
        .post(`/api/agendas/${uuid}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setFormInput({
                ...formInput,
                title: "",
                description: "",
                image_path: null,
                event_id: eventId,
                event_date: "",
                start_time: "",
                start_minute_time: "",
                start_time_type: "",
                end_minute_time: "",
                end_time: "",
                end_time_type: "",
                position: 0,
                new_image: null
            });

            setErrors({});

            // history.push(`/admin/all-attendee/${orginalEventId}`);
            window.history.back()
          } else if (res.data.status === 422) {
            // console.log("success", res.data.errors);
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");
            // history.push(`/admin/all-attendee/${eventId}`);
            window.history.back()
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
            <h1 className="h3 mb-0 text-gray-800">Edit Agenda </h1>
            <button
            //   to={`/admin/all-attendee/${orginalEventId}`}
            onClick={() => {window.history.back()}}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </button>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Edit Ageneda</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <h5 className="text-center">Edit Agenda Details</h5>
                <hr />
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Name */}
                  <div className="form-group row">
                    <label
                      forhtml="title"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Title *
                    </label>
                    <div className="col-12 col-lg-5 mb-2">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        placeholder="Title"
                        name="title"
                        value={formInput.title}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.title && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.title}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-lg-5">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        placeholder="Description"
                        name="description"
                        value={formInput.description}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.description && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label
                      forhtml="event_date"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Event Date *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="date"
                          className={`form-control ${
                            errors.event_date ? "is-invalid" : ""
                          }`}
                          placeholder="Event Date"
                          name="event_date"
                          value={formInput.event_date}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.event_date && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.event_date}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone Number  */}
                  <div className="form-group row">
                    <label
                      forhtml="start_time"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Event Start Time
                    </label>
                    <div className="col-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.start_time ? "is-invalid" : ""
                      }`}
                      name="start_time"
                      placeholder="Hour"
                      value={formInput.start_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {hourOptions}
                    </select>
                  </div>
                </div>

                <div className="col-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.start_minute_time ? "is-invalid" : ""
                      }`}
                      name="start_minute_time"
                      placeholder="Minute"
                      value={formInput.start_minute_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>
                  </div>
                </div>

                <div className="col-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="start_time_type"
                        value="am"
                        checked={
                          formInput.start_time_type === "am" ||
                          formInput.start_time_type === "AM"
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
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="start_time_type"
                        value="pm"
                        checked={
                          formInput.start_time_type === "pm" ||
                          formInput.start_time_type === "PM"
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







                    {/* <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.start_time ? "is-invalid" : ""
                          }`}
                          placeholder="Start Time"
                          name="start_time"
                          maxLength={10}
                          value={
                            formInput.start_time === null
                              ? ""
                              : formInput.start_time
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.start_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_time}
                          </div>
                        )}
                      </div>
                    </div> */}

                    {/* <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.alternate_mobile_number ? "is-invalid" : ""
                          }`}
                          placeholder="Alternate Phone Number"
                          name="alternate_mobile_number"
                          maxLength={10}
                          value={
                            formInput.alternate_mobile_number === null
                              ? ""
                              : formInput.alternate_mobile_number
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.alternate_mobile_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.alternate_mobile_number}
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>


                  {/* <div className="form-group row">
                    <label
                      forhtml="start_minute_time"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Start Minute Time *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.start_minute_time ? "is-invalid" : ""
                          }`}
                          placeholder="Start Minute Time"
                          name="start_minute_time"
                          value={formInput.start_minute_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.start_minute_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_minute_time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      forhtml="start_time_type"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Start Minute Type *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.start_time_type ? "is-invalid" : ""
                          }`}
                          placeholder="Start Minute Time"
                          name="start_time_type"
                          value={formInput.start_time_type}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.start_time_type && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_time_type}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}


                  <div className="form-group row">
                    <label
                      forhtml="end_time"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Event End Time *
                    </label>

                    <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.end_minute_time ? "is-invalid" : ""
                      }`}
                      name="end_time"
                      placeholder="Hour"
                      value={formInput.end_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {hourOptions}
                    </select>
                  </div>
                </div>

                <div className="col-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.end_minute_time ? "is-invalid" : ""
                      }`}
                      name="end_minute_time"
                      placeholder="Minute"
                      value={formInput.end_minute_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>
                  </div>
                </div>

                <div className="col-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="end_time_type"
                        value="am"
                        checked={
                          formInput.end_time_type === "am" ||
                          formInput.end_time_type === "AM"
                        }
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio1"
                      >
                        AM
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="end_time_type"
                        value="pm"
                        checked={
                          formInput.end_time_type === "pm" ||
                          formInput.end_time_type === "PM"
                        }
                        onChange={handleInput}
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






                    {/* <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.end_time ? "is-invalid" : ""
                          }`}
                          placeholder="Event End Time"
                          name="end_time"
                          value={formInput.end_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.end_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.end_time}
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="form-group row">
                    <label
                      forhtml="end_minute_time"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      End Minute Time *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.end_minute_time ? "is-invalid" : ""
                          }`}
                          placeholder="End Minute Time"
                          name="end_minute_time"
                          value={formInput.end_minute_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.end_minute_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.end_minute_time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      forhtml="end_time_type"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      End Time Type *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.end_time_type ? "is-invalid" : ""
                          }`}
                          placeholder="End Time Type"
                          name="end_time_type"
                          value={formInput.end_time_type}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.end_time_type && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.end_time_type}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}


                  <div className="form-group row">
                    <label
                      forhtml="priority"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Priority *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="text"
                          className={`form-control ${
                            errors.position ? "is-invalid" : ""
                          }`}
                          placeholder="Priority"
                          name="position"
                          value={formInput.position}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        /> */}


                        <select
                          className={`form-control ${
                            errors.position ? "is-invalid" : ""
                          }`}
                          name="position"
                          placeholder="Hour"
                          value={formInput.position}
                          onBlur={handleBlur}
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                          >
                          {priorityOption}
                        </select>

                        {errors.position && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.position}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File - Event Image  */}
                  <div className="form-group row">
                    <label
                      forhtml="file"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Profile Picture *
                    </label>
                    <div className="col-12 col-lg-5">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.new_image ? "is-invalid" : ""
                        }`}
                        name="file"
                        onChange={handleFileChange}
                        onBlur={handleBlur}
                      />

                      {errors.new_image && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.new_image}
                        </div>
                      )}

                      {errors.image_path && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.image_path}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-lg-4 mt-3">
                      {formInput.new_image && (
                        <img
                          src={URL.createObjectURL(formInput.new_image)}
                          width="60%"
                          alt="defaultUser"
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}

                      {formInput.image_path && !formInput.new_image && (
                        <img
                          src={imageBaseUrl + formInput.image_path}
                          width="60%"
                          alt={formInput.image_path}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}

                      {!formInput.image_path && !formInput.new_image && (
                        <img
                          src={Defaultuser}
                          width="60%"
                          alt="defaultUser"
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </div>

{/*                   
                  <div className="form-group row">
                    <label
                      forhtml="job_title"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Job Title *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="job_title"
                          className={`form-control ${
                            errors.job_title ? "is-invalid" : ""
                          }`}
                          placeholder="Job Title"
                          name="job_title"
                          value={formInput.job_title}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.job_title && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.job_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  
                  <div className="form-group row">
                    <label
                      forhtml="company_name"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Company Name *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_name"
                          className={`form-control ${
                            errors.company_name ? "is-invalid" : ""
                          }`}
                          placeholder="Company Name"
                          name="company_name"
                          value={formInput.company_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  
                  <div className="form-group row">
                    <label
                      forhtml="industry"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Industry *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="industry"
                          className={`form-control ${
                            errors.industry ? "is-invalid" : ""
                          }`}
                          placeholder="Industry"
                          name="industry"
                          value={formInput.industry}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.industry && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.industry}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  
                  <div className="form-group row">
                    <label
                      forhtml="website"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Website
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="website"
                          className={`form-control ${
                            errors.website ? "is-invalid" : ""
                          }`}
                          placeholder="Website"
                          name="website"
                          value={
                            formInput.website === null ? "" : formInput.website
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.website && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.website}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label
                      forhtml="linkedin_page_link"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      LinkedIn Profile Link
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="linkedin_page_link"
                          className={`form-control ${
                            errors.linkedin_page_link ? "is-invalid" : ""
                          }`}
                          placeholder="Linked Profile Link"
                          name="linkedin_page_link"
                          value={
                            formInput.linkedin_page_link === null
                              ? ""
                              : formInput.linkedin_page_link
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.linkedin_page_link && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.linkedin_page_link}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label
                      forhtml="company_size"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Employee Size
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.employee_size ? "is-invalid" : ""
                          }`}
                          placeholder="Company Size"
                          name="employee_size"
                          maxLength={8}
                          value={
                            formInput.employee_size === null
                              ? ""
                              : formInput.employee_size
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.employee_size && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.employee_size}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      forhtml="company_turn_over"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Company Turn Over
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_turn_over"
                          className={`form-control ${
                            errors.company_turn_over ? "is-invalid" : ""
                          }`}
                          placeholder="Company Turn Over"
                          name="company_turn_over"
                          value={
                            formInput.company_turn_over === null
                              ? ""
                              : formInput.company_turn_over
                          }
                          maxLength={20}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_turn_over && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_turn_over}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      forhtml="status"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Attendee Status *
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <select
                          className={`form-control ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="status"
                          value={formInput.status}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        >
                          <option value="">Select an Option</option>
                          <option value="speaker">Speaker</option>
                          <option value="panelist">Panellist</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="delegate">Delegate</option>
                          <option value="moderator">Moderator</option>
                        </select>
                        {errors.status && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}

                  <div className="form-group row">
                    <label
                      forhtml="status"
                      className="col-2 col-form-label"
                    ></label>
                    <div className="col-8 mb-3 mb-sm-0">
                      <button
                        className="btn btn-primary btn-user"
                        style={{
                          backgroundColor: "#F5007E",
                          borderColor: "#F5007E",
                          fontSize: "14px",
                          padding: "1% 6%",
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <img
                            src={loadingGif}
                            alt="Loading"
                            style={{ width: "20px", height: "20px" }}
                          />
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditAgenda;
