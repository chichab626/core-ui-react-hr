import React, { useState, useEffect, useRef } from 'react'
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
  CFormLabel,
} from '@coreui/react'
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SalaryInput from '../../../components/SalaryInput'
import apiService from '../../../service/apiService'
import ToastNotification from '../../../components/ToasterNotification.jsx'

const JobForm = ({ mode, jobData }) => {
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [openPositions, setOpenPositions] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [hiringManager, setHiringManager] = useState(null)
  const [managers, setManagers] = useState([])
  const [toastDeets, setToastDeets] = useState({})
  const navigate = useNavigate()
  const quillRef = useRef(null)

  const fetchHiringManagers = async () => {
    const result = await apiService.get(`/employee`)

    let managersData = []
    result.forEach((element) => {
      managersData.push({ value: element.id, label: element.name })
      if (jobData?.hiringManagerId ===  element.id) {
        setHiringManager({ value: element.id, label: element.name })
      }
    })
    setManagers(managersData)

  }

  useEffect(() => {
    if (mode === 'edit' || (mode === 'view' && jobData)) {
      setJobTitle(jobData.title)
      setLocation(jobData.location)
      setSalary(jobData.salary)
      setOpenPositions(jobData.openPositions)
      setJobDescription(jobData.description)
    }

    fetchHiringManagers()
    
  }, [mode, jobData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let newJob = {
        jobTitle,
        location,
        salary,
        openPositions,
        jobDescription,
        hiringManagerId: hiringManager?.value,
      }

      if (mode === 'add') {
        await apiService.post('/job', newJob)
      } else {
        await apiService.put(`/job/${jobData.id}`, newJob)
      }

      setToastDeets({
        type: 'success',
        message: `Job ${mode === 'add' ? "added" : "edited"} succesfully`,
        title: 'Add Job',
      })
    } catch (error) {
      console.error(error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message,
        title: 'Add Job',
      })
    }

    // navigate('/jobs') // Redirect after submit
  }

  return (
    <>
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
                  label="Job Title"
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Input Job Title"
                  required
                  readOnly={mode === 'view'}
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Input Location"
                  required
                  readOnly={mode === 'view'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <SalaryInput
                  label="Salary"
                  value={salary}
                  onChange={setSalary}
                  readOnly={mode === 'view'}
                  required
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  label="Open Positions"
                  value={openPositions}
                  onChange={(e) => setOpenPositions(e.target.value)}
                  placeholder="Input Open Positions"
                  required
                  readOnly={mode === 'view'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Hiring Manager</CFormLabel>
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
                      primary25: '#495057',
                      primary: '#ced4da',
                      neutral0: 'rgb(33 38 49)',
                      neutral80: '#fff',
                      neutral20: '#6c757d',
                    },
                  })}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <ReactQuill
                  ref={quillRef}
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
      <ToastNotification deets={toastDeets} />
    </>
  )
}

const AddJobPage = () => <JobForm mode="add" />
const ViewJobPage = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        const response = await apiService.get(`/job/${id}`)
        setJobData(response.data)
      } catch (error) {
        console.error('Error fetching job data:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (isLoading) {
    return <CSpinner />
  }

  return jobData ? <JobForm mode="view" jobData={jobData} /> : <div>Job not found</div>
}

const EditJobPage = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        const response = await apiService.get(`/job/${id}`)
        setJobData(response)
      } catch (error) {
        console.error('Error fetching job data:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (isLoading) {
    return <CSpinner />
  }

  return jobData ? <JobForm mode="edit" jobData={jobData} /> : <div>Job not found</div>
}

export { AddJobPage, EditJobPage, ViewJobPage }
