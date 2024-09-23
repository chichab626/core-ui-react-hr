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
    CButton,
    CFormCheck,
    CFormInput,
    CPagination,
    CPaginationItem,
    CSpinner,
    CButtonGroup
} from '@coreui/react';

const JobApplicants = ({ jobData }) => {
    const [addedApplicants, setAddedApplicants] = useState([]);
    const [availableApplicants, setAvailableApplicants] = useState([]);
    const [selectedAdded, setSelectedAdded] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);      // Error state

    // Pagination state for both tables
    const [addedPage, setAddedPage] = useState(1);
    const [availablePage, setAvailablePage] = useState(1);
    const itemsPerPage = 5;

    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [openPositions, setOpenPositions] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const navigate = useNavigate();

    // Fetch available applicants from the API
    useEffect(() => {
        if (jobData) {
            setJobTitle(jobData.jobTitle);
            setLocation(jobData.location);
            setSalary(jobData.salary);
            setOpenPositions(jobData.openPositions);
            setJobDescription(jobData.jobDescription);
        }

        const fetchApplicants = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch applicants');
                }
                const data = await response.json();
                // Map the fetched data to the format we need
                const formattedData = data.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
                setAvailableApplicants(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    // Transfer selected added applicants back to available applicants
    const bulkRemoveApplicants = () => {
        const removedApplicants = addedApplicants.filter(applicant => selectedAdded.includes(applicant.id));
        setAvailableApplicants((prev) => [...prev, ...removedApplicants]);
        setAddedApplicants((prev) => prev.filter(applicant => !selectedAdded.includes(applicant.id)));
        setSelectedAdded([]);
    };

    const bulkAddApplicants = () => {
        const newApplicants = availableApplicants.filter(applicant => selectedAvailable.includes(applicant.id));
        setAddedApplicants((prev) => [...prev, ...newApplicants]);
        setAvailableApplicants((prev) => prev.filter(applicant => !selectedAvailable.includes(applicant.id)));
        setSelectedAvailable([]);
    };

    // Toggle selection of individual applicants
    const toggleSelection = (id, selectedList, setSelectedList) => {
        if (selectedList.includes(id)) {
            setSelectedList(selectedList.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedList([...selectedList, id]);
        }
    };

    // Filter available applicants based on search query
    const filteredAvailableApplicants = availableApplicants.filter((applicant) =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const paginate = (data, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const paginatedAddedApplicants = paginate(addedApplicants, addedPage);
    const paginatedAvailableApplicants = paginate(filteredAvailableApplicants, availablePage);

    return (
        <CContainer className="px-4">
            {/* Display Job Information */}
            <CRow className="mb-4">
                <h5>Job Title: {jobTitle}</h5>
                <CCol>

                    <p>Location: {location}</p>
                    <p>Open Positions: {openPositions}</p>
                </CCol>
                <CCol>
                    <p>Salary: ${salary}</p>
                    <p>Job Description: {jobDescription}</p>
                </CCol>
            </CRow>
            <h4>Job Applicants</h4>
            <CRow xs={{ gutterX: 5 }}>
                <CCol>
                    <h5>Added Applicants</h5>
                    <CTable striped hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>
                                    <CFormCheck
                                        checked={selectedAdded.length === addedApplicants.length && addedApplicants.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedAdded(addedApplicants.map(applicant => applicant.id));
                                            } else {
                                                setSelectedAdded([]);
                                            }
                                        }}
                                    />
                                </CTableHeaderCell>
                                <CTableHeaderCell>Name</CTableHeaderCell>
                                <CTableHeaderCell>Email</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {addedApplicants.length === 0 ? (
                                <CTableRow>
                                    <CTableDataCell colSpan={3}>No applicants yet</CTableDataCell>
                                </CTableRow>
                            ) : (
                                paginatedAddedApplicants.map((applicant) => (
                                    <CTableRow key={applicant.id}>
                                        <CTableDataCell>
                                            <CFormCheck
                                                checked={selectedAdded.includes(applicant.id)}
                                                onChange={() => toggleSelection(applicant.id, selectedAdded, setSelectedAdded)}
                                            />
                                        </CTableDataCell>
                                        <CTableDataCell>{applicant.name}</CTableDataCell>
                                        <CTableDataCell>{applicant.email}</CTableDataCell>
                                    </CTableRow>
                                ))
                            )}
                        </CTableBody>
                    </CTable>

                    {/* Pagination for Added Applicants */}
                    {addedApplicants.length > itemsPerPage && (
                        <CPagination aria-label="Added applicants pagination">
                            <CPaginationItem onClick={() => setAddedPage(addedPage - 1)} disabled={addedPage === 1}>Previous</CPaginationItem>
                            <CPaginationItem onClick={() => setAddedPage(addedPage + 1)} disabled={addedPage * itemsPerPage >= addedApplicants.length}>Next</CPaginationItem>
                        </CPagination>
                    )}

<CButtonGroup className="float-end mb-3">
    <CButton color="danger" onClick={bulkRemoveApplicants}>Remove Selected</CButton>
    <CButton color="primary" onClick={bulkRemoveApplicants}>Save Applicants</CButton>
    <CButton color="success" onClick={bulkRemoveApplicants}>Hire Selected</CButton>
</CButtonGroup>

                </CCol>

                <CCol>
                    <h5>Available Candidates</h5>
                    {/* Search Input Field */}
                    <CFormInput
                        type="text"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}  // Update search query state
                        className="mb-3"
                    />

                    {/* Handle loading, error, and content states */}
                    {loading ? (
                        <CSpinner />
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <>
                            <CTable striped hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            <CFormCheck
                                                checked={selectedAvailable.length === filteredAvailableApplicants.length && filteredAvailableApplicants.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedAvailable(filteredAvailableApplicants.map(applicant => applicant.id));
                                                    } else {
                                                        setSelectedAvailable([]);
                                                    }
                                                }}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {paginatedAvailableApplicants.map((applicant) => (
                                        <CTableRow key={applicant.id}>
                                            <CTableDataCell>
                                                <CFormCheck
                                                    checked={selectedAvailable.includes(applicant.id)}
                                                    onChange={() => toggleSelection(applicant.id, selectedAvailable, setSelectedAvailable)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>{applicant.name}</CTableDataCell>
                                            <CTableDataCell>{applicant.email}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>

                            {/* Pagination for Available Applicants */}
                            {filteredAvailableApplicants.length > itemsPerPage && (
                                <CPagination aria-label="Available applicants pagination">
                                    <CPaginationItem onClick={() => setAvailablePage(availablePage - 1)} disabled={availablePage === 1}>Previous</CPaginationItem>
                                    <CPaginationItem onClick={() => setAvailablePage(availablePage + 1)} disabled={availablePage * itemsPerPage >= filteredAvailableApplicants.length}>Next</CPaginationItem>
                                </CPagination>
                            )}
                        </>
                    )}
                    <CButton color="success" onClick={bulkAddApplicants}>Add Selected</CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                        Back
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    );
};

const JobApplicantsPage = () => {
    const { id } = useParams();
    const [jobData, setJobData] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            // Mock data for testing
            const data = { jobTitle: 'Pharmacist', status: true, datePosted: '2023-12-26', location: 'Saint-Claude', salary: 179240, openPositions: 3 };
            setJobData(data);
        };
        fetchJob();
    }, [id]);

    return jobData ? <JobApplicants jobData={jobData} /> : <div>Loading...</div>;
};

export default JobApplicantsPage;
