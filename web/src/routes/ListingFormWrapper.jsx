import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
// 👇 Corrected Import Name 👇
import { ListingForm } from '../pages/LandlordPage/ListingForm';

export function ListingFormWrapper() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const idAsNumber = listingId ? parseInt(listingId, 10) : undefined;

  if (listingId && isNaN(idAsNumber)) {
     console.error("Invalid listing ID for editing:", listingId);
     return <Navigate to="/landlord/dashboard" replace />;
  }

  // 👇 Corrected Component Name 👇
  return <ListingForm listingId={idAsNumber} onBack={() => navigate(-1)} />;
}