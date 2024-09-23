import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CPagination, CPaginationItem, CFormInput, CButton, CBadge } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons'; // Import the specific icons you need


const Jobs = () => {
    // Job postings data from the provided initialData
    const initialData = [
        { jobTitle: 'Pharmacist', status: true, datePosted: '2023-12-26', location: 'Saint-Claude', salary: 179240, openPositions: 3 },
        { jobTitle: 'Senior Financial Analyst', status: true, datePosted: '2023-12-27', location: 'Alīgūdarz', salary: 163067, openPositions: 5 },
        { jobTitle: 'Mechanical Systems Engineer', status: true, datePosted: '2024-06-30', location: 'Lisovi Sorochyntsi', salary: 74277, openPositions: 2 },
        { jobTitle: 'VP Quality Control', status: false, datePosted: '2024-06-24', location: 'Mendeleyevsk', salary: 192350, openPositions: 1 },
        { jobTitle: 'Financial Analyst', status: true, datePosted: '2024-09-06', location: 'Hamburg Bramfeld', salary: 118510, openPositions: 4 },
        { jobTitle: 'Senior Editor', status: true, datePosted: '2024-07-16', location: 'Dizhai', salary: 110668, openPositions: 2 },
        { jobTitle: 'Systems Administrator III', status: false, datePosted: '2024-03-13', location: 'Tabia', salary: 125018, openPositions: 0 },
        { jobTitle: 'Associate Professor', status: false, datePosted: '2024-04-17', location: 'Pineleng', salary: 107730, openPositions: 3 },
        { jobTitle: 'Programmer Analyst III', status: true, datePosted: '2024-04-05', location: 'Kangaslampi', salary: 159983, openPositions: 1 },
        { jobTitle: 'Information Systems Manager', status: false, datePosted: '2024-03-18', location: 'Presnenskiy', salary: 194072, openPositions: 0 },
    ];

    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [sortColumn, setSortColumn] = useState('jobTitle');
    const [sortDirection, setSortDirection] = useState('asc');

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Search functionality
    useEffect(() => {
        const filteredData = initialData.filter((row) =>
            row.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.salary.toString().includes(searchTerm)
        );
        setData(filteredData);
        setCurrentPage(1); // Reset to the first page on search
    }, [searchTerm]);

    // Sorting functionality
    const handleSort = (column) => {
        const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newSortDirection);

        const sortedData = [...data].sort((a, b) => {
            if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const navigate = useNavigate();

    const handleAddJobClick = () => {
        navigate('/recruitment/jobs/add');
    };

    const handleEditClick = (jobId) => {
        console.log(jobId);
        navigate(`/recruitment/jobs/edit/${jobId}`);
    };

    return (
        <div>
            <div className="mb-3">
                <CFormInput
                    type="text"
                    placeholder="Search jobs, location, salary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell onClick={() => handleSort('jobTitle')}>
                            Job Title {sortColumn === 'jobTitle' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('location')}>
                            Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('salary')}>
                            Salary {sortColumn === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('openPositions')}>
                            Open Positions {sortColumn === 'openPositions' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {currentData.length > 0 ? (
                        currentData.map((row, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{row.jobTitle}</CTableDataCell>
                                <CTableDataCell>{row.location}</CTableDataCell>
                                <CTableDataCell>{`$${row.salary.toLocaleString()}`}</CTableDataCell>
                                <CTableDataCell>{row.openPositions}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="secondary" className="position-relative me-3">
                                        Applicants
                                        <CBadge color="success" position="top-start" shape="rounded-pill">
                                            {parseInt(Math.random() * 100)}
                                        </CBadge>
                                    </CButton>

                                    <CButton color="info" className="me-2" onClick={() => handleEditClick(index)}>
                                        <CIcon icon={cilPencil} /> {/* Edit icon */}
                                    </CButton>
                                    <CButton color="danger" onClick={() => handleDeleteClick(index)}>
                                        <CIcon icon={cilTrash} /> {/* Delete icon */}
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="5" className="text-center">
                                No Jobs Found
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable>

            {/* Pagination */}
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

            <div className="d-grid gap-2 col-6 mx-auto">
                <CButton color="primary" onClick={() => handleAddJobClick()}>Add Job</CButton>

            </div>
        </div>
    );
};

export default Jobs;
