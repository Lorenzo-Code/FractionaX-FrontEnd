const EnrichedPropertyCard = ({ property, compact = false, onClick }) => {
    const {
        zillowImage,
        image,
        carouselPhotos,
        address,
        beds,
        baths,
        sqft,
        price,
        aiScore,
        dataQuality,
        location,
        zillowEnrichment
    } = property;

    // Enhanced image handling with Zillow enrichment support
    const zillowImages = zillowEnrichment?.images || [];
    const hasZillowImages = zillowImages.length > 0;
    const hasMultiplePhotos = (carouselPhotos && carouselPhotos.length > 1) || zillowImages.length > 1;
    
    // Prioritize Zillow enrichment images, then fallback to existing images
    const imgSrc = zillowEnrichment?.primaryImage || 
                   carouselPhotos?.[0] || 
                   zillowImage || 
                   image || 
                   "https://via.placeholder.com/400x300?text=No+Image";
    
    // Get all available images for carousel
    const allImages = hasZillowImages ? 
      zillowImages.map(img => img.imgSrc || img) : 
      (carouselPhotos || [zillowImage, image].filter(Boolean));

    // Improved address handling with fallbacks
    const fullAddress = address?.oneLine || property.fulladdress1 || property.address || "Address unavailable";
    
    // Data quality indicator
    const getQualityColor = () => {
        switch(dataQuality) {
            case 'excellent': return 'bg-green-500';
            case 'good': return 'bg-blue-500';
            case 'partial': return 'bg-yellow-500';
            case 'poor': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    const getQualityText = () => {
        switch(dataQuality) {
            case 'excellent': return 'Complete Data';
            case 'good': return 'Good Data';
            case 'partial': return 'Partial Data';
            case 'poor': return 'Limited Data';
            default: return 'Unknown';
        }
    };

    // Use backend-provided property source or determine from available data
    const getPropertySource = () => {
        // Use backend-provided source if available
        if (property.propertySource) {
            const source = property.propertySource;
            return {
                name: source.name,
                url: source.url,
                logo: source.type === 'zillow' ? '🏠' : source.type === 'mls' ? '🏘️' : source.harEligible ? '🏡' : '📋',
                color: source.type === 'zillow' ? 'bg-blue-600' : source.type === 'mls' ? 'bg-red-600' : source.harEligible ? 'bg-red-500' : 'bg-gray-600'
            };
        }
        
        // Fallback logic if no backend source provided
        if (property.zillowImage || property.zpid) {
            return {
                name: 'Zillow',
                url: property.zpid ? `https://www.zillow.com/homedetails/${property.zpid}_zpid/` : 'https://www.zillow.com',
                logo: '🏠',
                color: 'bg-blue-600'
            };
        }
        
        if (property.mlsId || property.mls || property.listingId) {
            return {
                name: 'MLS',
                url: 'https://www.har.com',
                logo: '🏘️',
                color: 'bg-red-600'
            };
        }
        
        if (property.harId || (address && (address.state === 'TX' || fullAddress.includes('TX')))) {
            return {
                name: 'HAR.com',
                url: 'https://www.har.com',
                logo: '🏡',
                color: 'bg-red-500'
            };
        }
        
        return {
            name: 'Property Listing',
            url: '#',
            logo: '📋',
            color: 'bg-gray-600'
        };
    };

    const propertySource = getPropertySource();

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
        >
            <div className="relative">
                <img
                    src={imgSrc}
                    alt={`Image of ${fullAddress}`}
                    className="w-full h-40 object-cover"
                />
                {/* Property Source & Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {/* Property Source Badge */}
                    <span className={`${propertySource.color} text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center`}
                          title={`Listed on ${propertySource.name}`}>
                        <span className="mr-1">{propertySource.logo}</span>
                        {propertySource.name}
                    </span>
                    
                    {/* Data Quality Indicator */}
                    <span className={`${getQualityColor()} text-white text-xs font-semibold px-2 py-1 rounded-full opacity-90`}
                          title={`Data Quality: ${getQualityText()}`}>
                        {dataQuality === 'excellent' && '✓'}
                        {dataQuality === 'good' && '✓'}
                        {dataQuality === 'partial' && '~'}
                        {dataQuality === 'poor' && '!'}
                        {!dataQuality && '?'}
                    </span>
                </div>
                {/* AI Match Score */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {typeof aiScore === "number" ? `${aiScore}% Match` : "AI Match"}
                  </span>
                </div>
                {/* Photo count indicator with Zillow enrichment */}
                {hasMultiplePhotos && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      {allImages.length || carouselPhotos?.length || zillowImages.length}
                    </div>
                    {/* Zillow enrichment badge */}
                    {hasZillowImages && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1" title="Enhanced with Zillow images">
                        🏠 Zillow
                      </div>
                    )}
                  </div>
                )}
            </div>
            
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {fullAddress}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 space-x-3">
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            {beds || 'N/A'} bd
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            {baths || 'N/A'} ba
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm2 1v10h6V3H7z" clipRule="evenodd" />
                            </svg>
                            {sqft ? sqft.toLocaleString() : 'N/A'} sq ft
                        </span>
                        {/* Location indicator if coordinates are available */}
                        {location?.latitude && location?.longitude && (
                            <span className="flex items-center text-green-600" title="Location verified">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Located
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Property Research Info */}
                <div className="flex justify-between items-center text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                    <div className="text-center">
                        <div className="font-semibold text-blue-600">{propertySource.name}</div>
                        <div>Source</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-green-600">{property.zpid || property.mlsId || property.listingId || 'N/A'}</div>
                        <div>Listing ID</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-purple-600">{getQualityText()}</div>
                        <div>Data Quality</div>
                    </div>
                </div>
                
                {/* Property Research Info - Hidden on mobile, shown on larger screens */}
                <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 hidden sm:block">
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs font-semibold text-blue-800">Property Research</span>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Found on {propertySource.name}. This property matches your search criteria. Click "View on {propertySource.name}" to see full details and contact information.
                    </p>
                </div>
                
                {/* Zillow Enrichment Info */}
                {hasZillowImages && (
                  <div className="mb-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-semibold text-blue-800">🏠 Zillow Enhanced</span>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Enhanced with {zillowEnrichment.imageCount} high-quality images from Zillow. 
                      {zillowEnrichment.zpid && `ZPID: ${zillowEnrichment.zpid}`}
                    </p>
                  </div>
                )}
                
                {/* Additional Property Info */}
                {property.yearBuilt && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Year Built</span>
                            <span>{property.yearBuilt}</span>
                        </div>
                    </div>
                )}
                {property.lotSize && (
                    <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Lot Size</span>
                            <span>{property.lotSize} sq ft</span>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-gray-900">
                        {price != null && !isNaN(price) ? `$${price.toLocaleString()}` : "Price TBD"}
                    </div>
                    <a 
                        href={propertySource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View on {propertySource.name}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
                {/* Debug info for development - remove in production */}
                {process.env.NODE_ENV === 'development' && dataQuality && (
                    <div className="text-xs text-gray-400 mt-1">
                        Quality: {getQualityText()} | ID: {property.zpid || property.mlsId || property.id || 'N/A'}
                    </div>
                )}
            </div>
        </div>
    );
};



export default EnrichedPropertyCard;
