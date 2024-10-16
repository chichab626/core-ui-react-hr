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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import apiService from '../../../service/apiService.js';

const Jobs = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const [sortColumn, setSortColumn] = useState('title')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const fetchJobs = async () => {
        try {
          const response = await apiService.get('/job/')
          setData(response)
        } catch (error) {
          console.error('Error fetching jobs:', error)
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
        row.salary.toString().includes(searchTerm)
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

  const navigate = useNavigate()

  const handleAddJobClick = () => {
    navigate('/recruitment/jobs/add')
  }

  const handleEditClick = (jobId) => {
    navigate(`/recruitment/jobs/edit/${jobId}`)
  }

  const handleApplicantClick = (jobId) => {
    navigate(`/recruitment/jobs/applicants/${jobId}`)
  }

  return (
    <div>
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
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell onClick={() => handleSort('title')}>
                    Job Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('location')}>
                    Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('salary')}>
                    Salary {sortColumn === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('openPositions')}>
                    Open Positions{' '}
                    {sortColumn === 'openPositions' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentData.length > 0 ? (
                  currentData.map((row) => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>{row.title}</CTableDataCell>
                      <CTableDataCell>{row.location}</CTableDataCell>
                      <CTableDataCell>{`$${parseFloat(row.salary).toLocaleString()}`}</CTableDataCell>
                      <CTableDataCell>{row.openPositions}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="secondary"
                          className="position-relative me-3"
                          onClick={() => handleApplicantClick(row.id)}
                        >
                          Applicants
                          <CBadge color="success" position="top-start" shape="rounded-pill">
                            {parseInt(Math.random() * 100)}
                          </CBadge>
                        </CButton>

                        <CButton
                          color="info"
                          className="me-2"
                          onClick={() => handleEditClick(row.id)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" onClick={() => handleDeleteClick(row.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
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
              <CButton color="primary" onClick={() => handleAddJobClick()}>
                Add Job
              </CButton>
            </div>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Jobs