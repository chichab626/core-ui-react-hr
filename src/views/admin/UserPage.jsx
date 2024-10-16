import React, { useState, useEffect } from 'react'
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
  CSpinner
} from '@coreui/react'
import apiService from '../../service/apiService.js'
import SalaryInput from '../../components/SalaryInput'
import ToastNotification from '../../components/ToasterNotification.jsx'

const UserPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(null)
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('') // Read-only for employees
  const [reportsTo, setReportsTo] = useState('') // Read-only for employees

  const [toastDeets, setToastDeets] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await apiService.get('/users/11') // Assuming this endpoint exists
      setEmail(userData.email)
      setRole({ value: userData.role, label: userData.role })

      const empData = await apiService.get('employee?userId=11')
      console.log(empData)
      setName(empData[0]?.name || '')
      setJobTitle(empData[0]?.jobTitle || '')
      setLocation(empData[0]?.location || '')
      setSalary(empData[0]?.salary || '')
      setReportsTo(empData[0]?.reportsTo || 'None')
    } catch (error) {
      notify('danger', 'Failed to fetch user data', 'Error')
    }
  }

  const roleOptions = [
    { value: 'HRManager', label: 'HR Manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Administrator', label: 'Administrator' },
  ]

  const notify = (type, message, title) => {
    setToastDeets({type, message, title})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (password && password !== confirmPassword) {
      notify('danger', 'Passwords do not match', 'Error')
      setLoading(false)
      return
    }

    const updatedUser = {
      email,
      ...(password && { password }),
      role: role.value,
      ...(role.value === 'Employee' && {
        name,
        jobTitle,
        location,
      }),
    }

    try {
      await apiService.put('/users/me', updatedUser) // Assuming this endpoint exists
      notify('success', 'Profile updated successfully', 'Success')
    } catch (error) {
      console.log(error)
      notify('danger', 'An error occurred while updating the profile.', 'Update Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <CCard className="bg-dark text-light">
          <CCardHeader as="h5" className="text-center">
            Edit Profile
          </CCardHeader>
          <CCardBody className="mx-3">
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                   value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Confirm Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Role</CFormLabel>
                <Select
                  value={role}
                  editable="true"
                  onChange={(option) => setRole(option)}
                  options={roleOptions}
                  isDisabled="true"
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
            {role && role.value === 'Employee' && (
              <>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Job Title</CFormLabel>
                    <CFormInput
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      readOnly="true"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Location</CFormLabel>
                    <CFormInput
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Salary</CFormLabel>
                    <SalaryInput
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      readOnly="true" // Read-only for employees
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Reports To</CFormLabel>
                    <CFormInput
                      type="text"
                      value={reportsTo}
                      onChange={(e) => setReportsTo(e.target.value)}
                      disabled={true} // Read-only for employees
                    />
                  </CCol>
                </CRow>
              </>
            )}
            <CRow className="mb-3">
              <CCol className="text-center">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? (
                    <CSpinner component="span" size="sm" aria-hidden="true" />
                  ) : (
                    'Save Changes'
                  )}
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
      <ToastNotification {...toastDeets} />
    </>
  )
}

export default UserPage