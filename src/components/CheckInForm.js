import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './checkInForm.css'

const CheckInForm = (props) => {
  const queryParams = new URLSearchParams(props.location.search);
  const eventUUID = queryParams.get('eventuuid');
  const [event, setEvent] = useState({});
  const [eventTitle, setEventTitle] = useState('');
  const [userID, setUserID] = useState(null);
  const [eventID, setEventID] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    company: '',
    otp: '',
    eventName: eventTitle
  });
  const [isVerified, setIsVerified] = useState(false);  
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  useEffect(() => {
    axios.get(`https://api.klout.club/api/events/${eventUUID}`).then((res) => {
      if (res.data.status === 200) {
        setEvent(res.data.data);
        setUserID(res.data.data.user_id);
        setEventID(res.data.data.id);
        setEventTitle(res.data.data.title);
      }
    });
  }, [eventUUID]);

  const handleChange = (e) => {
    setFormData({ ...formData, eventName: eventTitle , [e.target.name]: e.target.value });
  };

  const validate = () => {
    let formErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.email || !emailPattern.test(formData.email))
      formErrors.email = 'Valid email is required';
    if (!formData.mobile || !mobilePattern.test(formData.mobile))
      formErrors.mobile = 'Valid mobile number is required';
    if (!formData.designation) formErrors.designation = 'Designation is required';
    if (!formData.company) formErrors.company = 'Company is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Send OTP function
  const sendOtp = () => {
    if (formData.mobile.length === 10) {
      axios.post('https://app.klout.club/api/organiser/v1/event-checkin/send-otp', { mobileNumber: formData.mobile*1 } , {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (res.data.status) {
            setOtpSent(true); 
          }
        });
    } else {
      setErrors({ mobile: 'Valid mobile number is required' });
    }
  };

  // Verify OTP function
  const verifyOtp = (e) => {
    e.preventDefault();
    if (formData.otp) {
      axios.post('https://app.klout.club/api/organiser/v1/event-checkin/verify-otp', { mobileNumber: formData.mobile, otp: formData.otp }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (res.data.data) {
            setIsVerified(true);
            axios.post('https://app.klout.club/api/organiser/v1/event-checkin/existing-user', { mobile: formData.mobile*1, eventID, userID }, {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => {
              if(res.data.data.length > 0){
                setFormData({ ...formData , name: res.data.data[0].name, email: res.data.data[0].email, designation: res.data.data[0].designation, company: res.data.data[0].company })
              }
            })

            setErrors({});
          } else {
            setErrors({ otp: 'Invalid OTP' });
          }
        });
    }
  };

  function getFirstName(fullName) {
    const nameParts = fullName.trim().split(' ');  
    return nameParts[0];
  }

  function getLastName(fullName) {
    const nameParts = fullName.trim().split(' ');
    return nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && isVerified) {
      axios.post('https://app.klout.club/api/organiser/v1//event-checkin/check-in', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === true) {
          axios.post('https://api.klout.club/api/accept_decline_event_invitation', { 
            user_id: userID,
            event_uuid: eventUUID,
            email: formData.email,
            phone_number: formData.mobile,
            acceptance: '1',
            first_name: getFirstName(formData.name),
            last_name: getLastName(formData.name),
            job_title: formData.designation,
            company_name: formData.company,
            industry: 'Others'
           }, {
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => {
            if(res.data.status == 200){
              history.push('/success');
            }
          })
          
        }
      });
    }
  };

  return (
    <div className="container-fluid custom-container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10" style={{marginTop: "80px"}}>
          <div className="card shadow">
            <div className="card-body" style={{ backgroundColor: '#ecf0f1' }}>
              <h2 className="text-center mb-4" style={{ color: '#333' }}>Registration for <u>{event.title}</u></h2>
              
              {!otpSent && (
                <div>
                  {/* Mobile Input and OTP Button */}
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>
                  <button type="button" className="btn btn-primary w-100" onClick={sendOtp}>
                    Send OTP
                  </button>
                </div>
              )}

              {otpSent && !isVerified && (
                <div>
                  {/* OTP Input */}
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">Enter OTP</label>
                    <input
                      type="text"
                      className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                  </div>
                  <button type="button" className="btn btn-primary w-100" onClick={verifyOtp}>
                  {/* <button type="button" className="btn btn-primary w-100"> */}

                    Verify OTP
                  </button>
                </div>
              )}

              {isVerified && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Official Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="designation" className="form-label">Designation</label>
                    <input
                      type="text"
                      className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="company" className="form-label">Company</label>
                    <input
                      type="text"
                      className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      style={{ borderColor: '#007bff' }}
                    />
                    {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInForm;
