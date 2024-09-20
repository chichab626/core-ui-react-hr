import React, { useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    CRow, CCol, CCard, CCardHeader, CCardBody,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CButton,
    CButtonGroup
} from '@coreui/react';
import { rgbToHex } from '@coreui/utils';
import { DocsLink } from 'src/components';



const Jobs = () => {
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Layout</strong> <small>Auto-sizing</small>
                </CCardHeader>
                <CCardBody>
                    <CForm className="row gx-3 gy-2 align-items-center">
                        <CCol sm={3}>
                            <CFormLabel className="visually-hidden" htmlFor="specificSizeInputName">
                                Name
                            </CFormLabel>
                            <CFormInput id="specificSizeInputName" placeholder="Jane Doe" />
                        </CCol>
                        <CCol sm={3}>
                            <CFormLabel className="visually-hidden" htmlFor="specificSizeInputGroupUsername">
                                Username
                            </CFormLabel>
                            <CInputGroup>
                                <CInputGroupText>@</CInputGroupText>
                                <CFormInput id="specificSizeInputGroupUsername" placeholder="Username" />
                            </CInputGroup>
                        </CCol>
                        <CCol sm={3}>
                            <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                                Preference
                            </CFormLabel>
                            <CFormSelect id="specificSizeSelect">
                                <option>Choose...</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </CFormSelect>
                        </CCol>
                        <CCol xs="auto">
                            <CFormCheck type="checkbox" id="autoSizingCheck2" label="Remember me" />
                        </CCol>
                        <CCol xs="auto">
                            <CButton color="secondary" type="submit">
                                Search
                            </CButton>
                        </CCol>
                    </CForm>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardHeader>
                    Theme colors

                </CCardHeader>
                <CCardBody>
                    <CRow>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
  <CButton color="primary">Add New Job</CButton>
</div>
                    </CRow>
                    <CRow>
                        <CTable align="middle" responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col" className="w-25">
                                        Heading 1
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col" className="w-25">
                                        Heading 2
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col" className="w-25">
                                        Heading 3
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col" className="w-25">
                                        Heading 4
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: middle;</code> from the table
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: middle;</code> from the table
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: middle;</code> from the table
                                    </CTableDataCell>
                                    <CTableDataCell>
                                    <CButtonGroup role="group" aria-label="Basic mixed styles example">
  <CButton color="info">Edit</CButton>
  <CButton color="success">Applicants</CButton>
  <CButton color="danger">Delete</CButton>
</CButtonGroup>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow align="bottom">
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: bottom;</code> from the table row
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: bottom;</code> from the table row
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: bottom;</code> from the table row
                                    </CTableDataCell>
                                    <CTableDataCell>
                                    <CButtonGroup role="group" aria-label="Basic mixed styles example">
  <CButton color="info">Edit</CButton>
  <CButton color="success">Applicants</CButton>
  <CButton color="danger">Delete</CButton>
</CButtonGroup>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: middle;</code> from the table
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        This cell inherits <code>vertical-align: middle;</code> from the table
                                    </CTableDataCell>
                                    <CTableDataCell align="top">This cell is aligned to the top.</CTableDataCell>
                                    <CTableDataCell>
                                    <CButtonGroup role="group" aria-label="Basic mixed styles example">
  <CButton color="info">Edit</CButton>
  <CButton color="success">Applicants</CButton>
  <CButton color="danger">Delete</CButton>
</CButtonGroup>
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    );
};

export default Jobs;
