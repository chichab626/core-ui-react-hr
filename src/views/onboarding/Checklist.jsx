import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
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
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'
import ToastNotification from '../../components/ToasterNotification.jsx'
import apiService from '../../service/apiService.js'

const Checklist = ({ checklistData, setChecklistData, hireData }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [upload, setUpload] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [salary, setSalary] = useState('') // State for salary input
  const navigate = useNavigate()

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
    setSalary(item.type === 'number' ? item.salary || '' : '')
    setUpload(null)
    setShowModal(true)
  }

  const handleUploadChange = (e) => {
    setUpload(e.target.files[0])
  }

  const handleDateChange = (e) => {
    setStartDate(e.target.value)
  }

  const handleSalaryChange = (e) => {
    setSalary(e.target.value)
  }

  const handleSave = async () => {
    const documentMapping = {
      1: 'resume',
      2: 'identification',
      3: 'taxInformation',
      4: 'trainingDate',
    }

    const updatedData = await Promise.all(
      checklistData.map(async (item) => {
        if (item.id === selectedTask.id) {
          // Update item properties based on selected task type
          switch (selectedTask.type) {
            case 'document':
              if (upload) {
                item.value = upload.name // Update with uploaded file name
                item.uploaded = true
              }
              break
            case 'date':
              item.value = startDate // Update with selected date
              item.uploaded = true
              break
            case 'number':
              item.salary = salary // Update with salary
              item.uploaded = true
              break
            default:
              break
          }
        }

        // Determine the correct field to save using documentMapping
        const fieldKey = documentMapping[item.id]
        const itemToSave = fieldKey && item.value ? { [fieldKey]: item.value } : {}

        // Save the updated item data via API
        if (Object.keys(itemToSave).length > 0) {
          await apiService.put(`/checklist/${hireData.id}`, itemToSave)
        }

        return item
      }),
    )

    setChecklistData(updatedData)

    // Clear modal state
    setUpload(null)
    setStartDate('')
    setSalary('')
    setShowModal(false)
  }

  const completeOnboarding = async () => {
    // Call API to complete onboarding
    await apiService.put(`/checklist/${hireData.id}`, { status: 'Complete' })
    navigate(-1)
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
                    {item.uploaded ? (
                      <CIcon style={{ color: 'lightgreen' }} icon={cilCheckCircle} />
                    ) : (
                      <CIcon style={{ color: 'darkgray' }} icon={cilCheckCircle} />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.type === 'document' ? (
                      <CButton
                        color="link"
                        href={`/${item.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </CButton>
                    ) : item.type === 'date' ? (
                      item.value || ''
                    ) : (
                      item.salary || ''
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" className="me-2" onClick={() => handleOpenModal(item)}>
                      Edit
                    </CButton>
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
          {hireData.status !== 'Complete' && (
            <CButton
              color="primary"
              onClick={() => completeOnboarding()}
              disabled={!checklistData.every((item) => item.value)}
            >
              Complete Onboarding
            </CButton>
          )}
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
  const location = useLocation()
  const { id } = useParams()
  const [checklistData, setChecklistData] = useState([])

  const hire = location?.state?.hire
  useEffect(() => {
    const fetchChecklist = async () => {
      // Mock data for testing
      const data = [
        {
          id: 1,
          document: 'Upload Resume',
          uploaded: hire.resume,
          type: 'document',
          value: hire.resume,
        },
        {
          id: 2,
          document: 'Upload Identification',
          uploaded: hire.identification,
          type: 'document',
          value: hire.identification,
        },
        {
          id: 3,
          document: 'Upload Tax Information',
          uploaded: hire.taxInformation,
          type: 'document',
          value: hire.taxInformation,
        },
        {
          id: 4,
          document: 'Choose Training Date',
          uploaded: hire.trainingDate,
          type: 'date',
          value: hire.trainingDate ? new Date(hire.trainingDate).toISOString().split('T')[0] : null,
        },
      ]
      setChecklistData(data)
    }

    fetchChecklist()
  }, [id])

  return checklistData.length ? (
    <Checklist checklistData={checklistData} setChecklistData={setChecklistData} hireData={hire} />
  ) : (
    <div>Loading...</div>
  )
}

export default ChecklistPage
