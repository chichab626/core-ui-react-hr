import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CForm,
  CSpinner,
  CContainer,
} from '@coreui/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import SalaryInput from '../../components/SalaryInput'
import { EditCandidatePage } from '../recruitment/candidates/CandidateForm.jsx'
const UserPage = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const loggedUser = {
    employeeId: localStorage.getItem('employeeId'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    profile: JSON.parse(localStorage.getItem('profile')),
    user: JSON.parse(localStorage.getItem('user')),
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = {
          ...loggedUser.user,
          ...loggedUser.profile.employee,
          ...loggedUser.profile.candidate,
        }
        console.log(data, loggedUser)
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner />
      </div>
    )
  }

  if (!userData) {
    return <div className="text-center">User not found.</div>
  }

  return (
    <CContainer fluid>
      <CCard className="bg-dark text-light">
        <CCardHeader as="h5" className="text-center">
          User Details
        </CCardHeader>
        <CCardBody className="mx-3">
          <CRow className="mb-3">
            <CCol>
              <label>Company Email</label>
              <CFormInput type="email" value={userData.email} readOnly />
            </CCol>
            <CCol>
              <label>Role</label>
              <CFormInput type="text" value={userData.role} readOnly />
            </CCol>
          </CRow>

          {userData.role === 'Employee' && (
            <>
              <CRow className="mb-3">
                <CCol>
                  <label>Job Title</label>
                  <CFormInput type="text" value={userData.jobTitle} readOnly />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label>External Email</label>
                  <CFormInput type="email" value={userData.externalEmail} readOnly />
                </CCol>

              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label>Salary</label>
                  <SalaryInput value={userData.salary} readOnly={true} />
                </CCol>
              </CRow>
            </>
          )}
        </CCardBody>
      </CCard>
      {Object.keys(loggedUser.profile?.candidate).length > 0 && (<EditCandidatePage candidateId={loggedUser.profile?.candidate?.id} />)}
      


    </CContainer>
  )
}

export default UserPage
