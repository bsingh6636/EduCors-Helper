import React from 'react'
import './ProfileShimmer.css'
const ProfileShimmer = () => {
  return (
    <div className="shimmer-container">
      <div className="shimmer-header"></div>
      <div className="shimmer-content">
        <div className="shimmer-detail"></div>
        <div className="shimmer-detail"></div>
        <div className="shimmer-detail"></div>
        <div className="shimmer-detail"></div>
      </div>
      <div className="shimmer-footer"></div>
    </div>
  )
}

export default ProfileShimmer

