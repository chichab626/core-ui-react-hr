import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCol, CRow } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const JobForm = ({ mode, jobData }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [openPositions, setOpenPositions] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [validation, setValidation] = useState({}); // For validation states
    const navigate = useNavigate();

    useEffect(() => {
        if (mode === 'edit' && jobData) {
            setJobTitle(jobData.jobTitle);
            setLocation(jobData.location);
            setSalary(jobData.salary);
            setOpenPositions(jobData.openPositions);
            setJobDescription(jobData.jobDescription);
        }
    }, [mode, jobData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const job = { jobTitle, location, salary, openPositions, jobDescription };

        // Simple validation
        const newValidation = {};
        if (!jobTitle) newValidation.jobTitle = 'Job Title is required';
        if (!location) newValidation.location = 'Location is required';
        if (!salary || isNaN(salary)) newValidation.salary = 'Valid salary is required';
        if (!openPositions || isNaN(openPositions)) newValidation.openPositions = 'Valid number of open positions is required';

        setValidation(newValidation);

        if (Object.keys(newValidation).length === 0) {
            if (mode === 'add') {
                // Call API to add job
            } else {
                // Call API to update job
            }
            navigate('/jobs'); // Redirect after submit
        }
    };

    const formatCurrency = (value) => {
        const numericValue = String(value).replace(/[^0-9]/g, '');
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numericValue / 100);
    };

    const handleSalaryChange = (e) => {
        const value = e.target.value;
        setSalary(value);
    };

    return (
        <CForm onSubmit={handleSubmit}>
            <h2>{mode === 'add' ? 'Add Job' : 'Edit Job'}</h2>

            <CRow className="mb-3">
                <CCol>
                    <CFormInput
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Job Title"
                        invalid={!!validation.jobTitle}
                    />
                    {validation.jobTitle && <div className="invalid-feedback">{validation.jobTitle}</div>}
                </CCol>
                <CCol>
                    <CFormInput
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        invalid={!!validation.location}
                    />
                    {validation.location && <div className="invalid-feedback">{validation.location}</div>}
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol>
                    <CFormInput
                        type="text"
                        value={formatCurrency(salary)}
                        onChange={handleSalaryChange}
                        placeholder="Salary"
                        invalid={!!validation.salary}
                    />
                    {validation.salary && <div className="invalid-feedback">{validation.salary}</div>}
                </CCol>
                <CCol>
                    <CFormInput
                        type="number"
                        value={openPositions}
                        onChange={(e) => setOpenPositions(e.target.value)}
                        placeholder="Open Positions"
                        invalid={!!validation.openPositions}
                    />
                    {validation.openPositions && <div className="invalid-feedback">{validation.openPositions}</div>}
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol>
                    <ReactQuill
                        value={jobDescription}
                        onChange={setJobDescription}
                        placeholder="Job Description"
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol>
                    <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                        Back
                    </CButton>
                    <CButton type="submit" color="primary">
                        {mode === 'add' ? 'Add Job' : 'Update Job'}
                    </CButton>
                </CCol>
            </CRow>
        </CForm>
    );
};

const AddJobPage = () => {
    return <JobForm mode="add" />;
};

const EditJobPage = () => {
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

    return jobData ? <JobForm mode="edit" jobData={jobData} /> : <div>Loading...</div>;
};

export { AddJobPage, EditJobPage };
