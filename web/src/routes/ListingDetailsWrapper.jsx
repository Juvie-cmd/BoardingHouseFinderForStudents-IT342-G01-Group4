// src/routes/ListingDetailsWrapper.jsx

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ListingDetails } from '../pages/StudentPage/ListingDetails'; 

export function ListingDetailsWrapper() {
  const { listingId } = useParams(); 
  const navigate = useNavigate(); 

  const idAsNumber = parseInt(listingId, 10);
  if (isNaN(idAsNumber)) {
     console.error("Invalid listing ID in URL:", listingId);
     return <Navigate to="/search" replace />;
  }

  return <ListingDetails listingId={idAsNumber} onBack={() => navigate('/search')} />;
}