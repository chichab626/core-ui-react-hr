import React, { useState } from 'react'
import { CFormInput } from '@coreui/react'

const SalaryInput = ({ value, onChange, readOnly, validationError }) => {
  // Formatting the currency input
  const formatCurrency = (value) => {
    const numericValue = String(value).replace(/[^0-9]/g, '')
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue / 100)
  }

  const [formattedValue, setFormattedValue] = useState(formatCurrency(value))


  // Handle changes to the input value
  const handleChange = (e) => {
    const rawValue = e.target.value
    const formatted = formatCurrency(rawValue)
    setFormattedValue(formatted) // Update formatted display
    console.log(formatted)
    const sanitizedValue = sanitizeSalary(formatted) // Clean value to send to parent
    onChange(sanitizedValue) // Call parent’s onChange handler with the raw value
  }

  // Sanitize the input value for currency formatting
  function sanitizeSalary(salary) {
    if (!salary) return ''
    let result = String(salary).replace(/[^0-9.,]/g, '').replace(/,/g, '')
    const parts = result.split('.')
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : parts.join('.')
  }

  return (
    <div>
      <CFormInput
        type="text"
        value={formattedValue}
        onChange={handleChange}
        placeholder="Salary"
        invalid={!!validationError}
        readOnly={readOnly}
      />
      {validationError && <div className="invalid-feedback">{validationError}</div>}
    </div>
  )
}

export default SalaryInput
