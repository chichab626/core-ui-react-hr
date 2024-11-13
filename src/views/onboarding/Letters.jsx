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
  CAlert,
  CSpinner,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilArrowRight, cilPen, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import ToastNotification from '../../components/ToasterNotification.jsx'
import apiService from '../../service/apiService.js'

const LettersPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [letters, setLetters] = useState([]) // Dynamic data for letters
  const [sortConfig, setSortConfig] = useState({ key: 'type', direction: 'asc' })
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastDeets, setToastDeets] = useState(null)
  const itemsPerPage = 5
  const navigate = useNavigate()

  // Fetch letters data from API on component load
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const data = await apiService.get('/letters')
        const formattedData = data.map((item) => ({
          id: item.id,
          sender: item.fromEmail,
          recipient: item.toEmail,
          type: item.type,
          dateSent: item.dateSent ? item.dateSent.split('T')[0] : '',
          status: item.status,
          content: item.content,
        }))
        setLetters(formattedData)
      } catch (error) {
        console.error('Failed to fetch letters:', error)
        setToastDeets({
          type: 'danger',
          message: 'Failed to load letters data.',
          title: 'Error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchLetters()
  }, [])

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedLetters = [...letters].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1
    }
  })

  // Filter and paginate the data
  const filteredLetters = sortedLetters.filter(
    (letter) =>
      letter.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (letter.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter ? letter.status === statusFilter : true)),
  )
  const indexOfLastLetter = currentPage * itemsPerPage
  const indexOfFirstLetter = indexOfLastLetter - itemsPerPage
  const currentLetters = filteredLetters.slice(indexOfFirstLetter, indexOfLastLetter)
  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage)

  const updateLetterClick = async (letterId, status = 'Sent') => {
    try {
      setLoading(true) // Start loading while the letter is being sent
      await apiService.put(`/letters/${letterId}`, { status: status })

      // Update letter status to "Sent"
      setLetters((prevLetters) =>
        prevLetters.map((letter) =>
          letter.id === letterId ? { ...letter, status: status } : letter,
        ),
      )

      // Show success toast
      setToastDeets({
        type: 'success',
        message: `Letter ${status}`,
        title: 'Success',
      })
    } catch (error) {
      setToastDeets({
        type: 'danger',
        message: 'Error occurred',
        title: 'Error',
      })
    } finally {
      setLoading(false) // Stop loading after the process completes
    }
  }

  const deleteLetterClick = async (letterId) => {
    setToastDeets({
        type: 'warning',
        message: 'Are you sure you want to proceed?',
        title: 'Confirm Delete',
        onConfirm: () => { deleteLetter(letterId); }, // Handle confirmation action
      });
  }

  const deleteLetter = async (letterId) => {
    try {
      setLoading(true) // Start loading while the letter is being sent
      await apiService.delete(`/letters/${letterId}`)

      // Update letter status to "Sent"
      setLetters((prevLetters) =>
        prevLetters.filter((letter) => letter.id !== letterId),
      )

      setToastDeets({})
    } catch (error) {
      setToastDeets({
        type: 'danger',
        message: 'Error occurred',
        title: 'Error',
      })
    } finally {
      setLoading(false) // Stop loading after the process completes
    }
  }

  const handleEditLetterClick = (letterId) => {
    navigate(`/hr/letters/edit/${letterId}`)
  }

  return (
    <CContainer>
      {/* rendering the toast component */}
      <ToastNotification deets={toastDeets} />
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader as="h5" className="text-center">
              Letters
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    placeholder="Search by sender or type"
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
                    <option value="Sent">Sent</option>
                    <option value="Draft">Draft</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell onClick={() => requestSort('sender')}>
                      Sender
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('recipient')}>
                      Recipient
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('type')}>Type</CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('dateSent')}>
                      Date Sent
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('status')}>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell className="center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                {loading ? (
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell colSpan="5">
                        <CSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                ) : (
                  <CTableBody>
                    {currentLetters.map((letter) => (
                      <CTableRow key={letter.id}>
                        <CTableDataCell>{letter.sender}</CTableDataCell>
                        <CTableDataCell>{letter.recipient}</CTableDataCell>
                        <CTableDataCell>{letter.type}</CTableDataCell>
                        <CTableDataCell>{letter.dateSent}</CTableDataCell>
                        <CTableDataCell>{letter.status}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            variant="outline"
                            className="me-2"
                            onClick={() => handleEditLetterClick(letter.id)}
                          >
                            <CIcon icon={cilPen} />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => deleteLetterClick(letter.id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>{' '}
                          {letter.status !== 'Sent' && (
                            <CButton color="success" onClick={() => updateLetterClick(letter.id)}>
                              Send
                            </CButton>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                )}
              </CTable>
              <CPagination aria-label="Letters pagination" className="mt-3">
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

export default LettersPage
