import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import { CSpinner } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeForm = ({ mode, employee, onSubmit }) => {

    const navigate = useNavigate();

    const onCancel = () => {
        navigate(-1)
    }

  return (
    <CCard>
      <CCardHeader as="h5" className="text-center">
        {mode === 'add' ? 'Add Employee' : mode === 'edit' ? 'Edit Employee' : 'View Employee'}
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={onSubmit}>
          {mode !== 'add' && (
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Employee ID"
                  value={employee.employeeId || ''}
                  disabled={true} // Disable input for both edit and view modes
                  required
                />
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Name"
                value={employee.name || ''}
                disabled={mode === 'view'}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="email"
                label="Email"
                value={employee.email || ''}
                disabled={mode === 'view'}
                required
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Job Title"
                value={employee.jobTitle || ''}
                disabled={mode === 'view'}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Location"
                value={employee.location || ''}
                disabled={mode === 'view'}
                required
              />
            </CCol>
          </CRow>

          {/* Add Salary Input */}
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Salary"
                value={employee.salary || ''}
                disabled={mode === 'view'}
                required
              />
            </CCol>
          </CRow>

          {mode === 'view' && (
            <CRow>
              <CCol className="my-3">
                <CButton color="secondary" onClick={onCancel}>
                  Back
                </CButton>
              </CCol>
            </CRow>
          )}
          {mode !== 'view' && (
            <CRow>
              <CCol className="my-3">
                <CButton color="secondary" onClick={onCancel}>
                  Cancel
                </CButton>

                <CButton type="submit" color="primary" className="mx-3">
                  {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                </CButton>
              </CCol>
            </CRow>
          )}
        </CForm>
      </CCardBody>
    </CCard>
  )
}

// AddEmployeePage Component
const AddEmployeePage = () => {
  return (
    <EmployeeForm mode="add" employee={{}} onSubmit={handleAddEmployee} />
  )
}

// ViewEmployeePage Component
const ViewEmployeePage = () => {
  const { id } = useParams()
  const [employeeData, setEmployeeData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployee = async () => {
      // Mock data for testing
      const data = {
        employeeId: '123456',
        name: 'John Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        location: 'Toronto',
        salary: '$70,000'
      }
      setEmployeeData(data)
    }
    fetchEmployee()
  }, [id])

  return employeeData ? (
    <EmployeeForm mode="view" employee={employeeData} onSubmit={null} />
  ) : (
    <CSpinner />
  )
}

// EditEmployeePage Component
const EditEmployeePage = () => {
  const { id } = useParams()
  const [employeeData, setEmployeeData] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      // Mock data for testing
      const data = {
        employeeId: '123456',
        name: 'John Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        location: 'Toronto',
        salary: '$70,000'
      }
      setEmployeeData(data)
    }
    fetchEmployee()
  }, [id])

  return employeeData ? (
    <EmployeeForm
      mode="edit"
      employee={employeeData}
      onSubmit={handleEditEmployee}
    />
  ) : (
    <CSpinner />
  )
}

// Placeholder functions for handling submit and cancel actions
const handleAddEmployee = (event) => {
  event.preventDefault()
  // Implement add employee logic here
}

const handleEditEmployee = (event) => {
  event.preventDefault()
  // Implement edit employee logic here
}

export { AddEmployeePage, EditEmployeePage, ViewEmployeePage }
