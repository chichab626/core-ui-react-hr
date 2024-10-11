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
import SalaryInput from '../../components/SalaryInput'

const NewUserPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(null)
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('') // Salary is optional
  const [validation, setValidation] = useState({}) // Validation state
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const roleOptions = [
    { value: 'HRManager', label: 'HR Manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Administrator', label: 'Administrator' },
  ]

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password || !role) {
      setValidation({ error: 'Please fill in all required fields.' })
      return
    }

    // Additional validation if role is 'Employee'
    if (role.value === 'Employee') {
      if (!name || !jobTitle || !location) {
        setValidation({ error: 'Please fill in all required fields for Employee.' })
        return
      }
    }

    const newUser = {
      email,
      password,
      role: role.value,
      ...(role.value === 'Employee' && {
        name,
        jobTitle,
        location,
        salary, // Optional field
      }),
    }

    try {
      const response = await apiService.post('/users', newUser) // Post to /users endpoint

      let successMessage = `Created successfully with User ID: ${response.user.id}`
      if (role.value === 'Employee') {
        successMessage = `Employee User created successfully. User Id ${response.user.id} Employee Id ${response.employee.id}`
      }
      setSuccessMessage(successMessage)
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Role</CFormLabel>
              <Select
                value={role}
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
          {role && role.value === 'Employee' && (
            <>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Salary (Optional)</CFormLabel>
                  <SalaryInput
                    value={salary} // Pass the salary value
                    onChange={setSalary} // Pass the setter to update the salary
                    readOnly={false}
                    validationError={validation.salary}
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