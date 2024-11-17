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
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilPen, cilTrash, cilChatBubble } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import ToastNotification from '../../components/ToasterNotification.jsx'
import apiService from '../../service/apiService.js'

const MessagePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [letters, setLetters] = useState([]) // Dynamic data for letters
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Inbox') // Track the active tab
  const itemsPerPage = 5
  const navigate = useNavigate()
  const loggedUser = { email: localStorage.getItem('email'),  role: localStorage.getItem('role'),  profile : JSON.parse(localStorage.getItem('profile'))};

  useEffect(() => {

    const fetchLetters = async () => {
      try {
        let query = `email=${loggedUser.email}`
        query += loggedUser.profile?.candidate?.externalEmail ? `&externalEmail=${loggedUser.profile?.candidate?.externalEmail}` : ''
        const data = await apiService.get('/letters?' + query)

        const formattedData = data.map((item) => ({
          id: item.id,
          sender: item.fromEmail,
          recipient: item.toEmail,
          type: item.type,
          dateSent: item.dateSent ? item.dateSent.split('T')[0] : '',
          status: item.status,
          content: item.content,
          subject:item.subject
        }))
        setLetters(formattedData)
      } catch (error) {
        console.error('Failed to fetch letters:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLetters()
  }, [])

  // Filtering letters based on the active tab
  const filteredLetters = letters.filter((letter) => {
    if (activeTab === 'Inbox') return (letter.recipient === loggedUser?.email || letter.recipient === loggedUser?.profile?.candidate?.email || letter.recipient === loggedUser?.profile?.candidate?.externalEmail) && letter.status === 'Sent'
    if (activeTab === 'Drafts') return letter.status === 'Draft' && letter.sender === localStorage.getItem('email')
    if (activeTab === 'Sent') return letter.status === 'Sent' && letter.sender === localStorage.getItem('email')
    return true
  })

  const indexOfLastLetter = currentPage * itemsPerPage
  const indexOfFirstLetter = indexOfLastLetter - itemsPerPage
  const currentLetters = filteredLetters.slice(indexOfFirstLetter, indexOfLastLetter)
  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage)

  const handleLetterClick = (letterId) => {
    if (activeTab === 'Inbox' || activeTab === 'Sent') {
        navigate(`/hr/letters/view/${letterId}`)
    } else {
        navigate(`/hr/letters/edit/${letterId}`)
    }
    
  }

  const updateLetterClick = async (letterId, status = 'Sent') => {
    try {
      setLoading(true) // Start loading while the letter is being sent
      await apiService.put(`/letters/${letterId}`, { status: status, dateSent: Date.now() })

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

  return (
    <CContainer>
      <CRow>
        <CCol md={2}>
          <CNav className="flex-column" variant="pills">
            <CNavItem>
              <CNavLink active={activeTab === 'Inbox'} onClick={() => setActiveTab('Inbox')}>
                Inbox
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'Sent'} onClick={() => setActiveTab('Sent')}>
                Sent
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'Drafts'} onClick={() => setActiveTab('Drafts')}>
                Drafts
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
        <CCol md={10}>
          <CCard>
            <CCardHeader as="h5" className="text-center">
              {activeTab}
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <CSpinner />
              ) : (
                <>
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Title</CTableHeaderCell>
                        <CTableHeaderCell>Recipient</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Date Sent</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentLetters.map((letter) => (
                        <CTableRow key={letter.id}>
                          <CTableDataCell>{letter.subject}</CTableDataCell>
                          <CTableDataCell>{letter.recipient}</CTableDataCell>
                          <CTableDataCell>{letter.type}</CTableDataCell>
                          <CTableDataCell>{letter.dateSent}</CTableDataCell>
                          <CTableDataCell>{letter.status}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={activeTab === 'Drafts'? 'info' : 'secondary'}
                              variant="outline"
                              className="me-2"
                              onClick={() => handleLetterClick(letter.id)}
                            >
                              <CIcon icon={activeTab === 'Drafts'? cilPen : cilChatBubble} />
                            </CButton>
                            <CButton color="danger" variant="outline">
                              <CIcon icon={cilTrash} />
                            </CButton>
                            {letter.status !== 'Sent' && activeTab === 'Drafts' && (
                            <CButton className="mx-3" color="success" onClick={() => updateLetterClick(letter.id)}>
                              Send
                            </CButton>
                          )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
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
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default MessagePage
