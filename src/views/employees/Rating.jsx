import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CListGroup,
  CListGroupItem,
  CAlert,
  CSpinner,
} from '@coreui/react'
import apiService from '../../service/apiService'

const Rating = ({ employeeId, mode }) => {
  const [ratings, setRatings] = useState([])
  const [newRating, setNewRating] = useState({
    score: 0,
    reviewerId: localStorage.getItem('email'),
    comments: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const fetchRatings = async () => {
    try {
      const response = await apiService.get(`employee/ratings/${employeeId}`)
      setRatings(response)
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setStatus({
        type: 'danger',
        message: 'Unable to fetch ratings. Please try again later.',
      })
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [employeeId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewRating((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStarHover = (rating) => {
    setHoveredRating(rating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleStarClick = (ratingValue) => {
    setNewRating((prev) => ({
      ...prev,
      score: ratingValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newRating.score) {
      setStatus({
        type: 'danger',
        message: 'Please select a rating score',
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Send the new rating to the server
      const response = await apiService.post('/employee/ratings', {
        ...newRating,
        employeeId,
      })

      // Update the ratings list with the new rating from the response
      setRatings(response)

      // Reset the form
      setNewRating({
        score: 0,
        reviewerId: localStorage.getItem('email'),
        comments: '',
      })

      setStatus({
        type: 'success',
        message: 'Rating submitted successfully!',
      })
    } catch (error) {
      console.error('Error submitting rating:', error)
      setStatus({
        type: 'danger',
        message: 'Failed to submit rating. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      let newRatings = []
      if (ratings.length > 1) {
        newRatings = ratings.splice(id, 1)
      }

      await apiService.put(`/employee/ratings/${employeeId}`, { ratings: newRatings })
      setRatings(newRatings)
      setStatus({
        type: 'success',
        message: 'Rating deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting rating:', error)
      setStatus({
        type: 'danger',
        message: 'Failed to delete rating',
      })
    }
  }

  return (
    <div className="rating-component">
      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Existing Ratings</h5>
        </CCardHeader>
        <CCardBody>
          {ratings.length > 0 ? (
            <CListGroup>
              {ratings.map((rating, index) => (
                <CListGroupItem
                  key={index}
                  className="d-flex justify-content-between align-items-start p-3"
                >
                  <div>
                    <div className="mb-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          style={{
                            color: index < rating.score ? '#ffc107' : '#e4e5e9',
                            marginRight: '4px',
                          }}
                          size={20}
                        />
                      ))}
                    </div>
                    <div className="text-medium-emphasis">
                      <strong>Reviewer:</strong> {rating.reviewerId}
                    </div>
                    {rating.comments && (
                      <div className="mt-2">
                        <strong>Comments:</strong>
                        <p className="mb-0 mt-1">{rating.comments}</p>
                      </div>
                    )}
                  </div>
                  {localStorage.getItem('role') === 'Manager' && (
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(index)}
                      className="ms-3"
                    >
                      Delete
                    </CButton>
                  )}
                </CListGroupItem>
              ))}
            </CListGroup>
          ) : (
            <p className="text-medium-emphasis text-center py-3">No ratings available.</p>
          )}
        </CCardBody>
      </CCard>
      {mode === 'edit' && localStorage.getItem('role') === 'Manager' && (
        <CCard className="my-4">
          <CCardHeader>
            <h5>Add Rating</h5>
          </CCardHeader>

          <CCardBody>
            {status.message && (
              <CAlert color={status.type} variant="solid" dismissible>
                {status.message}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div className="star-rating d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((ratingValue) => (
                    <FaStar
                      key={ratingValue}
                      className="star me-1"
                      onMouseEnter={() => handleStarHover(ratingValue)}
                      onMouseLeave={handleStarLeave}
                      onClick={() => handleStarClick(ratingValue)}
                      style={{
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        color:
                          ratingValue <= (hoveredRating || newRating.score) ? '#ffc107' : '#e4e5e9',
                      }}
                      size={30}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <CFormTextarea
                  id="comments"
                  name="comments"
                  label="Comments"
                  value={newRating.comments}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <CButton
                color="primary"
                type="submit"
                disabled={isSubmitting}
                className="d-flex align-items-center"
              >
                {isSubmitting && <CSpinner size="sm" className="me-2" />}
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default Rating
