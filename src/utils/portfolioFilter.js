/**
 * 🏢 CREXI-STYLE PORTFOLIO FILTER (Rule-Based, No AI)
 * 
 * Filters properties to find true multi-family portfolios like:
 * https://www.crexi.com/properties/2023124/alabama-huntsville-alabama-35-unit-portfolio
 * 
 * This uses pure logic rules instead of AI to avoid timeouts
 */

/**
 * Keywords that indicate rental/investment potential properties
 */
const PORTFOLIO_KEYWORDS = [
  // Unit indicators
  'unit', 'units', 'apartment', 'apartments', 'complex', 'portfolio', 
  'duplex', 'triplex', 'fourplex', 'multiplex', 'multifamily', 'multi-family',
  
  // Investment/rental indicators
  'investment', 'rental', 'rentals', 'income', 'cash flow', 'cashflow',
  'investor', 'tenant', 'lease', 'leased', 'occupied', 'vacancy',
  
  // Building types
  'building', 'buildings', 'property', 'properties', 'commercial',
  'mixed use', 'mixed-use', 'retail', 'office', 'warehouse',
  
  // Property features indicating rental potential
  'separate entrance', 'separate entrances', 'mother in law', 'in-law suite',
  'basement apartment', 'carriage house', 'guest house', 'accessory dwelling',
  'adu', 'detached unit', 'garage apartment',
  
  // Numbers that might indicate units
  '2', '3', '4', '5', '6', '8', '10', '12', '15', '20', '25', '30', '35', '40', '50'
];

const EXCLUDE_KEYWORDS = [
  'single', 'family', 'house', 'home', 'residential', 'townhouse', 'condo'
];

/**
 * Calculate estimated units based on property characteristics
 */
const estimateUnits = (property) => {
  const beds = property.specs?.beds || property.bedrooms || 0;
  const baths = property.specs?.baths || property.bathrooms || 0;
  const sqft = property.specs?.sqft || property.livingArea || 0;
  const price = property.pricing?.listPrice || property.price || 0;

  // High bedroom/bathroom count suggests multiple units
  if (beds >= 12) return Math.floor(beds / 3); // Estimate 3 beds per unit
  if (beds >= 8 && baths >= 6) return Math.floor(beds / 2.5); // 2.5 beds per unit
  if (beds >= 6 && baths >= 4) return Math.floor(beds / 2); // 2 beds per unit

  // Large square footage suggests multiple units
  if (sqft >= 8000) return Math.floor(sqft / 800); // 800 sqft per unit
  if (sqft >= 5000) return Math.floor(sqft / 1000); // 1000 sqft per unit

  // High price per bedroom suggests commercial property
  if (price > 1000000 && beds >= 4) {
    const pricePerBed = price / beds;
    if (pricePerBed > 200000) return Math.floor(beds / 2); // Commercial-grade
  }

  return beds >= 4 ? 2 : 1; // Default estimate
};

/**
 * Estimate monthly rent based on property characteristics
 */
const estimateMonthlyRent = (property) => {
  const beds = property.specs?.beds || property.bedrooms || 0;
  const baths = property.specs?.baths || property.bathrooms || 0;
  const sqft = property.specs?.sqft || property.livingArea || 0;
  const price = property.pricing?.listPrice || property.price || 0;
  const estimatedUnits = estimateUnits(property);
  
  // Base rent estimation by bedroom count (market averages)
  let baseRentPerUnit = 0;
  if (beds >= 6) baseRentPerUnit = 2500; // Large properties
  else if (beds >= 4) baseRentPerUnit = 1800;
  else if (beds >= 3) baseRentPerUnit = 1400;
  else if (beds >= 2) baseRentPerUnit = 1200;
  else baseRentPerUnit = 1000;
  
  // Adjust for square footage
  if (sqft > 3000) baseRentPerUnit *= 1.2;
  else if (sqft > 2000) baseRentPerUnit *= 1.1;
  else if (sqft < 1200) baseRentPerUnit *= 0.9;
  
  // Multi-unit properties (estimated total rent)
  const totalRent = baseRentPerUnit * estimatedUnits;
  
  // Apply 1% rule adjustment (monthly rent should be ~1% of purchase price)
  const onePercentRule = price * 0.01;
  if (onePercentRule > totalRent && price > 0) {
    return Math.min(onePercentRule, totalRent * 1.3); // Don't exceed 130% of calculated rent
  }
  
  return totalRent;
};

/**
 * Estimate monthly mortgage payment (rough calculation)
 */
const estimateMonthlyMortgage = (price) => {
  if (!price) return 0;
  
  // Assume 20% down, 6.5% interest rate, 30 year term
  const principal = price * 0.8; // 80% financed
  const monthlyRate = 0.065 / 12; // 6.5% annual rate
  const numPayments = 30 * 12; // 30 years
  
  if (monthlyRate === 0) return principal / numPayments;
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  // Add estimated property taxes (1.2% annually), insurance (0.3%), and PMI if needed
  const monthlyTaxesInsurance = (price * 0.015) / 12; // 1.5% annually total
  
  return monthlyPayment + monthlyTaxesInsurance;
};

/**
 * Check if property has portfolio-indicating keywords
 */
const hasPortfolioKeywords = (property) => {
  const text = [
    property.address || '',
    property.description || '',
    property.title || '',
    property.propertyType || '',
    property.specs?.propertyType || ''
  ].join(' ').toLowerCase();

  const hasPositive = PORTFOLIO_KEYWORDS.some(keyword => text.includes(keyword));
  const hasNegative = EXCLUDE_KEYWORDS.some(keyword => text.includes(keyword));

  return hasPositive && !hasNegative;
};

/**
 * Calculate rental investment score based on portfolio characteristics
 */
const calculatePortfolioScore = (property) => {
  let score = 10; // Base score for any property (start with 10 points)
  
  const beds = property.specs?.beds || property.bedrooms || 0;
  const baths = property.specs?.baths || property.bathrooms || 0;
  const sqft = property.specs?.sqft || property.livingArea || 0;
  const price = property.pricing?.listPrice || property.price || 0;
  const estimatedUnits = estimateUnits(property);
  
  // Calculate potential rental income (rough estimate)
  const estimatedRent = estimateMonthlyRent(property);
  const monthlyMortgage = estimateMonthlyMortgage(price);
  const cashFlowPotential = estimatedRent - monthlyMortgage;

  // Unit count scoring (most important) - Extremely generous scoring
  if (estimatedUnits >= 20) score += 45;
  else if (estimatedUnits >= 10) score += 40;
  else if (estimatedUnits >= 6) score += 35;
  else if (estimatedUnits >= 4) score += 25;
  else if (estimatedUnits >= 2) score += 20;  // Great scoring for duplexes
  else if (estimatedUnits >= 1) score += 12;  // Good base score for any property

  // Size scoring - Very inclusive
  if (sqft >= 8000) score += 25;
  else if (sqft >= 5000) score += 20;
  else if (sqft >= 3000) score += 15;
  else if (sqft >= 2000) score += 12;
  else if (sqft >= 1500) score += 8;
  else if (sqft >= 1200) score += 5;
  else if (sqft >= 800) score += 3;   // Even small properties get points

  // Bedroom/bathroom ratio (indicates rental potential)
  if (beds >= 8) score += 18;  // Large properties
  else if (beds >= 6) score += 15;
  else if (beds >= 4) score += 10;  // Standard rental size
  else if (beds >= 3) score += 8;   // Decent rental size
  else if (beds >= 2) score += 5;   // Small rental potential
  
  if (baths >= 6) score += 15;
  else if (baths >= 4) score += 12;
  else if (baths >= 3) score += 8;
  else if (baths >= 2) score += 5;

  // Price range (investment-grade) - Very inclusive
  if (price >= 2000000 && price <= 5000000) score += 18;
  else if (price >= 1000000 && price <= 3000000) score += 15;
  else if (price >= 500000 && price <= 2000000) score += 12;
  else if (price >= 300000 && price <= 1000000) score += 10;
  else if (price >= 200000 && price <= 800000) score += 8;
  else if (price >= 150000 && price <= 600000) score += 6;
  else if (price >= 100000) score += 4;  // Any property over $100k gets some points

  // Keywords bonus
  if (hasPortfolioKeywords(property)) score += 15;
  
  // Cash flow potential scoring (generous for all scenarios)
  if (cashFlowPotential > 1000) score += 25;      // Excellent cash flow
  else if (cashFlowPotential > 500) score += 20;  // Good cash flow
  else if (cashFlowPotential > 200) score += 15;  // Decent cash flow
  else if (cashFlowPotential > 0) score += 12;    // Any positive cash flow
  else if (cashFlowPotential > -200) score += 8;  // Near break-even
  else if (cashFlowPotential > -500) score += 5;  // Manageable negative
  else score += 2;  // Even negative cash flow gets some points (could improve with management)
  
  // Rental income potential (1% rule and better)
  if (price > 0 && estimatedRent > 0) {
    const rentToPrice = (estimatedRent * 12) / price;
    if (rentToPrice >= 0.015) score += 20;      // 1.5%+ excellent
    else if (rentToPrice >= 0.012) score += 15; // 1.2%+ very good
    else if (rentToPrice >= 0.010) score += 10; // 1.0%+ good (1% rule)
    else if (rentToPrice >= 0.008) score += 5;  // 0.8%+ acceptable
  }
  
  // Property type bonuses for rental potential
  const propertyType = (property.propertyType || property.specs?.propertyType || '').toLowerCase();
  const description = (property.description || '').toLowerCase();
  
  if (propertyType.includes('duplex')) score += 15;
  else if (propertyType.includes('triplex')) score += 18;
  else if (propertyType.includes('fourplex')) score += 20;
  else if (propertyType.includes('apartment')) score += 12;
  else if (propertyType.includes('condo') && estimatedUnits >= 2) score += 8;
  else if (propertyType.includes('townhouse') && estimatedUnits >= 2) score += 10;
  
  // Bonus for properties with obvious rental features
  if (beds >= 4 && baths >= 3) score += 8;  // Good rental configuration
  if (sqft >= 2000 && beds >= 3) score += 6; // Spacious rental
  if (price <= 400000 && beds >= 3) score += 10; // Affordable investment
  if (description.includes('investment') || description.includes('rental')) score += 12;
  
  // Geographic bonuses (rental markets)
  const address = (property.address || '').toLowerCase();
  if (address.includes('tx') || address.includes('texas')) score += 5; // Texas rental market
  if (address.includes('houston') || address.includes('dallas') || address.includes('austin')) score += 3;

  return Math.min(score, 100);
};

/**
 * Main filter function - finds Crexi-style multi-family portfolios
 */
export const filterCrexiStylePortfolios = (properties, options = {}) => {
  const {
    minUnits = 4,           // Minimum estimated units
    minScore = 50,          // Minimum portfolio score
    minPrice = 500000,      // Minimum price
    maxPrice = 5000000,     // Maximum price
    maxResults = 50         // Maximum results to return
  } = options;

  console.log(`🏢 Filtering ${properties.length} properties for Crexi-style portfolios...`);
  console.log(`📊 Criteria: ${minUnits}+ units, ${minScore}+ score, $${minPrice.toLocaleString()}-$${maxPrice.toLocaleString()}`);

  const qualifiedProperties = properties
    .map(property => {
      const estimatedUnits = estimateUnits(property);
      const portfolioScore = calculatePortfolioScore(property);
      const price = property.pricing?.listPrice || property.price || 0;

      return {
        ...property,
        portfolioAnalysis: {
          estimatedUnits,
          portfolioScore,
          hasPortfolioKeywords: hasPortfolioKeywords(property),
          estimatedRent: estimateMonthlyRent(property),
          estimatedMortgage: estimateMonthlyMortgage(price),
          cashFlowPotential: estimateMonthlyRent(property) - estimateMonthlyMortgage(price),
          rentToPrice: price > 0 ? (estimateMonthlyRent(property) * 12) / price : 0,
          investmentGrade: portfolioScore >= 70 ? 'A' : portfolioScore >= 50 ? 'B' : portfolioScore >= 35 ? 'C' : 'D',
          qualificationReasons: []
        }
      };
    })
    .filter(property => {
      const { estimatedUnits, portfolioScore } = property.portfolioAnalysis;
      const price = property.pricing?.listPrice || property.price || 0;

      // Apply filters
      if (estimatedUnits < minUnits) return false;
      if (portfolioScore < minScore) return false;
      if (price < minPrice || price > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by portfolio score (highest first)
      return b.portfolioAnalysis.portfolioScore - a.portfolioAnalysis.portfolioScore;
    })
    .slice(0, maxResults);

  console.log(`✅ Found ${qualifiedProperties.length} Crexi-style portfolio opportunities`);
  
  // Log top 3 for debugging
  qualifiedProperties.slice(0, 3).forEach((prop, i) => {
    const analysis = prop.portfolioAnalysis;
    console.log(`📋 Investment Property ${i + 1}:`, {
      address: prop.address,
      price: `$${(prop.pricing?.listPrice || prop.price || 0).toLocaleString()}`,
      estimatedUnits: analysis.estimatedUnits,
      score: `${analysis.portfolioScore}/100 (Grade ${analysis.investmentGrade})`,
      monthlyRent: `$${Math.round(analysis.estimatedRent).toLocaleString()}`,
      cashFlow: `$${Math.round(analysis.cashFlowPotential).toLocaleString()}`,
      rentToPrice: `${(analysis.rentToPrice * 100).toFixed(1)}%`,
      beds: prop.specs?.beds || prop.bedrooms,
      sqft: (prop.specs?.sqft || prop.livingArea || 0).toLocaleString()
    });
  });

  return qualifiedProperties;
};

export default filterCrexiStylePortfolios;