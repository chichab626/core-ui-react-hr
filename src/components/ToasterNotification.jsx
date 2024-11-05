import React, { useState, useRef, useEffect } from 'react'
import { CToast, CToastBody, CToaster, CToastHeader, CButton } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle, cilWarning, cilInfo, cilBan } from '@coreui/icons' // Import error icon

const ToastNotification = ({deets}) => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const generateIcon = (type) => {
    switch (type) {
      case 'success':
        return <CIcon icon={cilCheckCircle} size="lg" className="me-2 text-success" />
      case 'warning':
        return <CIcon icon={cilWarning} size="lg" className="me-2 text-warning" />
      case 'info':
        return <CIcon icon={cilInfo} size="lg" className="me-2 text-info" />
      case 'danger':
        return <CIcon icon={cilBan} size="lg" className="me-2 text-danger" /> // Error icon and color
      default:
        return null
    }
  }

  const createToast = ({type, message, title}) => (
    <CToast color={type}>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          {generateIcon(type)}
        </svg>
        <div className="fw-bold me-auto">{title}</div>
        
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  )

  useEffect(() => {
    if (deets && Object.keys(deets).length > 0) {
        console.log('trigger toast')
        addToast(createToast(deets))
    }
  }, [deets]);

  return (
    <>
      <div className="mb-4">
        {/* <CButton color="primary" onClick={() => addToast(createToast(sample))}>
          Send a toast
        </CButton> */}
        <CToaster className="p-3" placement="bottom-end" push={toast} ref={toaster} />
      </div>

    </>
  )
}

export default ToastNotification

