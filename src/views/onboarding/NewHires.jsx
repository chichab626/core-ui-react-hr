import React, { useState, useEffect } from 'react'
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
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CBadge,
  CSpinner,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilPen } from '@coreui/icons'
import StartOnboardingModal from './StartOnboardingModal'
import { useNavigate } from 'react-router-dom'
import ToastNotification from '../../components/ToasterNotification.jsx'
import apiService from '../../service/apiService.js'

const OnboardingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [newHires, setNewHires] = useState([]) // Updated to dynamic data
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastDeets, setToastDeets] = useState(null)
  const itemsPerPage = 5
  const navigate = useNavigate()
  const loggedUser = {
    employeeId: localStorage.getItem('employeeId'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    profile: JSON.parse(localStorage.getItem('profile')),
  }

  // Fetch new hires data from API on component load
  useEffect(() => {
    const fetchNewHires = async () => {
      try {
        const data = await apiService.get('/checklist/new-hires')
        let filteredData = data

        if (loggedUser.role === 'Employee') {
            filteredData = data.filter((item) => item.employeeId == loggedUser.employeeId)
        } else if (loggedUser.role === 'Manager') {
            filteredData = data.filter((item) => item.employee.reportsTo == loggedUser.employeeId)
        }
        
        const formattedData = filteredData.map((item) => ({
          id: item.id,
          employeeId: item.employeeId,
          name: item.employee.name,
          email: item.employee.email,
          jobTitle: item.employee.jobTitle,
          jobId: item.jobId,
          startDate: item.startDate ? item.startDate.split('T')[0] : '',
          addedDate: item.hireDate.split('T')[0],
          status: item.status,
          resume: item.resume,
          identification: item.identification,
          taxInformation: item.taxInformation,
          trainingDate: item.trainingDate,
        }))
        setNewHires(formattedData)
      } catch (error) {
        console.error('Failed to fetch new hires:', error)
        setToastDeets({
          type: 'danger',
          message: 'Failed to load new hires data.',
          title: 'Error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchNewHires()
  }, [])

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedNewHires = [...newHires].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1
    }
  })

  // Filter and paginate the data
  const filteredNewHires = sortedNewHires.filter(
    (hire) =>
      (hire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hire.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? hire.status === statusFilter : true),
  )
  const indexOfLastHire = currentPage * itemsPerPage
  const indexOfFirstHire = indexOfLastHire - itemsPerPage
  const currentHires = filteredNewHires.slice(indexOfFirstHire, indexOfLastHire)
  const totalPages = Math.ceil(filteredNewHires.length / itemsPerPage)

  const handleViewJobClick = (jobId) => {
    navigate(`/recruitment/jobs/view/${jobId}`)
  }

  const handleEditHireClick = (employeeId) => {
    navigate(`/hr/employees/edit/${employeeId}`)
  }

  const countChecklist = (hire) => {
    const fieldsToCheck = [hire.resume, hire.identification, hire.taxInformation, hire.trainingDate]

    // Filter the fields to count those that are either null or an empty string
    const nullOrBlankCount = fieldsToCheck.filter((field) => field === null || field === '').length

    return nullOrBlankCount
  }

  const handleStartOnboarding = async (date) => {
    console.log('Onboarding started for:', selectedApplicant, 'with start date:', date)
    let hire = newHires.find((entry) => selectedApplicant === entry.id)
    hire.startDate = date
    hire.status = 'In-Progress'
    console.log(hire)

    try {
      await apiService.put(`/checklist/${hire.id}`, {
        startDate: hire.startDate,
        status: hire.status,
      })

      // Update view setNewHires
      setNewHires((prevNewHires) => {
        return prevNewHires.map((existingHire) =>
          existingHire.id === hire.id ? { ...existingHire, ...hire } : existingHire,
        )
      })

      setToastDeets({
        type: 'success',
        message: 'Onboarding started successfully.',
        title: 'Success',
      })

      setSelectedApplicant(null)
    } catch (error) {
      setToastDeets({
        type: 'danger',
        message: 'Failed to start onboarding: ' + (error.response?.data?.message || error.message),
        title: 'Error',
      })
    }
  }

  return (
    <CContainer>
      {/* rendering the toast component */}
      <ToastNotification deets={toastDeets} />
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader as="h5" className="text-center">
              Onboarding New Hires
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Added">Added</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell onClick={() => requestSort('name')}>Name</CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('email')}>Email</CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('jobTitle')}>
                      Job Title
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('startDate')}>
                      Start Date
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('addedDate')}>
                      Hire Date
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('status')}>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                {loading ? (
                    <CTableBody><CTableRow><CTableDataCell><CSpinner /></CTableDataCell></CTableRow></CTableBody>                  
                ) : (
                  <CTableBody>
                    {currentHires.map((hire) => (
                      <CTableRow key={hire.id}>
                        <CTableDataCell>{hire.name}</CTableDataCell>
                        <CTableDataCell>{hire.email}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="link" onClick={() => handleViewJobClick(hire.jobId)}>
                            {hire.jobTitle}
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>{hire.startDate}</CTableDataCell>
                        <CTableDataCell>{hire.addedDate}</CTableDataCell>
                        <CTableDataCell>{hire.status}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="link"
                            className="me-2"
                            onClick={() => handleEditHireClick(hire.employeeId)}
                          >
                            <CIcon icon={cilPen} />
                          </CButton>
                          {hire.status === 'Added' && (
                            <CButton
                              color="success"
                              className="me-2"
                              onClick={() => {
                                setSelectedApplicant(hire.id)
                                setModalVisible(true)
                              }}
                            >
                              Start Onboarding
                            </CButton>
                          )}
                          {hire.status === 'In-Progress' && (
                            <CButton
                              color="info"
                              onClick={() =>
                                navigate(`/hr/onboarding/checklist/${hire.id}`, {
                                  state: { hire },
                                })
                              }
                            >
                              Checklist
                              <CBadge color="danger" shape="rounded-pill" className="ms-2">
                                {countChecklist(hire)}
                              </CBadge>
                            </CButton>
                          )}
                          <StartOnboardingModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            onConfirm={handleStartOnboarding}
                          />
                          {hire.status === 'Complete' && (
                            <CButton
                              color="secondary"
                              onClick={() =>
                                navigate(`/hr/onboarding/checklist/${hire.id}`, {
                                  state: { hire },
                                })
                              }
                              className="me-2"
                            >
                              Checklist
                            </CButton>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                )}
              </CTable>
              <CPagination aria-label="New hires pagination" className="mt-3">
                <CPaginationItem
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <CPaginationItem
                    key={index}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default OnboardingPage
