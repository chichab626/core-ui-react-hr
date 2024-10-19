import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CFormCheck,
  CFormInput,
  CPagination,
  CPaginationItem,
  CSpinner,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CCardText,
  CTabs,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiService from '../../../service/apiService'
import ToastNotification from '../../../components/ToasterNotification.jsx'
import SalaryInput from '../../../components/SalaryInput'

const JobApplicants = ({ jobData }) => {
  const [addedApplicants, setAddedApplicants] = useState([])
  const [availableApplicants, setAvailableApplicants] = useState([])
  const [hiredApplicants, setHiredApplicants] = useState([])
  const [selectedAdded, setSelectedAdded] = useState([])
  const [selectedAvailable, setSelectedAvailable] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [applicantQuery, setApplicantQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedPage, setAddedPage] = useState(1)
  const [availablePage, setAvailablePage] = useState(1)
  const itemsPerPage = 5
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [openPositions, setOpenPositions] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  // these are for the interview button in Job Applicants tab
  const [showModal, setShowModal] = useState(false) // Modal visibility state
  const [selectedApplicant, setSelectedApplicant] = useState(null) // Applicant being edited
  const [selectedDate, setSelectedDate] = useState('') // New date input

  // Open modal and set the selected applicant
  const openModal = (applicant) => {
    setSelectedApplicant(applicant)
    setShowModal(true)
  }

  // Save the date and update the applicant's nextInterview field
  const saveDate = () => {
    if (selectedApplicant && selectedDate) {
      selectedApplicant.nextInterview = selectedDate // Update the nextInterview field
    }
    setShowModal(false) // Close modal
    setSelectedDate('') // Reset date input
  }

  const formatDate = (dateString) => {
    const options = {
      month: '2-digit', // MM
      day: '2-digit', // DD
      year: 'numeric', // YYYY
      weekday: 'long', // Full day name (e.g., Monday)
      hour: 'numeric', // Hour with AM/PM
      minute: 'numeric', // Minute
      hour12: true, // 12-hour format
    }

    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
  }
  // END these are for the interview button in Job Applicants tab
  const navigate = useNavigate()

  useEffect(() => {
    if (jobData) {
      setJobTitle(jobData.jobTitle)
      setLocation(jobData.location)
      setSalary(jobData.salary)
      setOpenPositions(jobData.openPositions)
      setJobDescription(jobData.jobDescription)
    }

    const fetchApplicants = async () => {
      try {
        const response = await apiService.get('/candidates/')

        const formattedData = response.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }))
        setAvailableApplicants(formattedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  const bulkSaveChanges = () => {

  }

  // Transfer selected added applicants back to available applicants
  const bulkRemoveApplicants = () => {
    const removedApplicants = addedApplicants.filter((applicant) =>
      selectedAdded.includes(applicant.id),
    )
    setAvailableApplicants((prev) => [...prev, ...removedApplicants])
    setAddedApplicants((prev) => prev.filter((applicant) => !selectedAdded.includes(applicant.id)))
    setSelectedAdded([])
  }

  const bulkAddApplicants = () => {
    const newApplicants = availableApplicants.filter((applicant) =>
      selectedAvailable.includes(applicant.id),
    )
    setAddedApplicants((prev) => [...prev, ...newApplicants])
    setAvailableApplicants((prev) =>
      prev.filter((applicant) => !selectedAvailable.includes(applicant.id)),
    )
    setSelectedAvailable([])
  }

  const bulkHireApplicants = () => {
    const hired = addedApplicants.filter((applicant) => selectedAdded.includes(applicant.id))
    setHiredApplicants((prev) => [...prev, ...hired])
    setAddedApplicants((prev) => prev.filter((applicant) => !selectedAdded.includes(applicant.id)))
    setSelectedAdded([])
  }

  const toggleSelection = (id, selectedList, setSelectedList) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedList([...selectedList, id])
    }
  }

  const filteredAvailableApplicants = availableApplicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAddedApplicants = addedApplicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(applicantQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(applicantQuery.toLowerCase()),
  )

  const paginate = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const paginatedAddedApplicants = paginate(filteredAddedApplicants, addedPage)
  const paginatedAvailableApplicants = paginate(filteredAvailableApplicants, availablePage)

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader as="h5" className="text-center">
              {jobTitle}
            </CCardHeader>
            <CCardText className="mx-4 my-4">{jobDescription}</CCardText>
            <CCardBody>
              <CRow className="col-12 mx-auto">
                <CCol>
                  <CFormInput
                    value={openPositions}
                    contentEditable="false"
                    label="Open Positions"
                  />
                </CCol>
                <CCol>
                  <SalaryInput label="Salary" value={salary} readOnly={true} required />
                </CCol>
                <CCol>
                  <CFormLabel></CFormLabel>
                  <CFormInput label="Location" value={location} contentEditable="false" />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="my-3">
        <CTabs activeItemKey={2}>
          <CTabList variant="tabs" layout="justified">
            <CTab aria-controls="home-tab-pane" itemKey={1}>
              Add Applicants
            </CTab>
            <CTab aria-controls="profile-tab-pane" itemKey={2}>
              Current Applicants
            </CTab>
            <CTab aria-controls="contact-tab-pane" itemKey={3}>
              Hired Applicants
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
              <CCard>
                <CCardHeader as="h5" className="text-center">
                  Available Candidates
                </CCardHeader>
                <CCardBody>
                  <CRow className="mx-2">
                    <CFormInput
                      type="text"
                      placeholder="Search by name or email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                      className="mb-3"
                    />
                  </CRow>
                  <CRow>
                    {loading ? (
                      <CSpinner />
                    ) : error ? (
                      <p>{error}</p>
                    ) : (
                      <>
                        <CTable hover>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>
                                <CFormCheck
                                  checked={
                                    selectedAvailable.length ===
                                      filteredAvailableApplicants.length &&
                                    filteredAvailableApplicants.length > 0
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAvailable(
                                        filteredAvailableApplicants.map(
                                          (applicant) => applicant.id,
                                        ),
                                      )
                                    } else {
                                      setSelectedAvailable([])
                                    }
                                  }}
                                />
                              </CTableHeaderCell>
                              <CTableHeaderCell>Name</CTableHeaderCell>
                              <CTableHeaderCell>Email</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {paginatedAvailableApplicants.map((applicant) => (
                              <CTableRow key={applicant.id}>
                                <CTableDataCell>
                                  <CFormCheck
                                    checked={selectedAvailable.includes(applicant.id)}
                                    onChange={() =>
                                      toggleSelection(
                                        applicant.id,
                                        selectedAvailable,
                                        setSelectedAvailable,
                                      )
                                    }
                                  />
                                </CTableDataCell>
                                <CTableDataCell>{applicant.name}</CTableDataCell>
                                <CTableDataCell>{applicant.email}</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </>
                    )}
                  </CRow>
                  <CRow>
                    <CCol>
                      {' '}
                      {/* Pagination for Available Applicants */}
                      {filteredAvailableApplicants.length > itemsPerPage && (
                        <CPagination aria-label="Available applicants pagination">
                          <CPaginationItem
                            onClick={() => setAvailablePage(availablePage - 1)}
                            disabled={availablePage === 1}
                          >
                            Previous
                          </CPaginationItem>
                          <CPaginationItem
                            onClick={() => setAvailablePage(availablePage + 1)}
                            disabled={
                              availablePage * itemsPerPage >= filteredAvailableApplicants.length
                            }
                          >
                            Next
                          </CPaginationItem>
                        </CPagination>
                      )}
                    </CCol>
                    <CCol>
                      <CButton color="success" onClick={bulkAddApplicants}>
                        Add Selected
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow>{/* Content removed */}</CRow>
                </CCardBody>
              </CCard>
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
              <CCard>
                <CCardHeader as="h5" className="text-center">
                  {/* Job Applicants */}
                </CCardHeader>

                <CCardBody>
                  <CRow className="mx-2">
                    <CFormInput
                      type="text"
                      placeholder="Search by name or email"
                      value={applicantQuery}
                      onChange={(e) => setApplicantQuery(e.target.value)} // Update search query state
                      className="mb-3"
                    />
                  </CRow>
                  <CRow>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CFormCheck
                              checked={
                                selectedAdded.length === addedApplicants.length &&
                                addedApplicants.length > 0
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAdded(addedApplicants.map((applicant) => applicant.id))
                                } else {
                                  setSelectedAdded([])
                                }
                              }}
                            />
                          </CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Email</CTableHeaderCell>
                          <CTableHeaderCell>Interview</CTableHeaderCell>{' '}
                          {/* New Interviews Column */}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {addedApplicants.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan={4}>
                              No applicants yet. <br />
                              Add applicants for this job from the available Candidates.
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          paginatedAddedApplicants.map((applicant) => (
                            <CTableRow key={applicant.id}>
                              <CTableDataCell>
                                <CFormCheck
                                  checked={selectedAdded.includes(applicant.id)}
                                  onChange={() =>
                                    toggleSelection(applicant.id, selectedAdded, setSelectedAdded)
                                  }
                                />
                              </CTableDataCell>
                              <CTableDataCell>{applicant.name}</CTableDataCell>
                              <CTableDataCell>{applicant.email}</CTableDataCell>
                              <CTableDataCell>
                                {applicant.nextInterview ? (
                                  // Display interview date
                                  // new Date(applicant.nextInterview).toLocaleDateString()
                                  formatDate(applicant.nextInterview)
                                ) : (
                                  // Show calendar icon if no interview is scheduled
                                  <CButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => openModal(applicant)}
                                  >
                                    <CIcon icon={cilCalendar} />
                                  </CButton>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        )}
                      </CTableBody>
                    </CTable>
                  </CRow>
                  <CRow>
                    <CCol>
                      {addedApplicants.length > itemsPerPage && (
                        <CPagination aria-label="Added applicants pagination">
                          <CPaginationItem
                            onClick={() => setAddedPage(addedPage - 1)}
                            disabled={addedPage === 1}
                          >
                            Previous
                          </CPaginationItem>
                          <CPaginationItem
                            onClick={() => setAddedPage(addedPage + 1)}
                            disabled={addedPage * itemsPerPage >= addedApplicants.length}
                          >
                            Next
                          </CPaginationItem>
                        </CPagination>
                      )}
                    </CCol>
                    <CCol>
                      <CButtonGroup>
                        <CButton color="info" onClick={bulkHireApplicants}>
                          Hire Selected
                        </CButton>
                        <CButton color="danger" onClick={bulkRemoveApplicants}>
                          Remove Selected
                        </CButton>
                      </CButtonGroup>
                    </CCol>
                  </CRow>
                  <CModal visible={showModal} onClose={() => setShowModal(false)}>
                    <CModalHeader>Schedule Interview</CModalHeader>
                    <CModalBody>
                      <CFormInput
                        type="datetime-local"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Set selected date
                      />
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="primary" onClick={saveDate}>
                        Save Date
                      </CButton>
                      <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </CCardBody>
              </CCard>
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
              <CCard>
                <CCardHeader as="h5" className="text-center">
                  Hired Applicants
                </CCardHeader>
                <CCardBody>
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {hiredApplicants.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={2}>No hired applicants yet.</CTableDataCell>
                        </CTableRow>
                      ) : (
                        hiredApplicants.map((applicant) => (
                          <CTableRow key={applicant.id}>
                            <CTableDataCell>{applicant.name}</CTableDataCell>
                            <CTableDataCell>{applicant.email}</CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CRow>
      <CRow className="my-3">
        <CCol>
          <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
            Back
          </CButton>
          <CButton color="primary" onClick={() => bulkSaveChanges()}>
            Save Changes
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}

const JobApplicantsPage = () => {
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

  return jobData ? <JobApplicants jobData={jobData} /> : <div>Loading...</div>
}

export default JobApplicantsPage
