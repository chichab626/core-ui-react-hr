import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CFormInput,
  CButton,
  CBadge,
  CCard,
  CCardBody,
  CCardText,
  CCardHeader,
  CRow,
  CSpinner,
  CCallout,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import apiService from '../../../service/apiService.js'
import ToastNotification from '../../../components/ToasterNotification.jsx'

const Jobs = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const [sortColumn, setSortColumn] = useState('title')
  const [sortDirection, setSortDirection] = useState('asc')
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [toastDeets, setToastDeets] = useState({})
  const [applications, setApplications] = useState([])

  const navigate = useNavigate()

  const allowedUsers = ['Administrator', 'HR', 'Manager']

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let applications = []
        if (role === 'Employee') {
          applications = await apiService.get(
            `applicants/find-applications?email=${localStorage.getItem('email')}`,
          )
          setApplications(applications)
        }

        const jobs = await apiService.get(
          '/job?applicants=true' +
            (role === 'Manager' ? `&managerId=${localStorage.getItem('employeeId')}` : ''),
        )

        // Enrich job data with application details
        const enrichedJobs = jobs.map((job) => {
          const matchingApp = applications.find((app) => app.jobId === job.id)
          return {
            ...job,
            hasApplied: Boolean(matchingApp),
            applicationDetails: matchingApp || null, // Attach application details if found
          }
        })

        setData(enrichedJobs)
        console.log(enrichedJobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(data.length / rowsPerPage)

  // Search functionality
  useEffect(() => {
    const filteredData = data.filter(
      (row) =>
        row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.salary.toString().includes(searchTerm),
    )
    setData(filteredData)
    setCurrentPage(1) // Reset to the first page on search
  }, [searchTerm])

  // Sorting functionality
  const handleSort = (column) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newSortDirection)

    const sortedData = [...data].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1
      return 0
    })
    setData(sortedData)
  }

  const handleAddJobClick = () => {
    navigate('/recruitment/jobs/add')
  }

  const handleEditClick = (jobId) => {
    navigate(`/recruitment/jobs/edit/${jobId}`)
  }

  const handleApplicantClick = (jobId) => {
    navigate(`/recruitment/jobs/applicants/${jobId}`)
  }

  const handleApplyClick = async (jobId) => {
    // Redirect to application page or handle application logic
    console.log(`Applying for job ID: ${jobId}`)
    const storedUserEmail = localStorage.getItem('email')

    if (!storedUserEmail) {
      setToastDeets({
        type: 'danger',
        message: 'You need to login to apply',
        title: 'Apply to Job',
      })
      return
    }
    try {
      const application = await apiService.post('/applicants/apply', {
        jobId,
        email: storedUserEmail,
      })
      setToastDeets({
        type: 'success',
        message: 'Application Sent',
        title: 'Apply to Job',
      })

      setApplications((prev) =>
        prev.map((app) =>
          app.jobId === application.jobId
            ? { ...app, ...application } // Update the application object with new values
            : app,
        ),
      )

      setData((prev) => {
        console.log('prev', application)
        return prev.map((one) => {
          if (one.id === application.jobId) {
            const newOne = { ...one, hasApplied: true, applicationDetails: application }
            console.log('newOne', newOne)
            return newOne
          } else {
            console.log('oldOne', one)
            return one
          }
        })
      })
    } catch {
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message || error.message,
        title: 'Apply to Job',
      })
    }
  }

  return (
    <div>
      <ToastNotification deets={toastDeets} />
      <CCard>
        <CCardHeader as="h5" className="text-center">
          Jobs
        </CCardHeader>
        <CCardBody>
          <CCardText>List of Available Jobs</CCardText>
        </CCardBody>

        <CCardBody className="mx-3">
          <CRow>
            <CFormInput
              type="text"
              placeholder="Search jobs, location, salary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      <CTableHeaderCell onClick={() => handleSort('title')}>
                        Job Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('location')}>
                        Location{' '}
                        {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('salary')}>
                        Salary {sortColumn === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('openPositions')}>
                        Open Positions{' '}
                        {sortColumn === 'openPositions' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </CTableHeaderCell>
                      {role && <CTableHeaderCell>Actions</CTableHeaderCell>}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentData.length > 0 ? (
                      currentData.map((row) => (
                        <CTableRow
                          key={row.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/recruitment/jobs/view/${row.id}`)}
                        >
                          <CTableDataCell>{row.title}</CTableDataCell>
                          <CTableDataCell>{row.location}</CTableDataCell>
                          <CTableDataCell>{`$${parseFloat(row.salary).toLocaleString()}`}</CTableDataCell>
                          <CTableDataCell>{row.openPositions}</CTableDataCell>
                          <CTableDataCell>
                            {allowedUsers.includes(role) ? (
                              <CButton
                                color="secondary"
                                className="position-relative me-3"
                                onClick={(e) => {e.stopPropagation(); handleApplicantClick(row.id)}}
                              >
                                Applicants
                                <CBadge
                                  color={row.applicantCount > 0 ? 'success' : 'danger'}
                                  position="top-start"
                                  shape="rounded-pill"
                                >
                                  {row.applicantCount}
                                </CBadge>
                              </CButton>
                            ) : role === 'Employee' && row.openPositions > 1 ? (
                              row.hasApplied ? (
                                row.applicationDetails?.interviewStatus === 'Hired' ? (
                                  <CCallout
                                    color="success"
                                    style={{ '--cui-callout-padding-y': '3px' }}
                                  >
                                    Hired last{' '}
                                    {new Date(row.applicationDetails?.appliedAt).toLocaleDateString(
                                      'en-US',
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      },
                                    )}
                                  </CCallout>
                                ) : row.applicationDetails?.interviewStatus === 'Withdrawn' ||
                                  row.applicationDetails?.interviewStatus === 'Rejected' ? (
                                  <CButton
                                    color="secondary"
                                    onClick={(e) => {e.stopPropagation(); handleApplyClick(row.id)}}
                                  >
                                    Apply again
                                  </CButton>
                                ) : (
                                  <CCallout
                                    color="secondary"
                                    style={{ '--cui-callout-padding-y': '3px' }}
                                  >
                                    Applied on{' '}
                                    {new Date(row.applicationDetails?.appliedAt).toLocaleDateString(
                                      'en-US',
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      },
                                    )}
                                  </CCallout>
                                )
                              ) : (
                                <CButton color="primary" onClick={(e) => {e.stopPropagation(); handleApplyClick(row.id)}}>
                                  Apply
                                </CButton>
                              )
                            ) : null}

                            {allowedUsers.includes(role) && (
                              <>
                                <CButton
                                  color="info"
                                  className="me-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditClick(row.id)
                                  }}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton color="danger" onClick={(e) =>{ 
                                    e.stopPropagation()
                                    handleDeleteClick(row.id)}}>
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No Jobs Found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </>
            )}
          </CRow>
          <CRow>
            <CPagination aria-label="Page navigation">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <CPaginationItem
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          </CRow>
          {allowedUsers.includes(role) && (
            <CRow>
              <div className="d-grid gap-2 col-6 mx-auto">
                <CButton color="primary" onClick={() => handleAddJobClick()}>
                  Add Job
                </CButton>
              </div>
            </CRow>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Jobs
