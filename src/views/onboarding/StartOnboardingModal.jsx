import React, { useState } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput
} from '@coreui/react';

const StartOnboardingModal = ({ visible, onClose, onConfirm }) => {
    const [startDate, setStartDate] = useState('');

    const handleConfirm = () => {
        onConfirm(startDate);
        setStartDate('');
        onClose();
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>Select Start Date</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={handleConfirm}>
                    Confirm
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default StartOnboardingModal;
