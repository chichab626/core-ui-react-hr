import React, { useState, useEffect, useRef } from 'react'
import {
  CForm,
  CButton,
  CFormInput,
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CFormLabel,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import apiService from '../../service/apiService.js'
import ToastNotification from '../../components/ToasterNotification.jsx'

const LetterForm = ({ mode }) => {
  const { id } = useParams()
  const [letterTitle, setLetterTitle] = useState('')
  const [recipient, setRecipient] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toastDeets, setToastDeets] = useState({})
  const navigate = useNavigate()
  const quillRef = useRef(null)

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      fetchLetterData()
    }
  }, [mode, id])

  const fetchLetterData = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.get(`/letters/${id}`)
      setLetterTitle(response.subject)
      setRecipient(response.toEmail)
      setLetterContent(response.message)
    } catch (error) {
      console.error('Error fetching letter data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const letterData = {
        subject: letterTitle,
        toEmail: recipient,
        message: letterContent,
      }

      if (mode === 'add') {
        await apiService.post('/letters', letterData)
      } else if (mode === 'edit') {
        await apiService.put(`/letters/${id}`, letterData)
      }

      setToastDeets({
        type: 'success',
        message: `Letter ${mode === 'add' ? 'created' : 'updated'} successfully`,
        title: 'Letter Management',
      })
    } catch (error) {
      console.error('Error saving letter:', error)
      setToastDeets({
        type: 'danger',
        message: 'An error occurred: ' + error?.response?.data?.message,
        title: 'Letter Management',
      })
    }
  }

  if (isLoading) return <CSpinner />

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <CCard>
          <CCardHeader as="h5" className="text-center">
            {mode === 'add' ? 'Create Letter' : mode === 'edit' ? 'Edit Letter' : 'View Letter'}
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  label="Subject"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  placeholder="Enter letter title"
                  required
                  readOnly={mode === 'view'}
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  label="Recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient name"
                  required
                  readOnly={mode === 'view'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Letter Content</CFormLabel>
                <ReactQuill
                  ref={quillRef}
                  value={letterContent}
                  onChange={setLetterContent}
                  placeholder="Write the content of the letter here..."
                  readOnly={mode === 'view'}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                  Back
                </CButton>
                {mode !== 'view' && (
                  <CButton type="submit" color="primary">
                    {mode === 'add' ? 'Create Letter' : 'Update Letter'}
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
      <ToastNotification deets={toastDeets} />
    </>
  )
}

const AddLetterPage = () => <LetterForm mode="add" />
const ViewLetterPage = () => <LetterForm mode="view" />
const EditLetterPage = () => <LetterForm mode="edit" />

export { AddLetterPage, ViewLetterPage, EditLetterPage }
