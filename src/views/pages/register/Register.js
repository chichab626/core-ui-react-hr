import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilPhone, cilLocationPin} from '@coreui/icons';
import apiService from '../../../service/apiService.js'; // Ensure this path is correct
import ToastNotification from '../../../components/ToasterNotification.jsx'; // Ensure this component exists

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastDeets, setToastDeets] = useState({});
  const notify = (type, message, title) => setToastDeets({ type, message, title });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notify('error', 'Please enter a valid email address.', 'Validation Error');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      notify('error', 'Passwords do not match.', 'Validation Error');
      setLoading(false);
      return;
    }

    if (!name || !phone || !location) {
      notify('error', 'All fields are required.', 'Validation Error');
      setLoading(false);
      return;
    }

    const newUser = {
      email,
      password,
      name,
      phone,
      location,
      role : 'Guest'
    };

    try {
      const response = await apiService.post('/users', newUser); // Update endpoint as needed
      notify('success', `Account created successfully! Go to Login Page.`, 'Registration Complete');
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
      notify('error', 'An error occurred during registration. Please try again.', 'API Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  {/* Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Phone */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Location */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
                    <CFormInput
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Confirm Password */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton type="submit" color="success" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <ToastNotification deets={toastDeets} />
    </div>
  );
};

export default Register;
