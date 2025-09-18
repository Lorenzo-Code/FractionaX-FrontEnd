import React from "react";
import { SEO } from "../../../../shared/components";
import MapFocusedAISearch from "./MapFocusedAISearch";

const AiSearchPage = () => {
  return (
    <>
      <SEO
        title="Address Search - Property Location Finder | FractionaX"
        description="Search properties by address and location. View detailed property information on an interactive map with comprehensive market data."
        keywords={['address search', 'property location', 'real estate map', 'property finder', 'location search', 'property analysis']}
        canonical="/admin/ai-search"
      />
      <MapFocusedAISearch />
    </>
  );
};
export default AiSearchPage;
