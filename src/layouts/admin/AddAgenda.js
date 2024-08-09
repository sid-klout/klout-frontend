import React, { useState, useRef, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

import axios from "axios";
import swal from "sweetalert";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function AddAgenda(props) {
  const history = useHistory();

  const fileInputRef = useRef(null);

  const uuid = props.match.params.id;
  console.log(uuid)

  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [errorsExcel, setErrorsExcel] = useState({});
  const [invalidMessage, setInvalidMessage] = useState("");
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [columnData, setColumnData] = useState({});
  const [inValidData, setInValidData] = useState({});
  const [downloadInvalidExcel, setDownloadInvalidExcel] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [eventID, setEventID] = useState(null);



   //Dropdown for Time (Hour)- 00 to 12
   const hourOptions = Array.from({ length: 12 }, (_, index) => {
    const value = (index + 1).toString().padStart(2, "0");
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
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
   const priorityOption = Array.from({ length: 100 }, (_, index) => {
    const value = (index + 1).toString().padStart(2, "0");
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  useEffect(() => {
    // setLoading(true);
    axios.get(`/api/events/${uuid}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data.id)
        // setEvent(res.data.data.title);
        setEventID(res.data.data.id);
      }
    });
}, [])

  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    image_path: "",
    event_id: "",
    event_date: "",
    start_time: "",
    start_minute_time: "",
    start_time_type: "am",
    end_minute_time: "",
    end_time: "",
    end_time_type: "pm",
    position: "",
    // employee_size: "",
    // company_turn_over: "",
    // status: "",
    // // image: null,
  });

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
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));

      setFormInput((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Add Attendee Form
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

    if (formInput.image) {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedFormats.includes(formInput.image.type)) {
        fieldErrors.image =
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

    if (Object.keys(fieldErrors).length === 0) {
      const formData = new FormData();

      formData.append("image_path", formInput.image);
      formData.append("title", formInput.title);
      formData.append("description", formInput.description);
      formData.append("event_id", eventID);
      formData.append("event_date", formInput.event_date);
      formData.append("start_time", formInput.start_time);
      formData.append("start_minute_time", formInput.start_minute_time);
      formData.append("start_time_type", formInput.start_time_type);
      formData.append("end_minute_time", formInput.end_minute_time);
      formData.append("end_time", formInput.end_time);
      formData.append("end_time_type", formInput.end_time_type);
      formData.append("position", formInput.position);


      axios
        .post(`/api/agendas/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 201) {
            swal("Success", res.data.message, "success");

            setFormInput({
                ...formInput,
                title: "",
                description: "",
                image_path: "",
                event_id: "",
                event_date: "",
                start_time: "",
                start_minute_time: "",
                start_time_type: "am",
                end_minute_time: "",
                end_time: "",
                end_time_type: "pm",
            });

            setErrors({});

            history.push(`/organiser/admin/all-agenda/${uuid}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");

            history.push(`/organiser/admin/all-agenda/${uuid}`);
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

  // Upload Excel
  const downloadExcelSheet = () => {
    // Create sample Excel sheet data
    const data = [
      [
        "first_name",
        "last_name",
        "job_title",
        "company_name",
        "industry",
        "email",
        "phone_number",
        "alternate_mobile_number",
        "website",
        "status",
        "employee_size",
        "company_turn_over",
        "linkedin_page_link",
      ],
      [
        "John",
        "Doe",
        "CEO",
        "Digimantra",
        "IT",
        "johndoe@example.com",
        "8709289369",
        "7865656575",
        "www.digimantra.com",
        "Speaker",
        "200",
        "5M",
        "https://linkedin/company/digimantra",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendee_list_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [excelInput, setExcelInput] = useState({
    file: null,
  });

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setExcelInput({ ...excelInput, file });
  };

  const downloadInvalidExcelSheet = () => {
    const data = [
      [
        "first_name",
        "last_name",
        "job_title",
        "company_name",
        "industry",
        "email",
        "phone_number",
        "alternate_mobile_number",
        "website",
        "status",
        "employee_size",
        "company_turn_over",
        "linkedin_page_link",
      ],
      ...Object.values(inValidData).map((obj) => Object.values(obj)),
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");

    link.setAttribute("href", encodeURI(csvContent));

    link.setAttribute(
      "download",
      `attendee_invalid_list_data_${timestamp}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    setDownloadInvalidExcel(false);

    if (!file) {
      setErrorsExcel({ message: "Please select an Excel file." });
      return;
    }

    setIsLoadingExcel(true);

    const formData = new FormData();

    formData.append("file", file);
    // formData.append("event_id", event_id);

    await axios
      .post(`/api/attendees/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");

          setColumnData({});

          setInValidData({});

          setErrorsExcel({});

          setDownloadInvalidExcel(false);

          setFile(null);

          history.push(`/organiser/admin/all-agenda/${uuid}`);
        } else if (res.data.status === 400) {
          setDownloadInvalidExcel(true);

          setColumnData(res.data.column_data);

          setInValidData(res.data.invalid_data);

          setInvalidMessage(res.data.message);

          setErrorsExcel(res.data.errors);

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (res.data.status === 422) {
          setColumnData({});

          setInValidData({});

          setErrorsExcel({ message: res.data.error });

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (res.data.status === 401) {
          setColumnData({});

          setInValidData({});

          setDownloadInvalidExcel(false);

          setErrorsExcel({ message: res.data.message });

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      });

    setIsLoadingExcel(false);
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
            <h1 className="h3 mb-0 text-gray-800">Add Agenda </h1>
            <button
            //   to={`/organiser/admin/all-attendee/${event_id}`}
            onClick={() => {window.history.back()}}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i>&nbsp; Go Back
            </button>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Agenda</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div
                className="col-12 col-lg-12 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <h5 className="text-center">Add Agenda Details</h5>
                <hr />
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Name */}
                  <div className="form-group row">
                    <div className="col-6">
                      <label forhtml="title" className="col-form-label">
                        Title *
                      </label>
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

                    <div className="col-6">
                      <label forhtml="description" className="col-form-label">
                        Description *
                      </label>
                      <textarea
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
                      ></textarea>

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

                  {/* Event Date  */}
                  <div className="form-group row">
                    <label forhtml="event_date" className="col-12 col-form-label">
                      Event Date *
                    </label>
                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="date"
                          className={`form-control ${
                            errors.event_date ? "is-invalid" : ""
                          }`}
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

                  {/* <div className="form-group row">
                    <label
                      forhtml="phone_number"
                      className="col-12 col-form-label"
                    >
                      Phone Number 
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.phone_number ? "is-invalid" : ""
                          }`}
                          placeholder="Phone Number"
                          name="phone_number"
                          maxLength={10}
                          value={formInput.phone_number}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.phone_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.phone_number}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mb-3 mt-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.alternate_mobile_number ? "is-invalid" : ""
                          }`}
                          placeholder="Alternate Phone Number"
                          name="alternate_mobile_number"
                          maxLength={10}
                          value={formInput.alternate_mobile_number}
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
                    </div>
                  </div> */}

                  {/* File - Image  */}
                  <div className="form-group row">
                    <label forhtml="file" className="col-12 col-form-label">
                      Agenda Image
                    </label>
                    <div className="col-12 col-lg-4">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.image ? "is-invalid" : ""
                        }`}
                        name="file"
                        onChange={handleFileChange}
                        onBlur={handleBlur}
                      />

                      {errors.image && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.image}
                        </div>
                      )}
                    </div>
                    <div className="col-12  col-lg-4">
                      
                      {formInput.image ? (
                        <img
                          src={selectedImage}
                          width="50%"
                          alt={formInput.image}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      ) : (
                        <img
                          src={Defaultuser}
                          width="50%"
                          alt={"default-user"}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}

                      <p style={{ fontSize: "12px", float: "left", marginTop: '10px' }}>
                      * Upload Image in JPG and PNG Format Only.
                      </p>
                    </div>
                  </div>

                  
                  <div className="col-12 form-group row">
                    <label
                      forhtml="start_time"
                      className="col-12 col-form-label"
                    >
                      Start Time *
                    </label>
                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="input"
                          className={`form-control ${
                            errors.start_time ? "is-invalid" : ""
                          }`}
                          placeholder="Event Start Time"
                          name="start_time"
                          value={formInput.start_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        /> */}


                      <select
                      className={`form-control ${
                        errors.start_time ? "is-invalid" : ""
                      }`}
                      name="start_time"
                      placeholder="Hour"
                      value={formInput.start_time}
                      onBlur={handleBlur}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                      >
                      {hourOptions}
                    </select>

                        {/* {errors.start_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_time}
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="start_minute_time"
                          className={`form-control ${
                            errors.start_minute_time ? "is-invalid" : ""
                          }`}
                          placeholder="Start Minute Time"
                          name="start_minute_time"
                          value={formInput.start_minute_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        /> */}

                      <select
                        className={`form-control ${
                          errors.start_minute_time ? "is-invalid" : ""
                        }`}
                        name="start_minute_time"
                        placeholder="Minute"
                        value={formInput.start_minute_time}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>

                        {/* {errors.start_minute_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_minute_time}
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="start_time_type"
                        value="am"
                        checked={formInput.start_time_type === "am"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio1"
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
                        checked={formInput.start_time_type === "pm"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio2"
                      >
                        PM
                      </label>
                    </div>
                  </div>
                    </div>


                  </div>

                  
                  <div className="col-12 form-group row">
                    {/* <label
                      forhtml="start_minute_time"
                      className="col-12 col-form-label"
                    >
                      Start minute time *
                    </label> */}
                    
                  </div>


                  


                  {/* <div className="form-group row">
                    <label
                      forhtml="start_time_type"
                      className="col-12 col-form-label"
                    >
                      Start Time Type *
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="start_time_type"
                          className={`form-control ${
                            errors.start_time_type ? "is-invalid" : ""
                          }`}
                          placeholder="Start Time Type"
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
                      className="col-12 col-form-label"
                    >
                      End Time *
                    </label>
                    {/* <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="input"
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





                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="input"
                          className={`form-control ${
                            errors.start_time ? "is-invalid" : ""
                          }`}
                          placeholder="Event Start Time"
                          name="start_time"
                          value={formInput.start_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        /> */}


                      <select
                      className={`form-control ${
                        errors.end_time ? "is-invalid" : ""
                      }`}
                      name="end_time"
                      placeholder="Hour"
                      value={formInput.end_time}
                      onBlur={handleBlur}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                      >
                      {hourOptions}
                    </select>

                        {/* {errors.start_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_time}
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="start_minute_time"
                          className={`form-control ${
                            errors.start_minute_time ? "is-invalid" : ""
                          }`}
                          placeholder="Start Minute Time"
                          name="start_minute_time"
                          value={formInput.start_minute_time}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        /> */}

                      <select
                        className={`form-control ${
                          errors.end_minute_time ? "is-invalid" : ""
                        }`}
                        name="end_minute_time"
                        placeholder="Minute"
                        value={formInput.end_minute_time}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>

                        {/* {errors.start_minute_time && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.start_minute_time}
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="end_time_type"
                        value="am"
                        checked={formInput.end_time_type === "am"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio3"
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
                        checked={formInput.end_time_type === "pm"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio4"
                      >
                        PM
                      </label>
                    </div>
                  </div>
                    </div>
                  </div>

                  
                  {/* <div className="form-group row">
                    <label
                      forhtml="end_minute_time"
                      className="col-12 col-form-label"
                    >
                      End minute time *
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="end_minute_time"
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
                  </div> */}


                  {/* <div className="form-group row">
                    <label
                      forhtml="end_time_type"
                      className="col-12 col-form-label"
                    >
                      End Time Type *
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="end_time_type"
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
                      className="col-12 col-form-label"
                    >
                      Priority *
                    </label>
                    <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                      <div className="form-group">
                        {/* <input
                          type="text"
                          className={`form-control ${
                            errors.position ? "is-invalid" : ""
                          }`}
                          placeholder="priority"
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

                  {/* Event Venue  */}
                  {/* <div className="form-group row">
                    <label forhtml="industry" className="col-12 col-form-label">
                      Industry *
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
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
                  </div> */}

                  {/* Event Venue  */}
                  {/* <div className="form-group row">
                    <label forhtml="website" className="col-12 col-form-label">
                      Website
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="website"
                          className={`form-control ${
                            errors.website ? "is-invalid" : ""
                          }`}
                          placeholder="Website"
                          name="website"
                          value={formInput.website}
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
                  </div> */}
                  {/* Event Venue  */}
                  {/* <div className="form-group row">
                    <label
                      forhtml="linkedin_page_link"
                      className="col-12 col-form-label"
                    >
                      LinkedIn Profile Link
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="linkedin_page_link"
                          className={`form-control ${
                            errors.linkedin_page_link ? "is-invalid" : ""
                          }`}
                          placeholder="Linked Profile Link"
                          name="linkedin_page_link"
                          value={formInput.linkedin_page_link}
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
                  </div> */}
                  {/* Profile Link */}
                  {/* <div className="form-group row">
                    <label
                      forhtml="company_size"
                      className="col-12 col-form-label"
                    >
                      Employee Size
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.employee_size ? "is-invalid" : ""
                          }`}
                          placeholder="Company Size"
                          name="employee_size"
                          maxLength={8}
                          value={formInput.employee_size}
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
                      className="col-12 col-form-label"
                    >
                      Company Turn Over
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_turn_over"
                          className={`form-control ${
                            errors.company_turn_over ? "is-invalid" : ""
                          }`}
                          placeholder="Company Turn Over"
                          name="company_turn_over"
                          maxLength={20}
                          value={formInput.company_turn_over}
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
                    <label forhtml="status" className="col-12 col-form-label">
                      Attendee Status *
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
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
                          <option value="others">Others</option>
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
                      className="col-12 col-form-label"
                    ></label>
                    <div className="col-12 mb-3 mb-sm-0">
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
                          <>
                            <img
                              src={loadingGif}
                              alt="Loading..."
                              style={{ width: "20px", height: "20px" }}
                            />
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                      <hr />
                    </div>
                  </div>
                </form>
              </div>

              {/* <div className="col-12 col-lg-5 text-center">
                <h5>Upload Attendee List</h5>
                <hr />

                <span className="text-sm">
                  ( <b> Instruction </b> :- Download Attendee Excel Sample
                  Format )
                </span>

                <div className="m-4 ">
                  <button
                    onClick={downloadExcelSheet}
                    className="btn btn-primary"
                  >
                    Download Sample Excel CSV Sheet Format
                    <i className="fa fa-download mx-2"></i>
                  </button>
                </div>
                <div
                  style={{
                    border: "2px solid #dbdbdb",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  <h5>Upload Attendee List</h5>
                  <hr />

                  <form
                    className="user mt-5"
                    onSubmit={handleFileUpload}
                    encType="multipart/form-data"
                  >
                    <div className="form-group row">
                      <div className="col-12">
                        {errorsExcel !== "" &&
                          Object.keys(errorsExcel).length !== 0 && (
                            <div className="p-2">
                              <div
                                className="alert alert-danger alert-dismissible fade show"
                                role="alert"
                              >
                                {errorsExcel.message &&
                                  errorsExcel.message !== undefined &&
                                  showAlert && (
                                    <>
                                      <span>{errorsExcel.message}</span>
                                      <br />
                                    </>
                                  )}

                                {errorsExcel.firstNameError && (
                                  <>
                                    <span>{errorsExcel.firstNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.lastNameError && (
                                  <>
                                    <span>{errorsExcel.lastNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.emailError && (
                                  <>
                                    <span>{errorsExcel.emailError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.phoneError && (
                                  <>
                                    <span>{errorsExcel.phoneError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.jobTitleError && (
                                  <>
                                    <span>{errorsExcel.jobTitleError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.companyNameError && (
                                  <>
                                    <span>{errorsExcel.companyNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.industryNameError && (
                                  <>
                                    <span>{errorsExcel.industryNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.duplicateEmails && (
                                  <>
                                    <span>{errorsExcel.duplicateEmails}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.duplicateMobiles && (
                                  <>
                                    <span>{errorsExcel.duplicateMobiles}</span>
                                    <br />
                                  </>
                                )}
                                <button className="close" onClick={closeAlert}>
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            </div>
                          )}
                      </div>

                      <div className="col-12">
                        {downloadInvalidExcel ? (
                          <>
                            <div
                              className="alert alert-danger alert-dismissible fade show"
                              role="alert"
                            >
                              {invalidMessage}
                              <br />

                              <button
                                onClick={downloadInvalidExcelSheet}
                                className="btn btn-primary"
                              >
                                Download Invalid Excel CSV Sheet
                                <i className="fa fa-download"></i>
                              </button>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        forhtml="first_name"
                        className="col-12 col-form-label"
                      >
                        Upload File
                      </label>
                      <div className="col-12">
                        <input
                          type="file"
                          className={`form-control ${
                            errors.file ? "is-invalid" : ""
                          }`}
                          name="file"
                          onChange={handleExcelFileChange}
                          ref={fileInputRef}
                        />
                        {errors.file && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.file}
                          </div>
                        )}
                        <div className="form-group row mt-4">
                          <label
                            forhtml="status"
                            className="col-1 col-form-label"
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
                              disabled={isLoadingExcel}
                            >
                              {isLoadingExcel ? (
                                <img
                                  src={loadingGif}
                                  alt="Loading..."
                                  style={{ width: "20px", height: "20px" }}
                                />
                              ) : (
                                "Upload Excel Now"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAgenda;
