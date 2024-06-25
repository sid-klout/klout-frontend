import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import DefaultBanner from "../../assets/images/default-banner.jpg";
import loadingGif from "../../assets/images/load.gif";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditEvent(props) {
  const history = useHistory();

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageErrors] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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

  const [eventInput, setEventInput] = useState({
    title: "",
    description: "",
    event_start_date: "",
    event_end_date: "",
    start_time: "",
    start_minute_time: "",
    start_time_type: "",
    end_time: "",
    end_minute_time: "",
    end_time_type: "",
    event_venue_name: "",
    event_venue_address_1: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    image: null,
    feedback: "",
    status: "",
    new_image: null,
  });

  useEffect(() => {
    const event_id = props.match.params.id;

    axios.get(`/api/events/${event_id}`).then((res) => {
      if (res.data.status === 200) {
        setEventInput(res.data.data);

        setSelectedCountry(res.data.data.country);

        setSelectedState(res.data.data.state);

        // fetchStates(res.data.data.state);

        // setSelectedCity(res.data.data.city);

        // fetchCities(res.data.data);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-events");
      }
    });
  }, [history, props.match.params.id]);

  const handleStartDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    setEventInput({
      ...eventInput,
      event_start_date: formattedDate,
    });
  };

  const handleEndDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    setEventInput({
      ...eventInput,
      event_end_date: formattedDate,
    });
  };

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setEventInput({ ...eventInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    const currentDate = new Date();

    switch (name) {
      case "title":
        if (value === "") {
          fieldErrors[name] = "Title is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "description":
        if (value === "") {
          fieldErrors[name] = "Description is required.";
        } else if (value.length > 3000) {
          fieldErrors[name] = "Maximum 3000 Characters Allowed.";
        }
        break;
      case "event_venue_name":
        if (value === "") {
          fieldErrors[name] = "Venue Details is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "event_venue_address_1":
        if (value === "") {
          fieldErrors[name] = "Address is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "city":
        if (value === "") {
          fieldErrors[name] = "City is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "state":
        if (value === "") {
          fieldErrors[name] = "State is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "country":
        if (value === "") {
          fieldErrors[name] = "Country is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "pincode":
        if (value === "") {
          fieldErrors[name] = "Pincode is required.";
        } else if (!/^\d{6}$/.test(value)) {
          fieldErrors[name] = "Invalid Pin Code. Must be 6 digits.";
        }
        break;

      case "event_start_date":
        if (value === "") {
          fieldErrors[name] = "Start Date is required.";
        } else if (value < currentDate) {
          fieldErrors[name] = "Start Date is Invalid";
        }
        break;

      case "event_end_date":
        if (value === "") {
          fieldErrors[name] = "End Date is required.";
        } else if (value < currentDate) {
          fieldErrors[name] = "End Date is Invalid";
        }
        break;

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
    setEventInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    const selectedFile = e.target.files[0];
    const fileSize = selectedFile.size / 1024 / 1024; // in MB
    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setImageErrors("Only JPG and PNG files are allowed.");
      return;
    }

    if (fileSize > 5) {
      setImageErrors("File size exceeds the limit of 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.src = event.target.result;

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        if (width > 500 || height > 500) {
          setImageErrors("Image dimensions must be less than 500x500 pixels.");
        } else {
          setSelectedImage(URL.createObjectURL(selectedFile));

          setEventInput((prevData) => ({
            ...prevData,
            new_image: selectedFile,
          }));

          setErrors("");
        }
      };
    };

    reader.readAsDataURL(selectedFile);
  };

  const updateSubmit = (e) => {
    e.preventDefault();

    const button = e.target;

    button.disabled = true;

    setIsLoading(true);

    const event_id = props.match.params.id;

    const fieldErrors = {};

    if (
      eventInput.title === "" ||
      /^\s*$/.test(eventInput.title) ||
      eventInput.title.length === 0
    ) {
      fieldErrors.title = "Title is required.";
    } else if (eventInput.title.length > 100) {
      fieldErrors.title = "Maximum 100 Characters Allowed.";
    }

    if (
      eventInput.description === "" ||
      /^\s*$/.test(eventInput.description) ||
      eventInput.description.length === 0
    ) {
      fieldErrors.description = "Description is required.";
    } else if (eventInput.description.length > 3000) {
      fieldErrors.description = "Maximum 3000 Characters Allowed.";
    }

    if (eventInput.new_image !== "") {
      const allowedFormats = ["image/jpeg", "image/png"];
      if (eventInput.new_image) {
        if (!allowedFormats.includes(eventInput.new_image.type)) {
          fieldErrors.new_image =
            "Invalid file format. Only JPEG & PNG formats are allowed.";
        }
      }
    }

    if (
      eventInput.event_venue_name === "" ||
      /^\s*$/.test(eventInput.event_venue_name) ||
      eventInput.event_venue_name.length === 0
    ) {
      fieldErrors.event_venue_name = "Event Venue Details is required.";
    } else if (eventInput.event_venue_name.length > 50) {
      fieldErrors.event_venue_name = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.event_venue_address_1 === "" ||
      /^\s*$/.test(eventInput.event_venue_address_1) ||
      eventInput.event_venue_address_1.length === 0
    ) {
      fieldErrors.event_venue_address_1 = "Addess is required.";
    } else if (eventInput.event_venue_address_1.length > 100) {
      fieldErrors.event_venue_address_1 = "Maximum 100 Characters Allowed.";
    }

    if (
      eventInput.city === "" ||
      /^\s*$/.test(eventInput.city) ||
      eventInput.city.length === 0
    ) {
      fieldErrors.city = "City is required.";
    } else if (eventInput.city.length > 50) {
      fieldErrors.city = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.state === "" ||
      /^\s*$/.test(eventInput.state) ||
      eventInput.state.length === 0
    ) {
      fieldErrors.state = "State is required.";
    } else if (eventInput.state.length > 50) {
      fieldErrors.state = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.country === "" ||
      /^\s*$/.test(eventInput.country) ||
      eventInput.country.length === 0
    ) {
      fieldErrors.country = "Country is required.";
    } else if (eventInput.country.length > 50) {
      fieldErrors.country = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.pincode === "" ||
      /^\s*$/.test(eventInput.pincode) ||
      eventInput.pincode.length === 0
    ) {
      fieldErrors.pincode = "Pin Code is required.";
    } else if (!/^\d{6}$/.test(eventInput.pincode)) {
      fieldErrors.pincode = "Invalid Pin Code. Must be 6 digits.";
    }

    if (
      eventInput.event_start_date === "" ||
      eventInput.event_start_date === 0
    ) {
      fieldErrors.event_start_date = "Start Date is required.";
    } else if (eventInput.event_start_date < currentDate) {
      fieldErrors.event_start_date = "Start Date is Invalid";
    } else if (
      eventInput.event_start_date !== "" &&
      eventInput.event_start_date > eventInput.event_end_date
    ) {
      fieldErrors.event_start_date = "Start Date is Invalid";
    }

    if (eventInput.event_end_date === "" || eventInput.event_end_date === 0) {
      fieldErrors.event_end_date = "End Date is required.";
    } else if (eventInput.event_end_date < currentDate) {
      fieldErrors.event_end_date = "End Date is Invalid";
    } else if (
      eventInput.event_end_date !== "" &&
      eventInput.event_end_date < eventInput.event_start_date
    ) {
      fieldErrors.event_end_date = "End Date is Invalid";
    }

    if (Object.keys(fieldErrors).length === 0) {
      let image = {};

      if (eventInput.new_image !== "") {
        image = eventInput.new_image;
      } else {
        image = eventInput.image;
      }

      const formData = new FormData();

      formData.append("image", image);
      formData.append("title", eventInput.title);
      formData.append("description", eventInput.description);
      formData.append("start_time", eventInput.start_time);
      formData.append("start_minute_time", eventInput.start_minute_time);
      formData.append("start_time_type", eventInput.start_time_type);
      formData.append("end_time", eventInput.end_time);
      formData.append("end_minute_time", eventInput.end_minute_time);
      formData.append("end_time_type", eventInput.end_time_type);
      formData.append("event_venue", eventInput.event_venue_name);
      formData.append("event_venue_name", eventInput.event_venue_name);
      formData.append(
        "event_venue_address_1",
        eventInput.event_venue_address_1
      );
      formData.append(
        "event_venue_address_2",
        eventInput.event_venue_address_1
      );

      formData.append("location", eventInput.city);
      formData.append("city", eventInput.city);
      formData.append("state", eventInput.state);
      formData.append("country", eventInput.country);
      formData.append("pincode", eventInput.pincode);
      formData.append("event_date", eventInput.event_start_date);
      formData.append("event_start_date", eventInput.event_start_date);
      formData.append("event_end_date", eventInput.event_end_date);
      formData.append("feedback", eventInput.feedback);
      formData.append("status", eventInput.status);
      formData.append("_method", "PUT");

      axios
        .post(`/api/events/${event_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("response", res);

          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setErrors({});

            history.push("/admin/all-events");
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");
            setErrors(res.data.errors);
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
            history.push("/admin/all-events");
          }
        })
        .finally(() => {
          setIsLoading(false);
          button.disabled = false;
        });
    } else {
      setErrors(fieldErrors);
    }
  };

  const fetchCountries = async () => {
    axios.get("/api/countries").then((res) => {
      if (res.data.status === 200) {
        setCountries(res.data.data);
      }
    });
  };

  const fetchStates = async (countryCode) => {
    if (countryCode) {
      axios.get(`/api/getStatesByCountryId/${countryCode}`).then((res) => {
        if (res.data.status === 200) {
          setStates(res.data.data);
        }
      });
    }
  };

  const fetchCities = async (stateCode) => {
    if (stateCode) {
      axios.get(`/api/getCitiesByStateId/${stateCode}`).then((res) => {
        if (res.data.status === 200) {
          setCities(res.data.data);
        }
      });
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStates(selectedCountry);
    fetchCities(selectedState);
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    fetchStates(countryCode);

    setEventInput((prevData) => ({
      ...prevData,
      country: countryCode,
      state: "",
      city: "",
    }));

    setStates([]);

    setCities([]);
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value;

    setSelectedState(stateCode);

    setEventInput((prevState) => ({
      ...prevState,
      state: stateCode,
      city: "",
    }));

    fetchCities(stateCode);

    setCities([]);
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setSelectedCity(value);
    setEventInput((prevData) => ({ ...prevData, city: value }));
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
            <h1 className="h3 mb-0 text-gray-800">Edit Event </h1>
            <Link
              to={`/admin/all-events`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i>&nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>
      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Edit Event</h6>
          </div>
          <div className="card-body">
            <form
              className="user mt-5"
              onSubmit={updateSubmit}
              encType="multipart/form-data"
            >
              {/* Title */}
              <div className="form-group row">
                <label
                  forhtml="title"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Event Title *
                </label>
                <div className="col-10">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    placeholder="Title"
                    onBlur={handleBlur}
                    name="title"
                    value={eventInput.title}
                    onChange={handleInput}
                    onFocus={handleInputFocus}
                  />
                  <p style={{ fontSize: "12px", float: "right" }}>
                    * Maximum 100 Characters Allowed.
                  </p>

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
              </div>

              {/* Description  */}
              <div className="form-group row">
                <label
                  forhtml="description"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Event Description *
                </label>
                <div className="col-10">
                  <textarea
                    type="textarea"
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    placeholder="Description"
                    name="description"
                    value={eventInput.description}
                    onChange={handleInput}
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
                    rows="6"
                  ></textarea>
                  <p style={{ fontSize: "12px", float: "right" }}>
                    * Maximum 3000 Characters Allowed.
                  </p>

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

              {/* File - Event Image  */}
              <div className="form-group row">
                <label
                  forhtml="file"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Upload Event Image *
                </label>
                <div className="col-10 col-lg-6">
                  <input
                    type="file"
                    className={`form-control ${
                      errors.new_image ? "is-invalid" : ""
                    }`}
                    placeholder="Description"
                    rows="6"
                    name="file"
                    onChange={handleImage}
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
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
                </div>

                <div className="col-10 col-lg-4 col-4">
                  <p style={{ fontSize: "12px" }}>
                    * Upload Event Banner upto 5 MB with JPG and PNG Format
                    Only.
                  </p>

                  {eventInput.new_image && (
                    <img
                      src={URL.createObjectURL(eventInput.new_image)}
                      width="60%"
                      alt="defaultUser"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}

                  {eventInput.image && !eventInput.new_image && (
                    <img
                      src={imageBaseUrl + eventInput.image}
                      width="60%"
                      alt={eventInput.image}
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}

                  {!eventInput.image && !eventInput.new_image && (
                    <img
                      src={DefaultBanner}
                      width="60%"
                      alt="defaultBanner"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>

              {/* Event Venue  */}

              <div className="form-group row">
                <label
                  forhtml="venue"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Event Venue *
                </label>

                <div className="col-10 mb-3 mb-sm-0">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.event_venue_name ? "is-invalid" : ""
                      }`}
                      placeholder="Venue Name"
                      name="event_venue_name"
                      value={eventInput.event_venue_name}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_venue_name && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_venue_name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.event_venue_address_1 ? "is-invalid" : ""
                      }`}
                      placeholder="Address Line 1"
                      name="event_venue_address_1"
                      value={eventInput.event_venue_address_1}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_venue_address_1 && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_venue_address_1}
                      </div>
                    )}
                  </div>

                  <div className="form-group row">
                    <div className="col-6 col-lg-3">
                      <select
                        className={`form-control ${
                          errors.country ? "is-invalid" : ""
                        }`}
                        name="country"
                        value={eventInput.country}
                        onChange={handleCountryChange}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                      >
                        <option value="">Select country</option>

                        {countries.length > 0 &&
                          countries.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>

                      {errors.country && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.country}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3 mb-3">
                      <select
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        name="state"
                        value={eventInput.state}
                        onChange={handleStateChange}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                      >
                        <option value="">Select State</option>

                        {states.length > 0 &&
                          states.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>

                      {errors.state && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.state}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3 mb-3">
                      <select
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        name="city"
                        value={eventInput.city}
                        onChange={handleCityChange}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                      >
                        <option value="">Select City</option>

                        {cities.length > 0 &&
                          cities.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>

                      {errors.city && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.city}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.pincode ? "is-invalid" : ""
                        }`}
                        placeholder="Pincode"
                        name="pincode"
                        value={eventInput.pincode}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        maxLength={6}
                      />

                      {errors.pincode && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event date */}
              <div className="form-group row">
                <label
                  forhtml="venue"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Event Start Date *
                </label>

                <div className="col-10 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    {/* <input
                      type="date"
                      className={`form-control ${
                        errors.event_date ? "is-invalid" : ""
                      }`}
                      name="event_start_date"
                      min={currentDate}
                      value={eventInput.event_start_date}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    /> */}

                    <DatePicker
                      selected={eventInput.event_start_date}
                      onChange={handleStartDateChange}
                      dateFormat="yyyy-MM-dd"
                      className={`form-control ${
                        errors.start_date ? "is-invalid" : ""
                      }`}
                      name="event_start_date"
                      minDate={new Date()} // or you can use minDate={currentDate}
                      value={eventInput.event_start_date}
                      placeholderText="YYYY-MM-DD"
                      showTimeSelect={false}
                    />

                    {errors.event_start_date && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_start_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event End date */}
              <div className="form-group row">
                <label
                  forhtml="venue"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Event End Date *
                </label>

                <div className="col-10 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <DatePicker
                      selected={eventInput.event_end_date}
                      onChange={handleEndDateChange}
                      dateFormat="yyyy-MM-dd"
                      className={`form-control ${
                        errors.event_end_date ? "is-invalid" : ""
                      }`}
                      name="event_end_date"
                      minDate={new Date()} // or you can use minDate={currentDate}
                      value={eventInput.event_end_date}
                      placeholderText="YYYY-MM-DD"
                      showTimeSelect={false}
                    />

                    {/* <input
                      type="date"
                      className={`form-control ${
                        errors.event_end_date ? "is-invalid" : ""
                      }`}
                      name="event_end_date"
                      min={currentDate}
                      value={eventInput.event_end_date}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    /> */}

                    {errors.event_end_date && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_end_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Start Time */}
              <div className="form-group row">
                <label
                  forhtml="venue"
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
                      value={eventInput.start_time}
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
                      value={eventInput.start_minute_time}
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
                          eventInput.start_time_type === "am" ||
                          eventInput.start_time_type === "AM"
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
                          eventInput.start_time_type === "pm" ||
                          eventInput.start_time_type === "PM"
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

              {/* Event Start Time */}
              <div className="form-group row">
                <label forhtml="venue" className="col-2 col-form-label">
                  Event End Time
                </label>

                <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.end_minute_time ? "is-invalid" : ""
                      }`}
                      name="end_time"
                      placeholder="Hour"
                      value={eventInput.end_time}
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
                      value={eventInput.end_minute_time}
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
                          eventInput.end_time_type === "am" ||
                          eventInput.end_time_type === "AM"
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
                          eventInput.end_time_type === "pm" ||
                          eventInput.end_time_type === "PM"
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
              </div>

              {/* Feedback */}
              <div className="form-group row">
                <label
                  forhtml="venue"
                  className="col-12 col-lg-2 col-lg-2 col-form-label"
                >
                  Feedback
                </label>

                <div className="col-6 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group mx-3 d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="feedback"
                        value="1"
                        checked={eventInput.feedback == "1"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio1"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="feedback"
                        value="0"
                        checked={eventInput.feedback == "0"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio2"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="form-group row">
                <label
                  forhtml="venue"
                  className="col-12 col-lg-2 col-form-label"
                >
                  Status
                </label>

                <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                  <div className="form-group mx-3 d-inline-block">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="0"
                        checked={eventInput.status === "0"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio1"
                      >
                        Pending
                      </label>
                    </div>

                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="1"
                        checked={eventInput.status === "1"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio2"
                      >
                        Activate
                      </label>
                    </div>

                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="2"
                        checked={eventInput.status === "2"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forhtml="inlineRadio3"
                      >
                        Cancel
                      </label>
                    </div>
                  </div>
                </div>
              </div>

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
                    alt="Loading..."
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditEvent;
