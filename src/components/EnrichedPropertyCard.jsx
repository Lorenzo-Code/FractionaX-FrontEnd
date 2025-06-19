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
            className="cursor-pointer bg-white/90 rounded-xl border border-gray-200 shadow-sm p-3 mb-3 hover:shadow-md transition duration-200"
        >
            <img
                src={imgSrc}
                alt={`Image of ${fullAddress}`}
                className="w-full h-24 object-cover rounded mb-2"
            />
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-semibold text-sm">{fullAddress}</h2>
                    <p className="text-xs text-gray-600">
                        🛏 {beds} | 🛁 {baths} | 📐 {sqft} sqft
                    </p>
                </div>
                {typeof aiScore === "number" && (
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                        AI Score: {aiScore}
                    </span>
                )}

            </div>
            <p className="text-sm font-medium text-green-700 mt-1">
                {price != null ? `$${price.toLocaleString()}` : "Price TBD"}
            </p>
        </div>
    );
};



export default EnrichedPropertyCard;
