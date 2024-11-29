import React from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate from react-router-dom
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate() // Get the navigate function

  const storedUser = localStorage.getItem('user');
  // Parse the string back into an object
  const user = storedUser ? JSON.parse(storedUser) : null;


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={true}>
        {/* If user exists, display user's avatar and email. Otherwise, show a Login link */}
        {user?.email ? (
          <>
            Welcome, {user.email} {/* Display the user's email */}
          </>
        ) : (
          'Login' // If no user, show Login link
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* If user exists, show account settings and options */}
        {user?.email ? (
          <>
            <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
            <CDropdownItem href="#">
              <CIcon icon={cilEnvelopeOpen} className="me-2" />
              Messages
              <CBadge color="success" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
            <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
            <CDropdownItem href="#">
              <CIcon icon={cilUser} className="me-2" />
              Profile
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilSettings} className="me-2" />
              Settings
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem onClick={() => { 
              // Handle logout, for example by clearing the user from localStorage

              localStorage.removeItem('authToken'); // Store JWT token
              localStorage.removeItem('role'); // Store user role
              localStorage.removeItem('email')
              localStorage.removeItem('employeeId')
              localStorage.removeItem('user')
              localStorage.removeItem('profile')
              //reload window
              navigate('/dashboard')
              window.location.reload();
            }}>
              <CIcon icon={cilLockLocked} className="me-2" />
              Logout
            </CDropdownItem>
          </>
        ) : (
          // If no user is logged in, show Login option and navigate using useNavigate
          <CDropdownItem onClick={() => navigate('/login')}>
            <CIcon icon={cilUser} className="me-2" />
            Login
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
