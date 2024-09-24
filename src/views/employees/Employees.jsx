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

const Employees = () => {
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
                const response = await fetch('https://jsonplaceholder.typicode.com/users'); // Update API endpoint as needed
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.company.name.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming company name as job title
    );

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Handle row click to navigate to another page
    const handleRowClick = (id) => {
        navigate(`/hr/employees/view/${id}`); // Update route as needed
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
        navigate('/hr/employees/add'); // Update route as needed
    };

    const handleEditClick = (id) => {
        navigate(`/hr/employees/edit/${id}`); // Update route as needed
    };

    return (
        <div>
            <CCard>
                <CCardHeader as="h5" className="text-center">Employees List</CCardHeader>
                <CCardBody>
                    <CCardText>
                        List of Employees
                    </CCardText>
                </CCardBody>

                <CCardBody className='mx-3'>
                    <CRow>
                        <CFormInput
                            type="text"
                            placeholder="Search by Name, Email, City, or Job Title"
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
                                    <CTableHeaderCell onClick={() => handleSort('jobTitle')}>
                                        Job Title {sortColumn === 'jobTitle' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('address.city')}>
                                        Location {sortColumn === 'address.city' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        Actions
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentData.length > 0 ? (
                                    currentData.map((employee) => (
                                        <CTableRow key={employee.id} onClick={() => handleRowClick(employee.id)} style={{ cursor: 'pointer' }}>
                                            <CTableDataCell>{employee.name}</CTableDataCell>
                                            <CTableDataCell>{employee.email}</CTableDataCell>
                                            <CTableDataCell>{employee.company.name}</CTableDataCell> {/* Assuming company name as job title */}
                                            <CTableDataCell>{employee.address.city}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(employee.id); }}>
                                                    <CIcon icon={cilPen} /> {/* Edit icon */}
                                                </CButton>
                                                {/* <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); alert('Remove clicked'); }}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton> */}
                                                
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="5" className="text-center">
                                            No Employees Found
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
                        {/* <div className="d-grid gap-2 col-6 mx-auto">
                            <CButton color="primary" onClick={handleAddClick}>Add Employee</CButton>
                        </div> */}
                    </CRow>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default Employees;
