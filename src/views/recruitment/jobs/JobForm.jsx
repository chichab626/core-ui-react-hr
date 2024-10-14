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
  const quillRef = useRef(null);

  useEffect(() => {
    if (mode === 'edit' || (mode === 'view' && jobData)) {
      setJobTitle(jobData.jobTitle)
      setLocation(jobData.location)
      setSalary(jobData.salary)
      setOpenPositions(jobData.openPositions)
      setJobDescription(jobData.jobDescription)
      setHiringManager(jobData.hiringManager)
    }

    // Mock API call to fetch hiring managers
    const fetchHiringManagers = async () => {
      const result = await apiService.get(`/employee`)

      let managersData = []
      result.forEach((element) => {
        managersData.push({ value: element.id, label: element.name })
      })
      setManagers(managersData)
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
      }

      setToastDeets({
        type: 'success',
        message: 'Job added succesfully',
        title: 'Add Job',
      })
    } catch (error) {
      console.error(error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred while adding the job',
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
                  label="Input Job Title"
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
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

  useEffect(() => {
    const fetchJob = async () => {
      const data = {
        jobTitle: 'Pharmacist',
        location: 'Saint-Claude',
        salary: 179240,
        openPositions: 3,
        jobDescription: 'Describe the job and skills required',
      }
      setJobData(data)
    }
    fetchJob()
  }, [id])

  return jobData ? <JobForm mode="view" jobData={jobData} /> : <CSpinner />
}

const EditJobPage = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      const data = {
        jobTitle: 'Pharmacist',
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
