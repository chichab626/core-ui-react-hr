import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CCol,
  CRow,
  CBadge,
  CCard,
  CCardBody,
  CCardText,
  CCardHeader,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { CTooltip } from '@coreui/react'

const CandidateForm = ({ mode, candidateData }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('');
  const [profileSummary, setProfileSummary] = useState('')
  const [experiences, setExperiences] = useState([
    { position: '', company: '', startDate: null, endDate: null, description: '' },
  ])
  const [validation, setValidation] = useState({})
  const [inputMode, setInputMode] = useState('manual') // Track selected input mode
  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'edit' && candidateData) {
      setName(candidateData.name)
      setEmail(candidateData.email)
      setCity(candidateData.city)
      setPhone(candidateData.phone)
      setProfileSummary(candidateData.profileSummary)
      setExperiences(
        candidateData.experiences || [
          { position: '', company: '', startDate: null, endDate: null, description: '' },
        ],
      )
    }

    console.log(experiences)
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
      { position: '', company: '', startDate: null, endDate: null, description: '' },
    ])
  }

  const removeExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index)
    setExperiences(updatedExperiences)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const candidate = { name, email, city, profileSummary, experiences }

    const newValidation = {}
    if (!name) newValidation.name = 'Name is required'
    if (!email) newValidation.email = 'Email is required'
    if (!city) newValidation.city = 'City is required'
    if (!phone) newValidation.phone = 'Phone is required'

    setValidation(newValidation)

    if (Object.keys(newValidation).length === 0) {
      if (mode === 'add') {
        // Call API to add candidate
      } else {
        // Call API to update candidate
      }
      navigate('/candidates') // Redirect after submit
    }
  }

  return (
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
                invalid={!!validation.name}
              />
              {validation.name && <div className="invalid-feedback">{validation.name}</div>}
            </CCol>
            <CCol>
              <CFormInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                invalid={!!validation.email}
              />
              {validation.email && <div className="invalid-feedback">{validation.email}</div>}
            </CCol>
            
          </CRow>

          <CRow className="mb-3">
          <CCol>
              <CFormInput
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                invalid={!!validation.phone}
              />
              {validation.phone && <div className="invalid-feedback">{validation.phone}</div>}
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                invalid={!!validation.city}
              />
              {validation.city && <div className="invalid-feedback">{validation.city}</div>}
            </CCol>
          </CRow>

          <CCard>
            <CCardHeader as="h5" className="text-center">
              Profile Summary
            </CCardHeader>
            <CCardBody>
              {' '}
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


            <CCard className='my-3'>
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
                              placeholder="Start Date"
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
                              placeholder="End Date"
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
                    <CFormInput type="file" accept=".pdf, .doc, .docx" />
                  </CRow>
                </CCardBody>
              )}
            </CCard>

        </CCardBody>
      </CCard>

      <CRow className="my-3">
        <CCol>
          <CButton color="danger" onClick={() => navigate(-1)}>
            Back
          </CButton>
          <CButton color="success" type="submit" className="mx-3">
            {mode === 'add' ? 'Add' : 'Save'}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
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
      // Mock data for testing
      const data = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        city: 'New York',
        phone: '192 168 222 19',
        profileSummary: 'Experienced software engineer...',
        experiences: [
          {
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: new Date('2020-01-01').toISOString().slice(0, 10),
            endDate: new Date('2021-12-31').toISOString().slice(0, 10),
            description: 'Developed web applications...',
          },
        ],
      }
      setCandidateData(data)
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
