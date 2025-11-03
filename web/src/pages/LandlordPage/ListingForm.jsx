import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/ListingForm.css';

const toast = {
  success: (message) => alert(`Success: ${message}`),
  error: (message) => alert(`Error: ${message}`),
};

export function ListingForm({ listingId, onBack }) {
  const isEditing = !!listingId;

  const [formData, setFormData] = useState({
    title: '', description: '', location: '', price: '',
    roomType: 'single', availableFrom: '',
    wifi: true, ac: false, laundry: false, parking: false, kitchen: false, gym: false,
    minStay: '', maxOccupancy: '', depositAmount: '', utilitiesIncluded: true,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // TODO: Fetch listing data if isEditing

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
     handleInputChange(field, checked);
  };

  const handleImageUpload = (event) => {
     const files = Array.from(event.target.files);
     const newImageUrls = files.map(file => URL.createObjectURL(file));
     setUploadedImages(prev => [...prev, ...newImageUrls].slice(0, 10));
     toast.success(`${files.length} image(s) selected for preview.`);
  };

   const removeImage = (indexToRemove) => {
     URL.revokeObjectURL(uploadedImages[indexToRemove]);
     setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
   };

  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Property title must be at least 5 characters';
    }

    if (!formData.location || formData.location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Monthly rent must be greater than 0';
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description must not exceed 1000 characters';
    }

    if (formData.minStay && (isNaN(formData.minStay) || parseInt(formData.minStay) < 1)) {
      errors.minStay = 'Minimum stay must be at least 1 month';
    }

    if (formData.maxOccupancy && (isNaN(formData.maxOccupancy) || parseInt(formData.maxOccupancy) < 1)) {
      errors.maxOccupancy = 'Maximum occupancy must be at least 1';
    }

    if (formData.depositAmount && parseFloat(formData.depositAmount) < 0) {
      errors.depositAmount = 'Deposit amount cannot be negative';
    }

    if (uploadedImages.length === 0) {
      errors.images = 'Please upload at least one image';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    console.log("Form Data Submitted:", formData);
    console.log("Uploaded Images (URLs):", uploadedImages);
    toast.success(isEditing ? 'Listing updated successfully!' : 'Listing created successfully!');
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div className="listing-form-page page-container">
      <div className="listing-form-header-bar">
        <div className="container listing-form-header-content">
          <button className="button button-link back-button" onClick={onBack}>
            <span className="icon">←</span> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container listing-form-main-content">
        <div className="listing-form-title-section">
          <h1>{isEditing ? 'Edit Listing' : 'Create New Listing'}</h1>
          <p className="text-muted">
            {isEditing ? 'Update your property information' : 'Add a new property to your listings'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="listing-form">
          {Object.keys(validationErrors).length > 0 && (
            <div className="alert alert-error">
              <strong>Please fix the following errors:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                {Object.values(validationErrors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="card form-card">
            <div className="card-header"><h3>Basic Information</h3><p className="text-muted small-text">Essential details</p></div>
            <div className="card-content form-card-content">
              <div className="form-group">
                <label htmlFor="title">Property Title *</label>
                <input id="title" placeholder="e.g., Cozy Student Room Near Campus" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required className={`input ${validationErrors.title ? 'input-error' : ''}`}/>
                {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" placeholder="Describe your property..." rows={5} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="textarea"/>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input id="location" placeholder="e.g., Downtown University District" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} required className="input"/>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Monthly Rent ($) *</label>
                  <input id="price" type="number" placeholder="350" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} required className="input"/>
                </div>
              </div>
            </div>
          </div>

           <div className="card form-card">
             <div className="card-header"><h3>Room Details</h3><p className="text-muted small-text">Specifics about the room</p></div>
             <div className="card-content form-card-content">
               <div className="form-grid-2">
                 <div className="form-group">
                   <label htmlFor="roomType">Room Type</label>
                   <select id="roomType" value={formData.roomType} onChange={(e) => handleInputChange('roomType', e.target.value)} className="select">
                     <option value="single">Single Room</option>
                     <option value="shared">Shared Room</option>
                     <option value="studio">Studio</option>
                   </select>
                 </div>
                 <div className="form-group">
                   <label htmlFor="availableFrom">Available From</label>
                   <input id="availableFrom" type="date" value={formData.availableFrom} onChange={(e) => handleInputChange('availableFrom', e.target.value)} className="input"/>
                 </div>
               </div>
                <div className="form-grid-3">
                  <div className="form-group">
                   <label htmlFor="maxOccupancy">Max Occupancy</label>
                   <input id="maxOccupancy" type="number" placeholder="1" value={formData.maxOccupancy} onChange={(e) => handleInputChange('maxOccupancy', e.target.value)} className="input"/>
                 </div>
                 <div className="form-group">
                   <label htmlFor="minStay">Min Stay (months)</label>
                   <input id="minStay" type="number" placeholder="3" value={formData.minStay} onChange={(e) => handleInputChange('minStay', e.target.value)} className="input"/>
                 </div>
                  <div className="form-group">
                   <label htmlFor="depositAmount">Security Deposit ($)</label>
                   <input id="depositAmount" type="number" placeholder="350" value={formData.depositAmount} onChange={(e) => handleInputChange('depositAmount', e.target.value)} className="input"/>
                 </div>
               </div>
                <div className="form-checkbox-item">
                  <input type="checkbox" id="utilitiesIncluded" checked={formData.utilitiesIncluded} onChange={(e) => handleCheckboxChange('utilitiesIncluded', e.target.checked)} />
                  <label htmlFor="utilitiesIncluded">Utilities included in rent</label>
               </div>
             </div>
           </div>

          <div className="card form-card">
             <div className="card-header"><h3>Amenities</h3><p className="text-muted small-text">Select all available</p></div>
             <div className="card-content">
                <div className="amenities-grid">
                  {[
                    { id: 'wifi', label: 'WiFi' }, { id: 'ac', label: 'Air Conditioning' },
                    { id: 'laundry', label: 'Laundry' }, { id: 'parking', label: 'Parking' },
                    { id: 'kitchen', label: 'Kitchen Access' }, { id: 'gym', label: 'Gym/Fitness' },
                  ].map((amenity) => (
                    <div key={amenity.id} className="form-checkbox-item">
                      <input type="checkbox" id={amenity.id} checked={formData[amenity.id]} onChange={(e) => handleCheckboxChange(amenity.id, e.target.checked)} />
                      <label htmlFor={amenity.id}>{amenity.label}</label>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="card form-card">
              <div className="card-header"><h3>Photos</h3><p className="text-muted small-text">Upload photos (max 10)</p></div>
              <div className="card-content">
                 <div className="photo-upload-area">
                    <span className="icon upload-icon">☁️</span>
                    <p>Drag and drop photos here or click to browse</p>
                    <input type="file" id="imageUpload" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <label htmlFor="imageUpload" className="button button-secondary">Select Photos</label>
                 </div>
                 {uploadedImages.length > 0 && (
                   <div className="image-preview-grid">
                     {uploadedImages.map((imgUrl, idx) => (
                       <div key={idx} className="image-preview-item">
                         <img src={imgUrl} alt={`Upload preview ${idx + 1}`} />
                         <button type="button" className="remove-image-button" onClick={() => removeImage(idx)}>✕</button>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
          </div>

          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onBack}>Cancel</button>
            <button type="submit" className="button button-primary">
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}