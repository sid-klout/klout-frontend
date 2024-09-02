import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const CheckInForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    company: '',
  });

  const [errors, setErrors] = useState({});
  const history = useHistory();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post('https://app.klout.club/api/mapping/v1/company-master/check-in', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if(res.data.status === true){
          history.push('/success');
        }
      })
      
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#2c3e50', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-body" style={{ backgroundColor: '#ecf0f1' }}>
              <h2 className="text-center mb-4" style={{ color: '#333' }}>8th L&D Confex and Awards Check-In</h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInForm;
