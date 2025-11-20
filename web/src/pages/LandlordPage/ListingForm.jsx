// src/pages/LandlordPage/ListingForm.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { ArrowLeftIcon, CloudIcon, CloseIcon } from '../../components/Shared/Icons';
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
    amenities: [], image: '', imageList: [],
    minStay: '', maxOccupancy: '', depositAmount: '', utilitiesIncluded: true,
    latitude: '', longitude: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]); // preview urls
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);

  // Load listing when editing
  useEffect(() => {
    if (!isEditing || !listingId) return;
    setLoading(true);

    API.get(`/student/listings/${listingId}`)
      .then(res => {
        const l = res.data;
        const imgs = l.imageList
          ? (typeof l.imageList === 'string' ? l.imageList.split(',') : l.imageList)
          : [];

        setFormData({
          title: l.title || '',
          description: l.description || '',
          location: l.location || '',
          price: l.price || '',
          roomType: l.roomType || 'single',
          availableFrom: l.availableFrom || '',
          amenities: typeof l.amenities === 'string'
            ? (l.amenities ? l.amenities.split(',').map(s => s.trim()) : [])
            : (l.amenities || []),
          image: l.image || imgs[0] || '',
          imageList: imgs,
          minStay: l.minStay || '',
          maxOccupancy: l.maxOccupancy || '',
          depositAmount: l.depositAmount || '',
          utilitiesIncluded: l.utilitiesIncluded || true,
          latitude: l.latitude || '',
          longitude: l.longitude || ''
        });

        setUploadedImages(imgs.slice(0, 10));
      })
      .catch(err => {
        console.error('Failed to load listing for edit', err);
        toast.error('Failed to load listing for edit');
      })
      .finally(() => setLoading(false));
  }, [isEditing, listingId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenitiesChange = (value) => {
    setFormData(prev => ({ ...prev, amenities: value }));
  };

  // ⭐ FIXED — sets main image + previews
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));

    const updated = [...uploadedImages, ...newImageUrls].slice(0, 10);
    setUploadedImages(updated);

    // ⭐ MAIN FIX — ensure image is set so validation passes
    if (updated.length > 0) {
      setFormData(prev => ({
        ...prev,
        image: updated[0],
        imageList: updated
      }));
    }

    toast.success(`${files.length} image(s) selected for preview.`);
  };

  const removeImage = (indexToRemove) => {
    try { URL.revokeObjectURL(uploadedImages[indexToRemove]); } catch {}
    const updated = uploadedImages.filter((_, index) => index !== indexToRemove);

    setUploadedImages(updated);
    setFormData(prev => ({
      ...prev,
      image: updated[0] || '',
      imageList: updated
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 5)
      errors.title = 'Property title must be at least 5 characters';

    if (!formData.location || formData.location.trim().length < 3)
      errors.location = 'Location must be at least 3 characters';

    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.price = 'Monthly rent must be greater than 0';

    if (formData.description && formData.description.length > 1000)
      errors.description = 'Description must not exceed 1000 characters';

    // ⭐ FIX: Only require 1 image (from formData.image)
    if (!formData.image)
      errors.images = 'Please upload at least one image';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toPayload = () => ({
    title: formData.title,
    description: formData.description,
    location: formData.location,
    nearbySchools: formData.nearbySchools || '',
    distance: formData.distance || '',
    roomType: formData.roomType,
    rating: formData.rating || 0,
    reviews: formData.reviews || 0,
    price: parseFloat(formData.price),
    available: true,
    amenities: formData.amenities,
    website: formData.website || '',
    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    image: formData.image,
    imageList: uploadedImages
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    const payload = toPayload();

    // ⭐ UPDATED — no more landlordId in URL, backend reads JWT
    if (isEditing) {
      API.put(`/landlord/listing/${listingId}`, payload)
        .then(() => {
          toast.success('Listing updated successfully!');
          onBack();
        })
        .catch(err => {
          console.error('Update failed', err);
          toast.error('Update failed');
        });
    } else {
      API.post(`/landlord/listing`, payload)
        .then(() => {
          toast.success('Listing created successfully!');
          onBack();
        })
        .catch(err => {
          console.error('Create failed', err);
          toast.error('Create failed');
        });
    }
  };

  if (loading) {
    return (
      <div className="listing-form-page page-container">
        <div className="container listing-form-main-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-form-page page-container">
      <div className="listing-form-header-bar">
        <div className="container listing-form-header-content">
          <button className="button button-link back-button" onClick={onBack}>
            <span className="icon"><ArrowLeftIcon size={16} /></span> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container listing-form-main-content">
        <div className="listing-form-title-section">
          <h1>{isEditing ? 'Edit Listing' : 'Create New Listing'}</h1>
          <p className="text-muted">{isEditing ? 'Update your property information' : 'Add a new property to your listings'}</p>
        </div>

        <form onSubmit={handleSubmit} className="listing-form">
          {Object.keys(validationErrors).length > 0 && (
            <div className="alert alert-error">
              <strong>Please fix the following errors:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                {Object.values(validationErrors).map((error, idx) => (<li key={idx}>{error}</li>))}
              </ul>
            </div>
          )}

          {/* ------- Rest of your form unchanged ------- */}
          {/* EVERYTHING BELOW REMAINS EXACTLY AS YOUR ORIGINAL FILE */}
          {/* -------- Only image upload / validate was patched -------- */}

          <div className="card form-card">
            <div className="card-header"><h3>Basic Information</h3><p className="text-muted small-text">Essential details</p></div>
            <div className="card-content form-card-content">
              <div className="form-group">
                <label htmlFor="title">Property Title *</label>
                <input id="title" placeholder="e.g., Cozy Student Room Near Campus"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required className={`input ${validationErrors.title ? 'input-error' : ''}`} />
                {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" placeholder="Describe your property..." rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="textarea" />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input id="location"
                    placeholder="e.g., Downtown University District"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required className="input" />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Monthly Rent (₱) *</label>
                  <input id="price" type="number"
                    placeholder="350"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required className="input" />
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="card form-card">
            <div className="card-header"><h3>Room Details</h3><p className="text-muted small-text">Specifics about the room</p></div>
            <div className="card-content form-card-content">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="roomType">Room Type</label>
                  <select id="roomType" value={formData.roomType}
                    onChange={(e) => handleInputChange('roomType', e.target.value)}
                    className="select">
                    <option value="single">Single Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="availableFrom">Available From</label>
                  <input id="availableFrom" type="date"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                    className="input" />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="maxOccupancy">Max Occupancy</label>
                  <input id="maxOccupancy" type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => handleInputChange('maxOccupancy', e.target.value)}
                    className="input" />
                </div>

                <div className="form-group">
                  <label htmlFor="minStay">Min Stay (months)</label>
                  <input id="minStay" type="number"
                    value={formData.minStay}
                    onChange={(e) => handleInputChange('minStay', e.target.value)}
                    className="input" />
                </div>

                <div className="form-group">
                  <label htmlFor="depositAmount">Security Deposit (₱)</label>
                  <input id="depositAmount" type="number"
                    value={formData.depositAmount}
                    onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                    className="input" />
                </div>
              </div>

              <div className="form-checkbox-item">
                <input type="checkbox" id="utilitiesIncluded"
                  checked={formData.utilitiesIncluded}
                  onChange={(e) => handleInputChange('utilitiesIncluded', e.target.checked)} />
                <label htmlFor="utilitiesIncluded">Utilities included in rent</label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card form-card">
            <div className="card-header"><h3>Amenities</h3><p className="text-muted small-text">Select all available</p></div>
            <div className="card-content">
              <div className="amenities-grid">
                {['WiFi', 'Air Conditioning', 'Laundry', 'Parking', 'Kitchen', 'Gym']
                  .map((amenity) => (
                    <div key={amenity} className="form-checkbox-item">
                      <input type="checkbox" id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.amenities, amenity]
                            : formData.amenities.filter(a => a !== amenity);
                          handleAmenitiesChange(updated);
                        }} />
                      <label htmlFor={amenity}>{amenity}</label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="card form-card">
            <div className="card-header">
              <h3>Photos</h3>
              <p className="text-muted small-text">Upload photos (max 10) — previews only</p>
            </div>
            <div className="card-content">
              <div className="photo-upload-area">
                <span className="icon upload-icon"><CloudIcon size={48} /></span>
                <p>Drag and drop photos here or click to browse</p>
                <input type="file" id="imageUpload" multiple accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }} />
                <label htmlFor="imageUpload" className="button button-secondary">Select Photos</label>
              </div>

              {uploadedImages.length > 0 && (
                <div className="image-preview-grid">
                  {uploadedImages.map((imgUrl, idx) => (
                    <div key={idx} className="image-preview-item">
                      <img src={imgUrl} alt={`Upload preview ${idx + 1}`} />
                      <button type="button" className="remove-image-button"
                        onClick={() => removeImage(idx)}>
                        <CloseIcon size={16} />
                      </button>
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
