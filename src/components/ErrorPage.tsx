import React from 'react'

const ErrorFound = ({
  resetErrorBoundary,
  error,
}: {
  resetErrorBoundary: () => void
  error: Error
}) => {
  console.log(error)
  return (
    <div>
      <div>
        <span>Oops! There was an error!</span> <span>:(</span>
      </div>
      <div onClick={resetErrorBoundary} data-testid='error-btn'>
        Try again
      </div>
    </div>
  )
}

export default ErrorFound
