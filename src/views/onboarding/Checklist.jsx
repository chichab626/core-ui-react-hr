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
  CFormInput,
  CButton,
  CFormSelect,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

const Checklist = ({ checklistData, setChecklistData }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [upload, setUpload] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [salary, setSalary] = useState('') // State for salary input
  const navigate = useNavigate() // Use useNavigate

  // Filter items based on search and status
  const filteredItems = checklistData.filter((item) => {
    const matchesSearch = item.document.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'All' || (item.uploaded ? 'Completed' : 'Pending') === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenModal = (item) => {
    setSelectedTask(item)
    setStartDate(item.type === 'date' ? item.date || '' : '')
    setSalary(item.type === 'number' ? item.salary || '' : '') // Initialize salary
    setUpload(null) // Reset upload
    setShowModal(true)
  }

  const handleUploadChange = (e) => {
    setUpload(e.target.files[0])
  }

  const handleDateChange = (e) => {
    setStartDate(e.target.value)
  }

  const handleSalaryChange = (e) => {
    setSalary(e.target.value) // Update salary state
  }

  const handleSave = () => {
    const updatedData = checklistData.map((item) => {
      if (item.id === selectedTask.id) {
        if (selectedTask.type === 'document' && upload) {
          item.document = upload.name // Update with uploaded file name
          item.uploaded = true
        } else if (selectedTask.type === 'date') {
          item.date = startDate // Update with selected date
          item.uploaded = true
        } else if (selectedTask.type === 'number') {
          item.salary = salary // Update with salary
          item.uploaded = true
        }
      }
      return item
    })

    setChecklistData(updatedData)

    // Clear modal state
    setUpload(null)
    setStartDate('')
    setSalary('')
    setShowModal(false)
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader as="h5" className="text-center">
          Onboarding Checklist
        </CCardHeader>
        <CCardBody></CCardBody>

        <CCardBody className="mx-3">
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormInput
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CCol>
            <CCol md={4}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </CFormSelect>
            </CCol>
            <CCol md={4} className="text-end">
              {/* You can add extra controls here if needed */}
            </CCol>
          </CRow>
          <CTable hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Task</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Saved Value</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.document}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.uploaded ? 'success' : 'secondary'}>
                      {item.uploaded ? 'Completed' : 'Pending'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.type === 'document' ? (
                      <CButton
                        color="link"
                        href={`/${item.document}.pdf`} // Assuming the document link is the file name with `.pdf`
                        target="_blank" // Open in a new tab
                        rel="noopener noreferrer"
                      >
                        {item.document}.pdf
                      </CButton>
                    ) : item.type === 'date' ? (
                      item.date || ''
                    ) : (
                      item.salary || ''
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" className="me-2" onClick={() => handleOpenModal(item)}>
                      Edit
                    </CButton>
                    <CButton color="danger">Clear</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CRow className="my-3">
        <CCol>
          <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
            Back
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setSelectedTask(null)
              setStartDate('')
              setSalary('')
              setShowModal(true)
            }}
          >
            Complete Onboarding
          </CButton>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{selectedTask ? 'Edit Task' : 'Add Task'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTask?.type === 'document' ? (
            <>
              <CFormLabel htmlFor="documentUpload">Upload Document</CFormLabel>
              <CFormInput type="file" id="documentUpload" onChange={handleUploadChange} />
            </>
          ) : selectedTask?.type === 'date' ? (
            <>
              <CFormLabel htmlFor="date">Select Date</CFormLabel>
              <CFormInput type="date" id="date" value={startDate} onChange={handleDateChange} />
            </>
          ) : selectedTask?.type === 'number' ? (
            <>
              <CFormLabel htmlFor="salary">Set Salary</CFormLabel>
              <CFormInput
                type="number"
                id="salary"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="Enter salary"
              />
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

const ChecklistPage = () => {
  const { id } = useParams() // Assuming you might want to fetch data based on some ID
  const [checklistData, setChecklistData] = useState([])

  useEffect(() => {
    const fetchChecklist = async () => {
      // Mock data for testing, including type fields
      const data = [
        { id: 1, document: 'Upload Resume', uploaded: true, date: '2024-09-01', type: 'document' },
        { id: 2, document: 'Set Interview Date', uploaded: false, date: '', type: 'date' },
        {
          id: 3,
          document: 'Upload Identification',
          uploaded: true,
          date: '2024-09-15',
          type: 'document',
        },
        { id: 4, document: 'Set Start Date', uploaded: false, date: '', type: 'date' },
        { id: 5, document: 'Set Salary', uploaded: false, salary: '', type: 'number' }, // Added salary field for number type
      ]
      setChecklistData(data)
    }

    fetchChecklist()
  }, [id])

  return checklistData.length ? (
    <Checklist checklistData={checklistData} setChecklistData={setChecklistData} />
  ) : (
    <div>Loading...</div>
  )
}

export default ChecklistPage
