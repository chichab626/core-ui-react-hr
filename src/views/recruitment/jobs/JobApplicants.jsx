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
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CBadge,
  CTooltip,
} from '@coreui/react'
import {
  cilCalendar,
  cilCheckCircle,
  cilPencil,
  cilThumbUp,
  cilNoteAdd,
  cilCheck,cilXCircle
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiService from '../../../service/apiService'
import ToastNotification from '../../../components/ToasterNotification.jsx'
import SalaryInput from '../../../components/SalaryInput'

const JobApplicants = ({ jobData }) => {
  const [jobDeets, setJobDeets] = useState(null)
  const [addedApplicants, setAddedApplicants] = useState([])
  const [availableApplicants, setAvailableApplicants] = useState([])
  const [hiredApplicants, setHiredApplicants] = useState([])
  const [selectedAdded, setSelectedAdded] = useState([])
  const [selectedAvailable, setSelectedAvailable] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [applicantQuery, setApplicantQuery] = useState('')
  const [loading, setLoading] = useState(true)
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
  const [toastDeets, setToastDeets] = useState({})

  // Open modal and set the selected applicant
  const openModal = (applicant) => {
    setSelectedApplicant(applicant)
    setShowModal(true)
  }

  // Save the date and update the applicant's nextInterview field
  const saveDate = async () => {
    if (selectedApplicant && selectedDate) {
      try {
        selectedApplicant.nextInterview = selectedDate // Update the nextInterview field
        apiService.put('/applicants/' + selectedApplicant.id, selectedApplicant)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }
    setShowModal(false) // Close modal
    setSelectedDate('') // Reset date input
  }

  const markInterviewAsDone = async (applicant) => {
    setSelectedApplicant(applicant)
    try {
      applicant.interviewStatus = 'Interviewed'
      applicant.nextInterview = new Date(1900, 0, 1)
      apiService.put('/applicants/' + applicant.id, applicant)
      setSelectedApplicant(applicant)
      setSelectedDate(applicant.nextInterview)
    } catch (err) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
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
      setJobTitle(jobData.title)
      setLocation(jobData.location)
      setSalary(jobData.salary)
      setOpenPositions(jobData.openPositions)
      setJobDescription(jobData.jobDescription)
    }

    const fetchAllList = async () => {
      try {
        const [candidates, jobApplicants] = await Promise.all([
          apiService.get('/candidates?notHired=true'),
          apiService.get('/applicants?jobId=' + jobData.id),
        ])

        const hiredApplicants = []
        const otherApplicants = []

        jobApplicants.forEach((applicant) => {
          const formattedApplicant = {
            id: applicant.id,
            candidateId: applicant.candidateId,
            jobId: applicant.jobId,
            name: applicant.candidate?.name,
            email: applicant.candidate?.email || applicant.candidate?.externalEmail,
            externalEmail: applicant.candidate?.externalEmail,
            interviewStatus: applicant.interviewStatus,
            nextInterview: applicant.nextInterview,
            userId: applicant.candidate?.userId
          }

          if (applicant.interviewStatus === 'Hired') {
            hiredApplicants.push(formattedApplicant)
          } else {
            otherApplicants.push(formattedApplicant)
          }
        })

        // Set the applicants in their respective state
        setHiredApplicants(hiredApplicants)
        setAddedApplicants(otherApplicants)

        const availCandidates = candidates
          .filter((applicant) => !jobApplicants.some((a) => a.candidateId === applicant.id))
          .map((user) => ({
            candidateId: user.id,
            name: user.name,
            email: user.email || user.externalEmail,
            externalEmail: user.externalEmail,
            userId: user.userId,
          }))
        setAvailableApplicants(availCandidates)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllList()
  }, [])

  // Transfer selected added applicants back to available applicants
  const bulkRemoveApplicants = async () => {
    const removedApplicants = addedApplicants.filter((applicant) =>
      selectedAdded.includes(applicant.id),
    )

    // Prepare the payload for the API request
    const payload = removedApplicants.map((applicant) => applicant.id)

    try {
      // Make the API call to bulk upsert
      await apiService.post('applicants/bulk-delete', { ids: payload })

      // If the API call is successful, update the UI state
      setAvailableApplicants((prev) => [...prev, ...removedApplicants])
      setAddedApplicants((prev) =>
        prev.filter((applicant) => !selectedAdded.includes(applicant.id)),
      )
      setSelectedAdded([])

      setToastDeets({
        type: 'success',
        message: 'Selected applicants removed.',
        title: 'Job Applicants',
      })
    } catch (error) {
      console.error('Failed to remove applicants:', error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Job Applicants',
      })
    }
  }

  const updateStatus = async (applicant, status) => {
    try {
      applicant.interviewStatus = status
      await apiService.put('/applicants/' + applicant.id, applicant)
      setSelectedApplicant(applicant)
      if (status == 'Job Offer') {
        setToastDeets({
          type: 'info',
          message: `A job offer letter will be drafted for ${applicant.name}`,
          title: 'Update Status',
        })

        apiService.post('letters/draft-letters', {
          letterType: 'Job Offer',
          applicants: [applicant],
          jobTitle: jobData.title,
          from: localStorage.getItem('email'),
        })
      }
    } catch (err) {
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + err?.response?.data?.message || err.message,
        title: 'Update Status',
      })
    } finally {
      setLoading(false)
    }
  }

  const bulkUpdateStatus = async (status) => {
    const selectedApplicants = addedApplicants.filter((applicant) =>
      selectedAdded.includes(applicant.id),
    )

    if (selectedApplicants.length < 1) {
      setToastDeets({
        type: 'warning',
        message: 'No applicants selected',
        title: 'Job Applicants',
      })
      return
    }

    // Prepare the payload for the API request
    const payload = selectedApplicants.map((applicant) => ({
      candidateId: applicant.candidateId,
      jobId: jobData.id,
      interviewStatus: status,
    }))

    try {
      // Make the API call to bulk upsert
      const result = await apiService.post('applicants/bulk-upsert', payload)

      // If the API call is successful, update the UI state
      setAddedApplicants((prev) =>
        prev.map((applicant) =>
          selectedAdded.includes(applicant.id)
            ? { ...applicant, interviewStatus: status }
            : applicant,
        ),
      )
      setSelectedAdded([])

      setToastDeets({
        type: 'success',
        message: `Selected applicant/s set to: "${status}"`,
        title: 'Job Applicants',
      })

      if (status == 'Rejected') {
        setToastDeets({
          type: 'info',
          message: 'Rejection letters will be drafted for the selected applicants',
          title: 'Job Applicants',
        })

        apiService.post('letters/draft-letters', {
          letterType: 'Rejection',
          applicants: selectedApplicants,
          jobTitle: jobData.title,
          from: localStorage.getItem('email'),
        })
      }
    } catch (error) {
      console.error('Failed to update applicants:', error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Job Applicants',
      })
    }
  }

  const bulkAddApplicants = async () => {
    let newApplicants = availableApplicants.filter((applicant) =>
      selectedAvailable.includes(applicant.candidateId),
    )

    // Prepare the payload for the API request
    const payload = newApplicants.map((applicant) => ({
      candidateId: applicant.candidateId,
      jobId: jobData.id,
    }))

    try {
      // Make the API call to bulk upsert
      const result = await apiService.post('applicants/bulk-upsert', payload)

      let mergedApplicants = result.data?.map((applicant) => {
        return mergeApplicants(applicant.jobApplicant, newApplicants)
      })

      // If the API call is successful, update the UI state
      setAddedApplicants((prev) => [...prev, ...mergedApplicants])
      setAvailableApplicants((prev) =>
        prev.filter((applicant) => !selectedAvailable.includes(applicant.candidateId)),
      )
      setSelectedAvailable([])

      setToastDeets({
        type: 'success',
        message: 'Selected candidates added as applicants.',
        title: 'Job Applicants',
      })
    } catch (error) {
      console.error('Failed to add applicants:', error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Job Applicants',
      })
    }
  }

  function mergeApplicants(jobApplicant, candidates) {
    // Find the candidate by matching candidateId with the id in the candidates array
    const matchedCandidate = candidates.find(
      (candidate) => candidate.candidateId === jobApplicant.candidateId,
    )

    // If a match is found, merge the properties; otherwise, just return the job applicant object
    return matchedCandidate
      ? {
          ...jobApplicant,
          name: matchedCandidate.name,
          email: matchedCandidate.email,
          userId: matchedCandidate.userId,
          externalEmail: matchedCandidate.externalEmail,
        }
      : jobApplicant // Return the original job applicant if no match is found
  }

  const bulkHireApplicants = async (applicant) => {
    const hired = [applicant]
    // Check if there are enough open positions
    if (openPositions < 1) {
      setToastDeets({
        type: 'danger',
        message: 'Cannot hire more applicants than available open positions.',
        title: 'Job Applicants',
      })
      return // Exit the function if not enough open positions
    }

    // Prepare the payload for the API request
    const payload = hired.map((applicant) => ({
      candidateId: applicant.candidateId,
      jobId: jobData.id,
      interviewStatus: 'Hired',
      userId: applicant.userId
    }))

    let procs = [apiService.post('applicants/bulk-hire', payload)]
    if (applicant.userId) {
        // if applicant is employee just update employee info
        procs.push(apiService.put(`employee/0`, { // id is 0 here to signal BE to use userId in the body
            userId: applicant.userId,
            jobTitle: jobData.title,
            reportsTo: jobData.hiringManagerId
        }))
    } else {
        apiService.post('candidates/bulk-hire', { candidateIds: hired.map((applicant) => applicant.candidateId) })
    }

    try {
      const [result, unused] = await Promise.all(procs)

      // Assuming result.data contains the response data
      const mergedApplicants = result.data.map((applicant) => {
        return mergeApplicants(applicant, hired)
      })

      // Update the state
      setHiredApplicants((prev) => [...prev, ...mergedApplicants])
      setAddedApplicants((prev) =>
        prev.filter((applicant) => ![hired[0].id].includes(applicant.id)),
      )
      setSelectedAdded([])

      // Decrease the open positions count
      setOpenPositions(jobData.openPositions - hired.length)
      setJobDeets({
        ...jobData,
        openPositions: jobData.openPositions - hired.length,
      })

      if (applicant.userId) {
        setToastDeets({
            type: 'success',
            message: `${applicant.name} is now hired for the ${jobData.title} position.`,
            title: 'Hire Applicant',
          })

          return;
      }

      setToastDeets({
        type: 'success',
        message: `${applicant.name} is now hired for the ${jobData.title} position. The IT team will be notified.`,
        title: 'Hire Applicant',
      })

      apiService.post('letters/draft-letters', {
        letterType: 'New Hire',
        applicants: [
          {
            candidateId: applicant.candidateId,
            name: applicant.name,
            email: applicant.externalEmail,
            jobId: applicant.jobId,
            companyEmail: applicant.email
          },
        ],
        jobTitle: jobTitle,
        from: localStorage.getItem('email'),
      })
    } catch (error) {
      console.error('Failed to hire applicants:', error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Hire Applicant',
      })
    }
  }

  useEffect(() => {
    const updateJobTable = async () => {
      try {
        // Make API call to update job table
        await apiService.put(`job/${jobDeets.id}`, jobDeets)
        console.log('Job table updated successfully.')
      } catch (error) {
        console.error('Failed to update job table:', error)
      }
    }

    // Check if jobData has the required fields before making the API call
    if (jobDeets && jobDeets.id) {
      updateJobTable()
    }
  }, [openPositions]) // This effect runs whenever jobData changes

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
    <>
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
                {hiredApplicants.length > 0 && (
                  <CBadge color="success" className="ms-2">
                    {hiredApplicants.length}
                  </CBadge>
                )}
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
                                            (applicant) => applicant.candidateId,
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
                                <CTableHeaderCell>Employee</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {paginatedAvailableApplicants.map((applicant) => (
                                <CTableRow key={applicant.candidateId}>
                                  <CTableDataCell>
                                    <CFormCheck
                                      checked={selectedAvailable.includes(applicant.candidateId)}
                                      onChange={() =>
                                        toggleSelection(
                                          applicant.candidateId,
                                          selectedAvailable,
                                          setSelectedAvailable,
                                        )
                                      }
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>{applicant.name}</CTableDataCell>
                                  <CTableDataCell>{applicant.email}</CTableDataCell>
                                  <CTableDataCell>
                                    {applicant.userId ? (
                                      <CIcon icon={cilCheck} className="text-success" />
                                    ) : (
                                        <CIcon icon={cilXCircle} className="text-danger" />
                                    )}
                                  </CTableDataCell>
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
                                  selectedAdded.length ===
                                    addedApplicants.filter(
                                      (applicant) => applicant.interviewStatus !== 'Withdrawn',
                                    ).length &&
                                  addedApplicants.filter(
                                    (applicant) => applicant.interviewStatus !== 'Withdrawn',
                                  ).length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAdded(
                                      addedApplicants
                                        .filter(
                                          (applicant) => applicant.interviewStatus !== 'Withdrawn',
                                        ) // Exclude "Withdrawn" applicants
                                        .map((applicant) => applicant.id),
                                    )
                                  } else {
                                    setSelectedAdded([])
                                  }
                                }}
                              />
                            </CTableHeaderCell>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Employee</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Next Interview</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
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
                                    disabled={applicant.interviewStatus === 'Withdrawn'}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>{applicant.name}</CTableDataCell>
                                <CTableDataCell>{applicant.email}</CTableDataCell>
                                <CTableDataCell>
                                    {applicant.userId ? (
                                      <CIcon icon={cilCheck} className="text-success" />
                                    ) : (
                                        <CIcon icon={cilXCircle} className="text-danger" />
                                    )}
                                  </CTableDataCell>
                                <CTableDataCell>{applicant.interviewStatus}</CTableDataCell>
                                <CTableDataCell>
                                  {applicant.interviewStatus === 'Withdrawn' ? (
                                    // Display "no action available" if the interview status is "Withdrawn"
                                    <span>No action available</span>
                                  ) : applicant.nextInterview &&
                                    new Date(applicant.nextInterview) > new Date(1900, 1, 1) ? (
                                    <>
                                      {formatDate(applicant.nextInterview)}

                                      {/* Check if the interview date is in the past */}
                                      {new Date(applicant.nextInterview) < new Date() && (
                                        <CTooltip content="Done with Interview" placement="top">
                                          <CButton
                                            color="success"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => markInterviewAsDone(applicant)}
                                          >
                                            <CIcon icon={cilCheckCircle} /> {/* Done icon */}
                                          </CButton>
                                        </CTooltip>
                                      )}

                                      {/* Edit button for changing interview date */}
                                      <CTooltip content="Change Date" placement="top">
                                        <CButton
                                          color="info"
                                          size="sm"
                                          className="ms-2"
                                          onClick={() => openModal(applicant)} // Function to open edit modal
                                        >
                                          <CIcon icon={cilPencil} />
                                        </CButton>
                                      </CTooltip>
                                    </>
                                  ) : (
                                    // Show calendar icon if no interview is scheduled
                                    <CTooltip content="Set next Interview" placement="top">
                                      <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => openModal(applicant)}
                                      >
                                        <CIcon icon={cilCalendar} />
                                      </CButton>
                                    </CTooltip>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {applicant.interviewStatus === 'Interviewed' ? (
                                    // Display "no action available" if the interview status is "Interviewed"
                                    <CTooltip content="Offer Job" placement="top">
                                      <CButton
                                        color="warning"
                                        size="sm"
                                        onClick={() => updateStatus(applicant, 'Job Offer')}
                                      >
                                        <CIcon icon={cilNoteAdd} />
                                      </CButton>
                                    </CTooltip>
                                  ) : applicant.interviewStatus === 'Job Offer' ? (
                                    <CTooltip content="Hire" placement="top">
                                      <CButton
                                        color="success"
                                        size="sm"
                                        onClick={() => bulkHireApplicants(applicant)}
                                      >
                                        <CIcon icon={cilThumbUp} />
                                      </CButton>
                                    </CTooltip>
                                  ) : (
                                    <span>No action available</span>
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
                          <CDropdown variant="btn-group">
                            <CDropdownToggle color="info">Bulk Actions</CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={bulkRemoveApplicants}>
                                Remove Selected
                              </CDropdownItem>
                              <CDropdownItem onClick={() => bulkUpdateStatus('Rejected')}>
                                Reject Selected
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
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
                          <CTableHeaderCell>External Email</CTableHeaderCell>
                          <CTableHeaderCell>Company Email</CTableHeaderCell>
                          <CTableHeaderCell>Employee</CTableHeaderCell>
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
                              <CTableDataCell>{applicant.externalEmail}</CTableDataCell>
                              <CTableDataCell>{applicant.userId ? applicant.email : ''}</CTableDataCell>
                              <CTableDataCell>
                                    {applicant.userId ? (
                                      <CIcon icon={cilCheck} className="text-success" />
                                    ) : (
                                        <CIcon icon={cilXCircle} className="text-danger" />
                                    )}
                                  </CTableDataCell>
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
      <ToastNotification deets={toastDeets} />
    </>
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
