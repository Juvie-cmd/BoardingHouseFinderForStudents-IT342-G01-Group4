import { ImageWithFallback } from './ImageWithFallback';
import { BedIcon, StarIcon, HeartIcon } from './Icons';

// Make sure the "export" keyword is here
export function ListingCard({
  id,
  title,
  image,
  roomType,
  rating,
  reviews,
  price,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}) {
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    onToggleFavorite(id);
  };

  const handleCardClick = () => {
    if(onViewDetails) onViewDetails(id);
  };
  
  return (
    <div className="card listing-card card-hover" onClick={handleCardClick}>
      <div className="listing-image-wrapper">
        <ImageWithFallback
          src={image}
          alt={title}
          className="listing-image"
        />
        <button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <HeartIcon size={18} color={isFavorite ? '#ef4444' : '#fff'} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="listing-card-content">
        <div className="listing-info-header">
          <h3>{title}</h3>
        </div>

        <div className="listing-amenities">
          <div className="listing-amenity-item">
            <span className="icon"><BedIcon size={16} /></span>
            <span>{roomType}</span>
          </div>
          <div className="listing-amenity-item listing-rating">
            <span className="icon"><StarIcon size={16} fill="#FFD700" color="#FFD700" /></span>
            <span>{rating}</span>
            <span className="text-muted">({reviews})</span>
          </div>
        </div>

        <div className="listing-card-footer">
          <div className="listing-price">
            <span className="price">${price}</span>
            <span className="period">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
}