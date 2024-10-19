import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButtonGroup,
  CFormCheck,
  CSpinner,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ToastNotification from '../../../components/ToasterNotification.jsx'

import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { CTooltip } from '@coreui/react'

import apiService from '../../../service/apiService'

const CandidateForm = ({ mode, candidateData }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSummary, setProfileSummary] = useState('')
  const [experiences, setExperiences] = useState([
    { position: '', company: '', startDate: '', endDate: '', description: '' },
  ])
  const [loading, setLoading] = useState(false)
  const [inputMode, setInputMode] = useState('manual')
  const [toastDeets, setToastDeets] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'edit' && candidateData) {
      setName(candidateData.name || '')
      setEmail(candidateData.email || candidateData.externalEmail || '')
      setLocation(candidateData.location || '')
      setPhone(candidateData.phone || '')
      setProfileSummary(candidateData.profileSummary || '')
      setExperiences(
        candidateData.experiences?.length
          ? candidateData.experiences
          : [{ position: '', company: '', startDate: '', endDate: '', description: '' }],
      )
    }
  }, [mode, candidateData])

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    )
    setExperiences(updatedExperiences)
  }

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { position: '', company: '', startDate: '', endDate: '', description: '' },
    ])
  }

  const removeExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index)
    setExperiences(updatedExperiences)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const candidate = { name, email, location: location, phone, profileSummary, experiences }

    try {
      if (mode === 'add') {
        // Call API to add candidate
        await apiService.post('/candidates', candidate)
        setToastDeets({
          type: 'success',
          message: 'Candidate added succesfully',
          title: 'Add Candidate',
        })
      } else {
        // Call API to update candidate
        await apiService.put('/candidates/' + candidateData.id, candidate)
        setToastDeets({
          type: 'success',
          message: 'Candidate updated succesfully',
          title: 'Edit Candidate',
        })
      }
      //navigate('/candidates') // Redirect after submit
    } catch (error) {
        console.log(error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Candidates',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {' '}
      <CForm onSubmit={handleSubmit}>
        <CCard>
          <CCardHeader as="h5" className="text-center">
            {mode === 'add' ? 'Add Candidate' : 'Edit Candidate'}
          </CCardHeader>

          <CCardBody className="mx-3">
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  label="Name"
                  required
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  label="Email"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  label="Phone"
                  required
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  label="Location"
                  required
                />
              </CCol>
            </CRow>

            <CCard>
              <CCardHeader as="h5" className="text-center">
                Profile Summary
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-3">
                  <CCol>
                    <h5>Profile Summary</h5>
                    <ReactQuill
                      value={profileSummary}
                      onChange={setProfileSummary}
                      placeholder="Profile Summary"
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <CCard className="my-3">
              <CCardHeader as="h5" className="text-center">
                Experience
              </CCardHeader>

              <CCardBody className="mx-3">
                <CRow className="my-3">
                  <CButtonGroup role="group" aria-label="Basic radio toggle button group">
                    <CFormCheck
                      type="radio"
                      button={{ color: 'primary', variant: 'outline' }}
                      name="inputMode"
                      id="manualInput"
                      autoComplete="off"
                      label="Manual Input"
                      checked={inputMode === 'manual'}
                      onChange={() => setInputMode('manual')}
                    />
                    <CFormCheck
                      type="radio"
                      button={{ color: 'primary', variant: 'outline' }}
                      name="inputMode"
                      id="uploadResume"
                      autoComplete="off"
                      label="Upload Resume"
                      checked={inputMode === 'upload'}
                      onChange={() => setInputMode('upload')}
                    />
                  </CButtonGroup>
                </CRow>
              </CCardBody>

              {inputMode === 'manual' ? (
                <CCardBody className="mx-3">
                  <CRow>
                    {experiences.map((experience, index) => (
                      <div key={index} className="mb-4">
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              type="text"
                              value={experience.position}
                              onChange={(e) =>
                                handleExperienceChange(index, 'position', e.target.value)
                              }
                              placeholder="Position Title"
                              label="Position Title"
                              required
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="text"
                              value={experience.company}
                              onChange={(e) =>
                                handleExperienceChange(index, 'company', e.target.value)
                              }
                              placeholder="Company"
                              label="Company"
                              required
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <label>Start Date</label>
                            <CFormInput
                              type="date"
                              value={experience.startDate}
                              onChange={(e) =>
                                handleExperienceChange(index, 'startDate', e.target.value)
                              }
                              required
                            />
                          </CCol>
                          <CCol>
                            <label>End Date</label>
                            <CFormInput
                              type="date"
                              value={experience.endDate}
                              onChange={(e) =>
                                handleExperienceChange(index, 'endDate', e.target.value)
                              }
                              required
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <ReactQuill
                              value={experience.description}
                              onChange={(value) =>
                                handleExperienceChange(index, 'description', value)
                              }
                              placeholder="Description"
                            />
                          </CCol>
                        </CRow>
                        {experiences.length > 1 && (
                          <CTooltip content="Remove Experience">
                            <CButton
                              color="danger"
                              onClick={() => removeExperience(index)}
                              className="mb-3"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTooltip>
                        )}
                      </div>
                    ))}
                  </CRow>
                  <CRow className="d-grid gap-2 col-6 mx-auto">
                    <CButton color="info" onClick={addExperience} className="mb-3" size="sm">
                      Add Experience
                    </CButton>
                  </CRow>
                </CCardBody>
              ) : (
                <CCardBody className="mx-5">
                  <CRow className="mb-3">
                    <CFormInput type="file" accept=".pdf, .doc, .docx" required />
                  </CRow>
                </CCardBody>
              )}
            </CCard>
          </CCardBody>
        </CCard>

        <CRow className="my-3">
          <CCol>
          <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                  Back
                </CButton>
            <CButton type="submit" color="primary" className="me-2">
              {loading ? (
                <CSpinner size="sm" />
              ) : mode === 'add' ? (
                'Add Candidate'
              ) : (
                'Update Candidate'
              )}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      <ToastNotification deets={toastDeets} />
    </>
  )
}

const AddCandidatePage = () => {
  return <CandidateForm mode="add" />
}

const EditCandidatePage = () => {
  const { id } = useParams()
  const [candidateData, setCandidateData] = useState(null)

  useEffect(() => {
    const fetchCandidate = async () => {
      const response = await apiService.get('/candidates/' + id)
      setCandidateData(response)
    }
    fetchCandidate()
  }, [id])

  return candidateData ? (
    <CandidateForm mode="edit" candidateData={candidateData} />
  ) : (
    <div>Loading...</div>
  )
}

export { AddCandidatePage, EditCandidatePage }
