import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom' // Updated to useNavigate
import { cilPen, cilTrash } from '@coreui/icons' // Import CoreUI icons
import CIcon from '@coreui/icons-react' // Import the CIcon component
import apiService from '../../service/apiService.js'

const Employees = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const navigate = useNavigate() // Use useNavigate
  const loggedUser = {
    employeeId: localStorage.getItem('employeeId'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    profile: JSON.parse(localStorage.getItem('profile')),
  }

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.get('/employee')
        let filteredData = result

        if (loggedUser.role === 'Manager') {
          filteredData = result.filter(
            (item) => item.reportsTo == loggedUser.employeeId || item.id == loggedUser.employeeId,
          )
        }

        setData(filteredData)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }
    fetchData()
  }, [])

  function getLatestScore(reviews) {
    if (!reviews || reviews.length === 0) return null // Handle empty or undefined input

    // Find the review with the latest `createdAt` date
    const latestReview = reviews.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    })

    return latestReview.score // Return only the score
  }

  // Filter data based on search term
  const filteredData = data.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()), // Assuming company name as job title
  )

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  // Handle row click to navigate to another page
  const handleRowClick = (id) => {
    navigate(`/hr/employees/view/${id}`) // Update route as needed
  }

  // Sorting functionality
  const handleSort = (column) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newSortDirection)
  
    const sortedData = [...filteredData].sort((a, b) => {
      let aValue = a[column]
      let bValue = b[column]
  
      if (column === 'rating') {
        aValue = getLatestScore(a.ratings) || 0 // Default to 0 if no ratings
        bValue = getLatestScore(b.ratings) || 0
      }
  
      if (aValue < bValue) return newSortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return newSortDirection === 'asc' ? 1 : -1
      return 0
    })
  
    setData(sortedData)
  }
  

  const handleEditClick = (id) => {
    navigate(`/hr/employees/edit/${id}`) // Update route as needed
  }

  return (
    <div>
      <CCard>
        <CCardHeader as="h5" className="text-center">
          Employees List
        </CCardHeader>
        <CCardBody>
          <CCardText>List of Employees</CCardText>
        </CCardBody>
        <CCardBody className="mx-3">
          <CRow>
            <CFormInput
              type="text"
              placeholder="Search by Name, Email, City, or Job Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  <CTableHeaderCell onClick={() => handleSort('jobTitle')}>
                    Job Title {sortColumn === 'jobTitle' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('location')}>
                    Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('rating')}>
                    Latest Rating {sortColumn === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentData.length > 0 ? (
                  currentData.map((employee) => (
                    <CTableRow
                      key={employee.id}
                      onClick={() => handleRowClick(employee.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CTableDataCell>{employee.name}</CTableDataCell>
                      <CTableDataCell>{employee.email}</CTableDataCell>
                      <CTableDataCell>{employee.jobTitle}</CTableDataCell>
                      <CTableDataCell>{employee.location}</CTableDataCell>
                      <CTableDataCell>
                        {employee.ratings.length > 0 ? (
                          <div className="mb-2">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                style={{
                                  color:
                                    index < getLatestScore(employee.ratings)
                                      ? '#ffc107'
                                      : '#e4e5e9',
                                  marginRight: '4px',
                                }}
                                size={20}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-medium-emphasis text-center">No ratings available</p>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(employee.id)
                          }}
                        >
                          <CIcon icon={cilPen} /> {/* Edit icon */}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No Employees Found
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
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Employees
