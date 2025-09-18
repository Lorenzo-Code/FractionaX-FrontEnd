import {
  FaCoins,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaChartLine,
  FaBuilding,
  FaClock,
  FaShieldAlt,
  FaGem,
  FaBell,
  FaUsers,
  FaFileAlt,
  FaChartPie,
  FaLayerGroup
} from 'react-icons/fa';

// Define all available widgets with their configuration
export const WIDGET_TYPES = {
  FXCT_BALANCE: 'fxct_balance',
  FST_BALANCE: 'fst_balance',
  PASSIVE_INCOME: 'passive_income',
  INCOME_CHART: 'income_chart',
  USER_PROPERTIES: 'user_properties',
  PROPERTY_TIMELINE: 'property_timeline',
  COMPLIANCE_STATUS: 'compliance_status',
  STAKING_SUMMARY: 'staking_summary',
  NOTIFICATIONS: 'notifications',
  REFERRAL_BOX: 'referral_box',
  DOCUMENTS_VAULT: 'documents_vault',
  PORTFOLIO_BREAKDOWN: 'portfolio_breakdown',
  STAKING_BREAKDOWN: 'staking_breakdown'
};

// Widget configurations with default sizes and metadata
export const WIDGET_CONFIG = {
  [WIDGET_TYPES.FXCT_BALANCE]: {
    id: WIDGET_TYPES.FXCT_BALANCE,
    title: 'FXCT Balance',
    description: 'Your FXCT token balance and current market price',
    icon: FaCoins,
    color: 'yellow',
    category: 'tokens',
    defaultSize: { w: 4, h: 3, minW: 3, minH: 2 },
    priority: 1
  },
  [WIDGET_TYPES.FST_BALANCE]: {
    id: WIDGET_TYPES.FST_BALANCE,
    title: 'FST Balance',
    description: 'Your FST token balance and current market price',
    icon: FaMoneyBillWave,
    color: 'green',
    category: 'tokens',
    defaultSize: { w: 4, h: 3, minW: 3, minH: 2 },
    priority: 2
  },
  [WIDGET_TYPES.PASSIVE_INCOME]: {
    id: WIDGET_TYPES.PASSIVE_INCOME,
    title: 'Passive Income',
    description: 'Monthly passive income from your investments',
    icon: FaHandHoldingUsd,
    color: 'purple',
    category: 'income',
    defaultSize: { w: 4, h: 3, minW: 3, minH: 2 },
    priority: 3
  },
  [WIDGET_TYPES.INCOME_CHART]: {
    id: WIDGET_TYPES.INCOME_CHART,
    title: 'Income Chart',
    description: 'Historical passive income performance graph',
    icon: FaChartLine,
    color: 'blue',
    category: 'analytics',
    defaultSize: { w: 12, h: 6, minW: 6, minH: 4 },
    priority: 4
  },
  [WIDGET_TYPES.USER_PROPERTIES]: {
    id: WIDGET_TYPES.USER_PROPERTIES,
    title: 'My Properties',
    description: 'Properties in your investment portfolio',
    icon: FaBuilding,
    color: 'indigo',
    category: 'properties',
    defaultSize: { w: 6, h: 8, minW: 4, minH: 6 },
    priority: 5
  },
  [WIDGET_TYPES.PROPERTY_TIMELINE]: {
    id: WIDGET_TYPES.PROPERTY_TIMELINE,
    title: 'Property Timeline',
    description: 'Timeline of property investment stages',
    icon: FaClock,
    color: 'gray',
    category: 'properties',
    defaultSize: { w: 6, h: 8, minW: 4, minH: 6 },
    priority: 6
  },
  [WIDGET_TYPES.COMPLIANCE_STATUS]: {
    id: WIDGET_TYPES.COMPLIANCE_STATUS,
    title: 'Compliance Status',
    description: 'KYC and regulatory compliance status',
    icon: FaShieldAlt,
    color: 'red',
    category: 'account',
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
    priority: 7
  },
  [WIDGET_TYPES.STAKING_SUMMARY]: {
    id: WIDGET_TYPES.STAKING_SUMMARY,
    title: 'Staking Summary',
    description: 'Overview of your staked tokens and rewards',
    icon: FaGem,
    color: 'pink',
    category: 'staking',
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
    priority: 8
  },
  [WIDGET_TYPES.NOTIFICATIONS]: {
    id: WIDGET_TYPES.NOTIFICATIONS,
    title: 'Notifications',
    description: 'Recent notifications and alerts',
    icon: FaBell,
    color: 'orange',
    category: 'communication',
    defaultSize: { w: 6, h: 6, minW: 4, minH: 4 },
    priority: 9
  },
  [WIDGET_TYPES.REFERRAL_BOX]: {
    id: WIDGET_TYPES.REFERRAL_BOX,
    title: 'Referrals',
    description: 'Your referral program status and rewards',
    icon: FaUsers,
    color: 'teal',
    category: 'rewards',
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
    priority: 10
  },
  [WIDGET_TYPES.DOCUMENTS_VAULT]: {
    id: WIDGET_TYPES.DOCUMENTS_VAULT,
    title: 'Documents',
    description: 'Access your investment documents and contracts',
    icon: FaFileAlt,
    color: 'slate',
    category: 'documents',
    defaultSize: { w: 6, h: 6, minW: 4, minH: 4 },
    priority: 11
  },
  [WIDGET_TYPES.PORTFOLIO_BREAKDOWN]: {
    id: WIDGET_TYPES.PORTFOLIO_BREAKDOWN,
    title: 'Portfolio Breakdown',
    description: 'Visual breakdown of your investment portfolio',
    icon: FaChartPie,
    color: 'emerald',
    category: 'analytics',
    defaultSize: { w: 6, h: 6, minW: 4, minH: 4 },
    priority: 12
  },
  [WIDGET_TYPES.STAKING_BREAKDOWN]: {
    id: WIDGET_TYPES.STAKING_BREAKDOWN,
    title: 'Staking Breakdown',
    description: 'Detailed breakdown of your staking positions',
    icon: FaLayerGroup,
    color: 'violet',
    category: 'staking',
    defaultSize: { w: 6, h: 6, minW: 4, minH: 4 },
    priority: 13
  }
};

// Widget categories for organization
export const WIDGET_CATEGORIES = {
  tokens: { name: 'Tokens', color: 'blue' },
  income: { name: 'Income', color: 'green' },
  analytics: { name: 'Analytics', color: 'purple' },
  properties: { name: 'Properties', color: 'orange' },
  staking: { name: 'Staking', color: 'pink' },
  account: { name: 'Account', color: 'red' },
  communication: { name: 'Communication', color: 'yellow' },
  rewards: { name: 'Rewards', color: 'teal' },
  documents: { name: 'Documents', color: 'gray' }
};

// Default dashboard layout for new users
export const DEFAULT_LAYOUT = {
  lg: [
    { i: WIDGET_TYPES.FXCT_BALANCE, x: 0, y: 0, w: 4, h: 3 },
    { i: WIDGET_TYPES.FST_BALANCE, x: 4, y: 0, w: 4, h: 3 },
    { i: WIDGET_TYPES.PASSIVE_INCOME, x: 8, y: 0, w: 4, h: 3 },
    { i: WIDGET_TYPES.INCOME_CHART, x: 0, y: 3, w: 12, h: 6 },
    { i: WIDGET_TYPES.USER_PROPERTIES, x: 0, y: 9, w: 6, h: 8 },
    { i: WIDGET_TYPES.PROPERTY_TIMELINE, x: 6, y: 9, w: 6, h: 8 },
    { i: WIDGET_TYPES.COMPLIANCE_STATUS, x: 0, y: 17, w: 6, h: 4 },
    { i: WIDGET_TYPES.STAKING_SUMMARY, x: 6, y: 17, w: 6, h: 4 },
    { i: WIDGET_TYPES.NOTIFICATIONS, x: 0, y: 21, w: 6, h: 6 },
    { i: WIDGET_TYPES.REFERRAL_BOX, x: 6, y: 21, w: 6, h: 4 },
    { i: WIDGET_TYPES.DOCUMENTS_VAULT, x: 6, y: 25, w: 6, h: 6 },
    { i: WIDGET_TYPES.PORTFOLIO_BREAKDOWN, x: 0, y: 27, w: 6, h: 6 },
    { i: WIDGET_TYPES.STAKING_BREAKDOWN, x: 6, y: 31, w: 6, h: 6 }
  ],
  md: [
    { i: WIDGET_TYPES.FXCT_BALANCE, x: 0, y: 0, w: 6, h: 3 },
    { i: WIDGET_TYPES.FST_BALANCE, x: 6, y: 0, w: 6, h: 3 },
    { i: WIDGET_TYPES.PASSIVE_INCOME, x: 0, y: 3, w: 12, h: 3 },
    { i: WIDGET_TYPES.INCOME_CHART, x: 0, y: 6, w: 12, h: 6 },
    { i: WIDGET_TYPES.USER_PROPERTIES, x: 0, y: 12, w: 12, h: 8 },
    { i: WIDGET_TYPES.PROPERTY_TIMELINE, x: 0, y: 20, w: 12, h: 8 },
    { i: WIDGET_TYPES.COMPLIANCE_STATUS, x: 0, y: 28, w: 6, h: 4 },
    { i: WIDGET_TYPES.STAKING_SUMMARY, x: 6, y: 28, w: 6, h: 4 },
    { i: WIDGET_TYPES.NOTIFICATIONS, x: 0, y: 32, w: 12, h: 6 },
    { i: WIDGET_TYPES.REFERRAL_BOX, x: 0, y: 38, w: 6, h: 4 },
    { i: WIDGET_TYPES.DOCUMENTS_VAULT, x: 6, y: 38, w: 6, h: 6 },
    { i: WIDGET_TYPES.PORTFOLIO_BREAKDOWN, x: 0, y: 42, w: 6, h: 6 },
    { i: WIDGET_TYPES.STAKING_BREAKDOWN, x: 6, y: 44, w: 6, h: 6 }
  ],
  sm: [
    { i: WIDGET_TYPES.FXCT_BALANCE, x: 0, y: 0, w: 12, h: 3 },
    { i: WIDGET_TYPES.FST_BALANCE, x: 0, y: 3, w: 12, h: 3 },
    { i: WIDGET_TYPES.PASSIVE_INCOME, x: 0, y: 6, w: 12, h: 3 },
    { i: WIDGET_TYPES.INCOME_CHART, x: 0, y: 9, w: 12, h: 6 },
    { i: WIDGET_TYPES.USER_PROPERTIES, x: 0, y: 15, w: 12, h: 8 },
    { i: WIDGET_TYPES.PROPERTY_TIMELINE, x: 0, y: 23, w: 12, h: 8 },
    { i: WIDGET_TYPES.COMPLIANCE_STATUS, x: 0, y: 31, w: 12, h: 4 },
    { i: WIDGET_TYPES.STAKING_SUMMARY, x: 0, y: 35, w: 12, h: 4 },
    { i: WIDGET_TYPES.NOTIFICATIONS, x: 0, y: 39, w: 12, h: 6 },
    { i: WIDGET_TYPES.REFERRAL_BOX, x: 0, y: 45, w: 12, h: 4 },
    { i: WIDGET_TYPES.DOCUMENTS_VAULT, x: 0, y: 49, w: 12, h: 6 },
    { i: WIDGET_TYPES.PORTFOLIO_BREAKDOWN, x: 0, y: 55, w: 12, h: 6 },
    { i: WIDGET_TYPES.STAKING_BREAKDOWN, x: 0, y: 61, w: 12, h: 6 }
  ]
};

// Default enabled widgets (all enabled by default)
export const DEFAULT_ENABLED_WIDGETS = Object.keys(WIDGET_TYPES).reduce((acc, key) => {
  acc[WIDGET_TYPES[key]] = true;
  return acc;
}, {});

// Grid breakpoints for responsive design
export const GRID_BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};

// Columns per breakpoint
export const GRID_COLS = {
  lg: 12,
  md: 12,
  sm: 12,
  xs: 12,
  xxs: 12
};

// Row height
export const ROW_HEIGHT = 60;

// Grid margins and padding
export const GRID_MARGIN = [16, 16];
export const CONTAINER_PADDING = [0, 0];
