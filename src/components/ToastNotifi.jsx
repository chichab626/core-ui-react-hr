import React, { useEffect, useRef } from 'react'
import { CToast, CToastBody, CToaster, CToastHeader , CButton} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle, cilWarning, cilInfo, cilBan } from '@coreui/icons'

const ToastNotification = ({ toastData }) => {
  const toaster = useRef()

  const generateIcon = (type) => {
    switch (type) {
      case 'success':
        return <CIcon icon={cilCheckCircle} size="lg" className="me-2 text-success" />
      case 'warning':
        return <CIcon icon={cilWarning} size="lg" className="me-2 text-warning" />
      case 'info':
        return <CIcon icon={cilInfo} size="lg" className="me-2 text-info" />
      case 'error':
        return <CIcon icon={cilBan} size="lg" className="me-2 text-danger" />
      default:
        return null
    }
  }

  const createToast = (type, message, title) => (
    <CToast autohide={true}>
      <CToastHeader closeButton>
        {generateIcon(type)}
        <div className="fw-bold me-auto">{title}</div>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  )

  useEffect(() => {
    if (toastData) {
      const { type, message, title } = toastData
      toaster.current && toaster.current.push(createToast(type, message, title))
      console.log('it propd')
    }
  }, [toastData])

  return (
    <>
      <CToaster ref={toaster} placement="top-end" />
      <CButton color="primary" onClick={() => createToast('warning', 'warning', 'warning')}>
          Send a toast inside
        </CButton>
    </>
  )
}

export default ToastNotification
