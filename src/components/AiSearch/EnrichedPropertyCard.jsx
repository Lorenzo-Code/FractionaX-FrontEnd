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
    } = property;

    const imgSrc =
        zillowImage || image || carouselPhotos?.[0] || "https://via.placeholder.com/400x300?text=No+Image";

    const fullAddress = address?.oneLine || "Unknown Address";

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
                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Available
                    </span>
                    <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Fractional
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
                            {beds} bd
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            {baths} ba
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm2 1v10h6V3H7z" clipRule="evenodd" />
                            </svg>
                            {sqft?.toLocaleString()} sq ft
                        </span>
                    </div>
                </div>
                
                {/* Investment Metrics */}
                <div className="flex justify-between items-center text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                    <div className="text-center">
                        <div className="font-semibold text-green-600">8.2%</div>
                        <div>Yield</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-blue-600">$500</div>
                        <div>Min. Investment</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-purple-600">12.4%</div>
                        <div>Annual ROI</div>
                    </div>
                </div>
                
                {/* AI Match Explanation - Hidden on mobile, shown on larger screens */}
                <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 hidden sm:block">
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs font-semibold text-blue-800">Why AI Recommends This</span>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Matches your criteria for affordable family homes with strong price-to-value ratio and neighborhood growth potential.
                    </p>
                </div>
                
                {/* Funding Progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Funding Progress</span>
                        <span>72% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-gray-900">
                        {price != null ? `$${price.toLocaleString()}` : "Price TBD"}
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        Invest Now →
                    </button>
                </div>
            </div>
        </div>
    );
};



export default EnrichedPropertyCard;
