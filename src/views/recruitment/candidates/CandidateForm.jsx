import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCol, CRow, CBadge} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { CTooltip } from '@coreui/react';

const CandidateForm = ({ mode, candidateData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [profileSummary, setProfileSummary] = useState('');
    const [experiences, setExperiences] = useState([{ position: '', company: '', startDate: null, endDate: null, description: '' }]);
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (mode === 'edit' && candidateData) {
            setName(candidateData.name);
            setEmail(candidateData.email);
            setCity(candidateData.city);
            setProfileSummary(candidateData.profileSummary);
            setExperiences(candidateData.experiences || [{ position: '', company: '', startDate: null, endDate: null, description: '' }]);
        }
    }, [mode, candidateData]);

    const handleExperienceChange = (index, field, value) => {
        const updatedExperiences = experiences.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        setExperiences(updatedExperiences);
    };

    const addExperience = () => {
        setExperiences([...experiences, { position: '', company: '', startDate: null, endDate: null, description: '' }]);
    };

    const removeExperience = (index) => {
        const updatedExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(updatedExperiences);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const candidate = { name, email, city, profileSummary, experiences };

        const newValidation = {};
        if (!name) newValidation.name = 'Name is required';
        if (!email) newValidation.email = 'Email is required';
        if (!city) newValidation.city = 'City is required';

        setValidation(newValidation);

        if (Object.keys(newValidation).length === 0) {
            if (mode === 'add') {
                // Call API to add candidate
            } else {
                // Call API to update candidate
            }
            navigate('/candidates'); // Redirect after submit
        }
    };

    return (
        <CForm onSubmit={handleSubmit}>
            <h2>{mode === 'add' ? 'Add Candidate' : 'Edit Candidate'}</h2>

            <CRow className="mb-3">
                <CCol>
                    <CFormInput
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        invalid={!!validation.name}
                    />
                    {validation.name && <div className="invalid-feedback">{validation.name}</div>}
                </CCol>
                <CCol>
                    <CFormInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        invalid={!!validation.email}
                    />
                    {validation.email && <div className="invalid-feedback">{validation.email}</div>}
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol>
                    <CFormInput
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        invalid={!!validation.city}
                    />
                    {validation.city && <div className="invalid-feedback">{validation.city}</div>}
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol>
                <h4>Profile Summary</h4>
                    <ReactQuill
                        value={profileSummary}
                        onChange={setProfileSummary}
                        placeholder="Profile Summary"
                    />
                </CCol>
            </CRow>

            <h4>Experience </h4> <h6><CBadge color="warning" shape="rounded-pill">Latest on Top</CBadge></h6>
            
            {experiences.map((experience, index) => (
                <div key={index} className="mb-4">
                    <CRow className="mb-3">
                        <CCol>
                            <CFormInput
                                type="text"
                                value={experience.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                placeholder="Position Title"
                            />
                        </CCol>
                        <CCol>
                            <CFormInput
                                type="text"
                                value={experience.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                placeholder="Company"
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol>
                            <label>Start Date</label>
                            <CFormInput
                            type="date"
                            value={experience.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                            placeholder="Start Date"
                        />
                        </CCol>
                        <CCol>
                            <label>End Date</label>
                            <CFormInput
                            type="date"
                            value={experience.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            placeholder="End Date"
                        />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol>
                            <ReactQuill
                                value={experience.description}
                                onChange={(value) => handleExperienceChange(index, 'description', value)}
                                placeholder="Description"
                            />
                        </CCol>
                    </CRow>
                    {experiences.length > 1 && (
    <CTooltip content="Remove Experience">
        <CButton color="danger" onClick={() => removeExperience(index)} className="mb-3">
            <CIcon icon={cilTrash} />
        </CButton>
    </CTooltip>
)}
                </div>
            ))}

            <CButton color="success" onClick={addExperience} className="mb-3">
                Add Another Experience
            </CButton>

            <CRow>
                <CCol>
                    <CButton color="danger" onClick={() => navigate(-1)} className="me-2">
                        Back
                    </CButton>
                    <CButton type="submit" color="primary">
                        {mode === 'add' ? 'Add Candidate' : 'Update Candidate'}
                    </CButton>
                </CCol>
            </CRow>
        </CForm>
    );
};

const AddCandidatePage = () => {
    return <CandidateForm mode="add" />;
};

const EditCandidatePage = () => {
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            // Mock data for testing
            const data = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                city: 'New York',
                profileSummary: 'Experienced software engineer...',
                experiences: [
                    { position: 'Software Engineer', company: 'Tech Corp', startDate: new Date('2020-01-01'), endDate: new Date('2021-12-31'), description: 'Developed web applications...' }
                ]
            };
            setCandidateData(data);
        };
        fetchCandidate();
    }, [id]);

    return candidateData ? <CandidateForm mode="edit" candidateData={candidateData} /> : <div>Loading...</div>;
};

export { AddCandidatePage, EditCandidatePage };
