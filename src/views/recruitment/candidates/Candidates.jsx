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
  CButton,
  CFormInput,
  CCard,
  CCardBody,
  CCardText,
  CCardHeader,
  CRow,
  CFormCheck,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom' // Updated to useNavigate
import { cilPen, cilTrash } from '@coreui/icons' // Import CoreUI icons
import CIcon from '@coreui/icons-react' // Import the CIcon component
import apiService from '../../../service/apiService'
import ToastNotification from '../../../components/ToasterNotification.jsx'

const Candidates = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showHiredOnly, setShowHiredOnly] = useState(false) // New state for checkbox
  const rowsPerPage = 5
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const navigate = useNavigate() // Use useNavigate
  const [toastDeets, setToastDeets] = useState({})

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get('/candidates/')
        setData(response)
      } catch (error) {
        console.error('Error fetching candidates:', error)
      }
    }
    fetchData()
  }, [])

  // Filter data based on search term and "Hired Only" checkbox
  const filteredData = data
    .filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((candidate) => !showHiredOnly || candidate.status === 'Hired')

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  // Handle row click to navigate to another page
  const handleRowClick = (id) => {
    navigate(`/todo/page/${id}`)
  }

  // Sorting functionality
  const handleSort = (column) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newSortDirection)

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1
      return 0
    })
    setData(sortedData)
  }

  const handleAddClick = () => {
    navigate('/recruitment/candidates/add')
  }

  const handleEditClick = (id) => {
    navigate(`/recruitment/candidates/edit/${id}`)
  }

  const handleRegisterClick = async (candidate) => {
    try {
      const response = await apiService.get(`/applicants/find-hired-job/${candidate.id}/`)
      navigate(`/admin/user/add`, { state: { response } })
    } catch (error) {
      setToastDeets({
        message: 'Error registering candidate: ' + error?.response?.data?.message || error.message,
        type: 'danger',
        title: 'Register Candidate',
      })
    }
  }

  return (
    <>
      
      <CCard>
        <CCardHeader as="h5" className="text-center">
          Candidates List
        </CCardHeader>
        <CCardBody>
          <CCardText>List of Applicants and Candidates</CCardText>
        </CCardBody>

        <CCardBody className="mx-3">
          <CRow>
            <CFormInput
              type="text"
              placeholder="Search by Name, Email, Phone, or Location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            <CFormCheck
              label="New Hires Only"
              checked={showHiredOnly}
              onChange={(e) => setShowHiredOnly(e.target.checked)}
              className="mb-3"
            />
          </CRow>
          <CRow>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell onClick={() => handleSort('name')}>
                    Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('email')}>
                    Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('phone')}>
                    Phone {sortColumn === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('location')}>
                    Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentData.length > 0 ? (
                  currentData.map((candidate) => (
                    <CTableRow key={candidate.id} style={{ cursor: 'pointer' }}>
                      <CTableDataCell>{candidate.name}</CTableDataCell>
                      <CTableDataCell>{candidate.email}</CTableDataCell>
                      <CTableDataCell>{candidate.phone}</CTableDataCell>
                      <CTableDataCell>{candidate.location}</CTableDataCell>
                      <CTableDataCell>
                        {candidate.status !== 'Employee' && (
                          <>
                            <CButton
                              color="info"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClick(candidate.id)
                              }}
                            >
                              <CIcon icon={cilPen} />
                            </CButton>{' '}
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert('Remove clicked')
                              }}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>{' '}
                          </>
                        )}

                        {candidate.status === 'Employee' && (
                          <span>Go to Employees</span>
                        )}
                        {candidate.status === 'Hired' && (
                            
                          <CButton
                            color="success"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRegisterClick(candidate)
                            }}
                          >
                            Start Onboarding
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No Candidates Found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
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
          <CRow>
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" onClick={() => handleAddClick()}>
                Add Candidate
              </CButton>
            </div>
          </CRow>
        </CCardBody>
      </CCard>
      <ToastNotification deets={toastDeets} />
    </>
  )
}

export default Candidates
