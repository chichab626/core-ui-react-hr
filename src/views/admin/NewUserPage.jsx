import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  CSpinner,
} from '@coreui/react'
import apiService from '../../service/apiService.js'
import SalaryInput from '../../components/SalaryInput'
import ToastNotification from '../../components/ToasterNotification.jsx'

const NewUserPage = () => {
  const location = useLocation()

  const roleOptions = [
    { value: 'HR', label: 'HR Manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Administrator', label: 'Administrator' },
  ]

  const data = location?.state?.response
  const [email, setEmail] = useState('')
  const [externalEmail, setExternalEmail] = useState(data?.candidate?.externalEmail || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(location?.state ? roleOptions[1] : null)
  const [name, setName] = useState(data?.candidate?.name || '')
  const [jobTitle, setJobTitle] = useState(data?.job?.title || '')
  const [locationField, setLocationField] = useState(data?.candidate?.location || '')
  const [salary, setSalary] = useState('')

  const [toastDeets, setToastDeets] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole)
  }

  const notify = (type, message, title) => {
    setToastDeets({ type, message, title })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const newUser = {
      email,
      password,
      role: role.value,
      ...(role.value === 'Employee' && {
        name,
        jobTitle,
        location: locationField,
        salary,
        reportsTo: data?.job?.hiringManagerId,
        externalEmail: data?.candidate?.externalEmail,
        candidateId: data?.candidateId,
        jobId: data?.job?.id,
      }),
    }

    try {
      const response = await apiService.post('/users', newUser)
      let successMessage = `Created successfully with User ID: ${response.user.id}`
      let messageType = 'success'
      if (role.value === 'Employee') {
        successMessage = `Employee User created successfully. User Id ${response.user.id} Employee Id ${response.employee.id}`
      }

      if (data && data.candidateId) {
        // this is a redirect from candidates page.
        messageType = 'info'
        successMessage = `Employee User created. An onboarding letter will be drafted for ${newUser.name}` 
        const candidateId = data?.candidateId
        apiService.post('letters/draft-letters', { letterType: 'Onboarding', applicants: [{
            candidateId : candidateId,
            name: newUser.name, 
            email: newUser.externalEmail,
            jobId : newUser.jobId,
            companyEmail : newUser.email,
            password
        }], jobTitle: jobTitle})
      }

      notify(messageType, successMessage, 'Create User')
    } catch (error) {
      console.log(error)
      notify(
        'danger',
        'An error occurred while creating the user: ' + error?.response?.data?.message ||
          error.message,
        'Create User Error',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <CCard className="bg-dark text-light">
          <CCardHeader as="h5" className="text-center">
            Create New User
          </CCardHeader>
          <CCardBody className="mx-3">
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Company Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </CCol>
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
                      primary25: '#495057',
                      primary: '#ced4da',
                      neutral0: 'rgb(33 38 49)',
                      neutral80: '#fff',
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
                      name="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CCol>
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

                <CRow className="mb-3"></CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>External Email</CFormLabel>
                    <CFormInput
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={externalEmail}
                      onChange={(e) => setExternalEmail(e.target.value)}
                      required
                    />
                  </CCol>
                  <CCol>
                    <CFormLabel>Location</CFormLabel>
                    <CFormInput
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={locationField}
                      onChange={(e) => setLocationField(e.target.value)}
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3"></CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Salary (Optional)</CFormLabel>
                    <SalaryInput value={salary} onChange={setSalary} readOnly={false} />
                  </CCol>
                </CRow>
              </>
            )}

            <CRow>
              <CCol className="text-end">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Create User'}
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
      <ToastNotification deets={toastDeets} />
    </>
  )
}

export default NewUserPage
