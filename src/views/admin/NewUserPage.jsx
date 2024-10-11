import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import {
  CForm,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import apiService from '../../service/apiService.js'

const NewUserPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: null,
    name: '',
    jobTitle: '',
    location: '',
    salary: '', // Salary is optional
  });
  const [validation, setValidation] = useState({}); // Validation state
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'HRManager', label: 'HR Manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Administrator', label: 'Administrator' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleRoleChange = (selectedRole) => {
    setUserData({ ...userData, role: selectedRole })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!userData.email || !userData.password || !userData.role) {
      setValidation({ error: 'Please fill in all required fields.' });
      return;
    }

    // Additional validation if role is 'Employee'
    if (userData.role.value === 'Employee') {
      if (!userData.name || !userData.jobTitle || !userData.location) {
        setValidation({ error: 'Please fill in all required fields for Employee.' });
        return;
      }
    }

    const newUser = {
      email: userData.email,
      password: userData.password,
      role: userData.role.value,
      ...(userData.role.value === 'Employee' && {
        name: userData.name,
        jobTitle: userData.jobTitle,
        location: userData.location,
        salary: userData.salary, // Optional field
      }),
    };

    try {
      const response = await apiService.post('/users', newUser) // Post to /users endpoint
      setSuccessMessage(`User created successfully with ID: ${response.id}`)
    } catch (error) {
      console.log(error)
      setValidation({ error: 'An error occurred while creating the user.' })
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CCard className="bg-dark text-light">
        <CCardHeader as="h5" className="text-center">
          Create New User
        </CCardHeader>
        <CCardBody className="mx-3">
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                placeholder="Enter email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Password</CFormLabel>
              <CFormInput
                type="password"
                name="password"
                placeholder="Enter password"
                value={userData.password}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Role</CFormLabel>
              <Select
                value={userData.role}
                onChange={handleRoleChange}
                options={roleOptions}
                placeholder="Select role"
                isSearchable
                required
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: '#495057', // Hover color for options
                    primary: '#ced4da', // Border and active color
                    neutral0: 'rgb(33 38 49)', // Dark background
                    neutral80: '#fff', // Text color
                  },
                })}
              />
            </CCol>
          </CRow>

          {/* Additional Fields when Employee is selected */}
          {userData.role && userData.role.value === 'Employee' && (
            <>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Job Title</CFormLabel>
                  <CFormInput
                    type="text"
                    name="jobTitle"
                    placeholder="Enter job title"
                    value={userData.jobTitle}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Location</CFormLabel>
                  <CFormInput
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={userData.location}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Salary (Optional)</CFormLabel>
                  <CFormInput
                    type="text"
                    name="salary"
                    placeholder="Enter salary (if applicable)"
                    value={userData.salary}
                    onChange={handleInputChange}
                  />
                </CCol>
              </CRow>
            </>
          )}

          {validation.error && <div className="text-danger mb-3">{validation.error}</div>}
          {successMessage && <div className="text-success mb-3">{successMessage}</div>}

          <CRow>
            <CCol className="text-end">
              <CButton type="submit" color="primary">
                Create User
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CForm>
  )
}

export default NewUserPage
