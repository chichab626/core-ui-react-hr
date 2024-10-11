import React, { useState, useEffect } from 'react'
import {
  CForm,
  CButton,
  CFormInput,
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select' // Import react-select
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SalaryInput from '../../../components/SalaryInput'

const JobForm = ({ mode, jobData }) => {
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('') // Keep the salary state here
  const [openPositions, setOpenPositions] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [hiringManager, setHiringManager] = useState(null)
  const [managers, setManagers] = useState([])
  const [validation, setValidation] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'edit' || (mode === 'view' && jobData)) {
      setJobTitle(jobData.jobTitle)
      setLocation(jobData.location)
      setSalary(jobData.salary) // Initialize the salary value
      setOpenPositions(jobData.openPositions)
      setJobDescription(jobData.jobDescription)
      setHiringManager(jobData.hiringManager) // Pre-select the manager in edit/view mode
    }

    // Mock API call to fetch hiring managers
    const fetchHiringManagers = async () => {
      const managersData = [
        { value: 1, label: 'John Doe' },
        { value: 2, label: 'Jane Smith' },
        { value: 3, label: 'Alice Johnson' },
      ]
      setManagers(managersData)
    }
    fetchHiringManagers()
  }, [mode, jobData])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simple validation
    const newValidation = {}
    if (!jobTitle) newValidation.jobTitle = 'Job Title is required'
    if (!location) newValidation.location = 'Location is required'
    if (!salary) newValidation.salary = 'Valid salary is required'
    if (!openPositions || isNaN(openPositions))
      newValidation.openPositions = 'Valid number of open positions is required'
    if (!hiringManager) newValidation.hiringManager = 'Hiring Manager is required'

    setValidation(newValidation)

    if (Object.keys(newValidation).length === 0) {
      if (mode === 'add') {
        // Call API to add job
      } else {
        // Call API to update job
      }

      let newJob = {
        jobTitle,
        location,
        salary, // Sanitized salary is already passed
        openPositions,
        jobDescription,
        hiringManagerId: hiringManager?.value,
      }

      console.log(JSON.stringify(newJob, null, 2))
      // navigate('/jobs') // Redirect after submit
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CCard>
        <CCardHeader as="h5" className="text-center">
          {mode === 'add' ? 'Add Job' : mode === 'edit' ? 'Edit Job' : 'View Job'}
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                invalid={!!validation.jobTitle}
                readOnly={mode === 'view'}
              />
              {validation.jobTitle && <div className="invalid-feedback">{validation.jobTitle}</div>}
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                invalid={!!validation.location}
                readOnly={mode === 'view'}
              />
              {validation.location && <div className="invalid-feedback">{validation.location}</div>}
            </CCol>
          </CRow>

          {/* Replaced Salary Input with SalaryInput Component */}
          <CRow className="mb-3">
            <CCol>
              <SalaryInput
                value={salary} // Pass the salary value
                onChange={setSalary} // Pass the setter to update the parent
                readOnly={mode === 'view'}
                validationError={validation.salary}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="number"
                value={openPositions}
                onChange={(e) => setOpenPositions(e.target.value)}
                placeholder="Open Positions"
                invalid={!!validation.openPositions}
                readOnly={mode === 'view'}
              />
              {validation.openPositions && (
                <div className="invalid-feedback">{validation.openPositions}</div>
              )}
            </CCol>
          </CRow>

          {/* Hiring Manager Select */}
          <CRow className="mb-3">
            <CCol>
              <Select
                value={hiringManager}
                onChange={setHiringManager}
                options={managers}
                isDisabled={mode === 'view'}
                placeholder="Select Hiring Manager"
                theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: '#495057',  // Hover color for options
                      primary: '#ced4da',    // Border and active color
                      neutral0: 'rgb(33 38 49)',   // Dark background for menu and control
                      neutral80: '#fff',     // Text color
                      neutral20: '#6c757d',  // Border color
                    },
                  })}
              />
              {validation.hiringManager && (
                <div className="invalid-feedback">{validation.hiringManager}</div>
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <ReactQuill
                value={jobDescription}
                onChange={setJobDescription}
                placeholder="Job Description"
                readOnly={mode === 'view'}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                Back
              </CButton>

              {mode !== 'view' && (
                <CButton type="submit" color="primary">
                  {mode === 'add' ? 'Add Job' : 'Update Job'}
                </CButton>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CForm>
  )
}

const AddJobPage = () => {
  return <JobForm mode="add" />
}

const ViewJobPage = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      // Mock data for testing
      const data = {
        jobTitle: 'Pharmacist',
        status: true,
        datePosted: '2023-12-26',
        location: 'Saint-Claude',
        salary: 179240,
        openPositions: 3,
        jobDescription: 'Describe the job and skills required',
      }
      setJobData(data)
    }
    fetchJob()
  }, [id])

  return jobData ? <JobForm mode="edit" jobData={jobData} /> : <CSpinner />
}

const EditJobPage = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      // Mock data for testing
      const data = {
        jobTitle: 'Pharmacist',
        status: true,
        datePosted: '2023-12-26',
        location: 'Saint-Claude',
        salary: 179240,
        openPositions: 3,
        jobDescription: 'Describe the job and skills required',
      }
      setJobData(data)
    }
    fetchJob()
  }, [id])

  return jobData ? <JobForm mode="edit" jobData={jobData} /> : <CSpinner />
}

export { AddJobPage, EditJobPage, ViewJobPage }
