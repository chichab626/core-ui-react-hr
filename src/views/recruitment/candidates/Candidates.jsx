import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CPagination, CPaginationItem, CButton, CFormInput,
    CCard,
    CCardBody,
    CCardText,
    CCardHeader,
    CRow
} from '@coreui/react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import { cilPen, cilTrash } from '@coreui/icons'; // Import CoreUI icons
import CIcon from '@coreui/icons-react'; // Import the CIcon component
import apiService from '../../../service/apiService'

const Candidates = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const navigate = useNavigate(); // Use useNavigate

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.get('/candidates/')
                setData(response)
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Handle row click to navigate to another page
    const handleRowClick = (id) => {
        navigate(`/todo/page/${id}`);
    };

    // Sorting functionality
    const handleSort = (column) => {
        const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newSortDirection);

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const handleAddClick = () => {
        navigate('/recruitment/candidates/add');
    };

    const handleEditClick = (id) => {
        console.log(id);
        navigate(`/recruitment/candidates/edit/${id}`);
    };

    return (
        <div>
            <CCard>
                <CCardHeader as="h5" className="text-center">Candidates List</CCardHeader>
                <CCardBody>
                    <CCardText>
                        List of Applicants and Candidates
                    </CCardText>
                </CCardBody>

                <CCardBody className='mx-3'>
                    <CRow>
                        <CFormInput
                            type="text"
                            placeholder="Search by Name, Email, Phone, or Location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-3"
                        />
                    </CRow>
                    <CRow>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell onClick={() => handleSort('name')}>
                                        Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('email')}>
                                        Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('phone')}>
                                        Phone {sortColumn === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('location')}>
                                        Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        Actions
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentData.length > 0 ? (
                                    currentData.map((candidate) => (
                                        <CTableRow key={candidate.id} style={{ cursor: 'pointer' }}>
                                            <CTableDataCell>{candidate.name}</CTableDataCell>
                                            <CTableDataCell>{candidate.externalEmail}</CTableDataCell>
                                            <CTableDataCell>{candidate.phone}</CTableDataCell>
                                            <CTableDataCell>{candidate.location}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(candidate.id); }}>
                                                    <CIcon icon={cilPen} /> {/* Edit icon */}
                                                </CButton>{' '}
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); alert('Remove clicked'); }}>
                                                    <CIcon icon={cilTrash} /> {/* Remove icon */}
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="5" className="text-center">
                                            No Candidates Found
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
                            <CButton color="primary" onClick={() => handleAddClick()}>Add Candidate</CButton>
                        </div>
                    </CRow>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default Candidates;
