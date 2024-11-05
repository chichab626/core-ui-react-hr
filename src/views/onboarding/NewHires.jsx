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
  const itemsPerPage = 5
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const navigate = useNavigate()

  // Sample data for new hires
  const newHires = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      jobTitle: 'Software Engineer',
      startDate: '',
      addedDate: '2023-09-15',
      status: 'Added',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      jobTitle: 'Data Analyst',
      startDate: '2023-10-05',
      addedDate: '2023-09-16',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      jobTitle: 'Product Manager',
      startDate: '2023-10-10',
      addedDate: '2023-09-17',
      status: 'Complete',
    },
    {
      id: 4,
      name: 'Bob Brown',
      email: 'bob@example.com',
      jobTitle: 'UX Designer',
      startDate: '',
      addedDate: '2023-09-18',
      status: 'Added',
    },
    {
      id: 5,
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      jobTitle: 'DevOps Engineer',
      startDate: '2023-10-20',
      addedDate: '2023-09-19',
      status: 'In Progress',
    },
    {
      id: 6,
      name: 'Eve Adams',
      email: 'eve@example.com',
      jobTitle: 'QA Engineer',
      startDate: '2023-10-25',
      addedDate: '2023-09-20',
      status: 'Complete',
    },
    {
      id: 7,
      name: 'Frank Miller',
      email: 'frank@example.com',
      jobTitle: 'Data Scientist',
      startDate: '',
      addedDate: '2023-09-21',
      status: 'Added',
    },
    {
      id: 8,
      name: 'Grace Wilson',
      email: 'grace@example.com',
      jobTitle: 'Marketing Specialist',
      startDate: '2023-11-01',
      addedDate: '2023-09-22',
      status: 'In Progress',
    },
    {
      id: 9,
      name: 'Henry Lee',
      email: 'henry@example.com',
      jobTitle: 'Sales Executive',
      startDate: '2023-11-05',
      addedDate: '2023-09-23',
      status: 'Complete',
    },
    {
      id: 10,
      name: 'Isabella King',
      email: 'isabella@example.com',
      jobTitle: 'HR Coordinator',
      startDate: '',
      addedDate: '2023-09-24',
      status: 'Added',
    },
  ]

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Sorting logic
  const sortedNewHires = [...newHires].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1
    }
  })

  // Filter new hires based on search query and status filter
  const filteredNewHires = sortedNewHires.filter(
    (hire) =>
      (hire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hire.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? hire.status === statusFilter : true),
  )

  // Pagination logic
  const indexOfLastHire = currentPage * itemsPerPage
  const indexOfFirstHire = indexOfLastHire - itemsPerPage
  const currentHires = filteredNewHires.slice(indexOfFirstHire, indexOfLastHire)

  const totalPages = Math.ceil(filteredNewHires.length / itemsPerPage)

  const handleStartOnboarding = (date) => {
    console.log('Onboarding started for:', selectedApplicant, 'with start date:', date)
    // Add logic to update the applicant's status with the start date
  }

  const handleEditJobClick = (jobTitle, id) => {
    // need to get the job id somehow of this job
    navigate(`/recruitment/jobs/view/${id}`);
};

  return (
    <CContainer>
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
                    <option value="In Progress">In Progress</option>
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
                <CTableBody>
                  {currentHires.map((hire) => (
                    <CTableRow key={hire.id}>
                      <CTableDataCell>{hire.name}</CTableDataCell>
                      <CTableDataCell>{hire.email}</CTableDataCell>
                      <CTableDataCell>
                      <CButton color="link" onClick={() => handleEditJobClick(hire.jobTitle, hire.id)}>
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
                          onClick={() => alert(`Editing ${hire.name}`)}
                        >
                          <CIcon icon={cilPen} />
                        </CButton>
                        {hire.status === 'Added' && (
                          <CButton
                            color="success"
                            className="me-2"
                            onClick={() => {
                              setSelectedApplicant(hire.id) // Set the selected applicant
                              setModalVisible(true)
                            }}
                          >
                            Start Onboarding
                          </CButton>
                        )}
                        {hire.status === 'In Progress' && (
                          <CButton
                            color="info"
                            onClick={() => navigate(`/hr/onboarding/checklist/${hire.id}`)}
                          >
                            Checklist
                            <CBadge color="danger" shape="rounded-pill" className="ms-2">
                              {Math.floor(Math.random() * 10) + 1}
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
                            onClick={() => navigate(`/hr/onboarding/checklist/${hire.id}`)}
                            className="me-2"
                          >
                            Checklist
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              {/* Pagination */}
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
