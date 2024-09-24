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
} from '@coreui/react'

const JobApplicants = ({ jobData }) => {
  const [addedApplicants, setAddedApplicants] = useState([])
  const [availableApplicants, setAvailableApplicants] = useState([])
  const [hiredApplicants, setHiredApplicants] = useState([])
  const [selectedAdded, setSelectedAdded] = useState([])
  const [selectedAvailable, setSelectedAvailable] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [applicantQuery, setApplicantQuery] = useState('')
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  // Pagination state for both tables
  const [addedPage, setAddedPage] = useState(1)
  const [availablePage, setAvailablePage] = useState(1)
  const itemsPerPage = 5

  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [openPositions, setOpenPositions] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const navigate = useNavigate()

  // Fetch available applicants from the API
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
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) {
          throw new Error('Failed to fetch applicants')
        }
        const data = await response.json()
        // Map the fetched data to the format we need
        const formattedData = data.map((user) => ({
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

  // New function to move applicants to hired list
  const bulkHireApplicants = () => {
    const hired = addedApplicants.filter((applicant) => selectedAdded.includes(applicant.id))
    setHiredApplicants((prev) => [...prev, ...hired])
    setAddedApplicants((prev) => prev.filter((applicant) => !selectedAdded.includes(applicant.id)))
    setSelectedAdded([])
  }

  // Toggle selection of individual applicants
  const toggleSelection = (id, selectedList, setSelectedList) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedList([...selectedList, id])
    }
  }

  // Filter available Candidates based on search query
  const filteredAvailableApplicants = availableApplicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter available applicants based on search query
  const filteredAddedApplicants = addedApplicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(applicantQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(applicantQuery.toLowerCase()),
  )

  // Pagination logic
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
                  <CFormLabel>Open Positions</CFormLabel>
                  <CFormInput value={openPositions} contentEditable="false" />
                </CCol>
                <CCol>
                  <CFormLabel>Salary</CFormLabel>
                  <CFormInput value={salary} contentEditable="false" />
                </CCol>
                <CCol>
                  <CFormLabel>Location</CFormLabel>
                  <CFormInput value={location} contentEditable="false" />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="my-3">
        <CCol>
          <CCard>
            <CCardHeader as="h5" className="text-center">
              Job Applicants
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
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {addedApplicants.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={3}>
                          No applicants yet. <br></br>Add applicants for this job from the available
                          Candidates.
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
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CRow>
              <CRow>
                <CCol xs={4}>
                  {' '}
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
                  {' '}
                  <CButtonGroup className="float-end mb-3 " size="sm">
                    <CButton color="info" onClick={bulkHireApplicants}>
                      Hire Selected
                    </CButton>
                    <CButton color="danger" onClick={bulkRemoveApplicants}>
                      Remove Selected
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CRow>{/* Content removed */}</CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
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
                                selectedAvailable.length === filteredAvailableApplicants.length &&
                                filteredAvailableApplicants.length > 0
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAvailable(
                                    filteredAvailableApplicants.map((applicant) => applicant.id),
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
                  <CButton color="success" onClick={bulkAddApplicants} size="sm">
                    Add Selected
                  </CButton>
                </CCol>
                <CCol xs={4}>
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
              </CRow>
              <CRow>{/* Content removed */}</CRow>
            </CCardBody>
          </CCard>

          {/* Handle loading, error, and content states */}
        </CCol>
      </CRow>

      {/* New Section: Hired Applicants Table */}
      <CRow className="my-3">
        <CCol>
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
        </CCol>
      </CRow>

      <CRow className="my-3">
        <CCol>
          <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
            Back
          </CButton>
          <CButton color="primary" onClick={bulkRemoveApplicants}>
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
        jobDescription: 'High-level job description',
      }
      setJobData(data)
    }
    fetchJob()
  }, [id])

  return jobData ? <JobApplicants jobData={jobData} /> : <div>Loading...</div>
}

export default JobApplicantsPage
