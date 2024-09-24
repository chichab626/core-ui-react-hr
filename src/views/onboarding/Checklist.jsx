import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    CCardHeader
} from '@coreui/react';

const Checklist = ({ checklistData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [upload, setUpload] = useState(null);
    const [startDate, setStartDate] = useState('');
    const navigate = useNavigate(); // Use useNavigate

    // Filter items based on search and status
    const filteredItems = checklistData.filter(item => {
        const matchesSearch = item.document.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || (item.uploaded ? 'Completed' : 'Pending') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (item) => {
        setSelectedTask(item);
        setStartDate(item.type === 'date' ? item.date || '' : ''); // Set start date if type is date
        setShowModal(true);
    };

    const handleUploadChange = (e) => {
        setUpload(e.target.files[0]);
    };

    const handleDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleSave = () => {
        // Handle save logic based on selected task type
        if (selectedTask.type === 'document' && upload) {
            // Logic to handle document upload
            console.log(`Uploading document: ${upload.name}`);
        } else if (selectedTask.type === 'date') {
            // Logic to handle date saving
            console.log(`Selected date: ${startDate}`);
        }

        // Close modal after saving
        setShowModal(false);
    };

    return (
        <CContainer>
            <CCard>
                <CCardHeader as="h5" className="text-center">Onboarding Checklist</CCardHeader>
                <CCardBody>

                </CCardBody>

                <CCardBody className='mx-3'>
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
                            <CFormSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={4} className="text-end">
                            <CButton color="primary" onClick={() => { setSelectedTask(null); setStartDate(''); setShowModal(true); }}>Add Task</CButton>
                        </CCol>
                    </CRow>
                    <CTable hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Task</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {filteredItems.map(item => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.document}</CTableDataCell>
                                    <CTableDataCell>
                                        <CBadge color={item.uploaded ? 'success' : 'secondary'}>
                                            {item.uploaded ? 'Completed' : 'Pending'}
                                        </CBadge>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color="info" className="me-2" onClick={() => handleOpenModal(item)}>Edit</CButton>
                                        <CButton color="danger">Delete</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>

                </CCardBody>
            </CCard>
            <CRow className='my-3'>
                <CCol>
                    <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                        Back
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
                    ) : (
                        <>
                            <CFormLabel htmlFor="date">Select Date</CFormLabel>
                            <CFormInput
                                type="date"
                                id="date"
                                value={startDate}
                                onChange={handleDateChange}
                            />
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Close</CButton>
                    <CButton color="primary" onClick={handleSave}>Save</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

const ChecklistPage = () => {
    const { id } = useParams(); // Assuming you might want to fetch data based on some ID
    const [checklistData, setChecklistData] = useState([]);

    useEffect(() => {
        const fetchChecklist = async () => {
            // Mock data for testing, including type fields
            const data = [
                { id: 1, document: 'Resume', uploaded: true, date: '2024-09-01', type: 'document' },
                { id: 2, document: 'Interview Date', uploaded: false, date: '', type: 'date' },
                { id: 3, document: 'Identification', uploaded: true, date: '2024-09-15', type: 'document' },
                { id: 4, document: 'Start Date', uploaded: false, date: '', type: 'date' },
            ];
            setChecklistData(data);
        };

        fetchChecklist();
    }, [id]);

    return checklistData.length ? <Checklist checklistData={checklistData} /> : <div>Loading...</div>;
};

export default ChecklistPage;
