import { DEFAULT_LAYOUT, DEFAULT_ENABLED_WIDGETS } from '../config/widgetConfig';

const STORAGE_KEYS = {
  ENABLED_WIDGETS: 'dashboard_enabled_widgets',
  LAYOUT: 'dashboard_layout',
  PREFERENCES: 'dashboard_preferences'
};

/**
 * Save enabled widgets to localStorage
 */
export const saveEnabledWidgets = (enabledWidgets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ENABLED_WIDGETS, JSON.stringify(enabledWidgets));
    console.log('✅ Saved enabled widgets to localStorage', enabledWidgets);
  } catch (error) {
    console.error('❌ Failed to save enabled widgets:', error);
  }
};

/**
 * Load enabled widgets from localStorage
 */
export const loadEnabledWidgets = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ENABLED_WIDGETS);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Loaded enabled widgets from localStorage', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load enabled widgets:', error);
  }
  
  console.log('🔧 Using default enabled widgets');
  return DEFAULT_ENABLED_WIDGETS;
};

/**
 * Save layout to localStorage
 */
export const saveLayout = (layout, breakpoint = 'lg') => {
  try {
    const currentLayouts = loadLayout();
    const updatedLayouts = {
      ...currentLayouts,
      [breakpoint]: layout
    };
    
    localStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(updatedLayouts));
    console.log(`✅ Saved ${breakpoint} layout to localStorage`, layout);
    return true;
  } catch (error) {
    console.error('❌ Failed to save layout:', error);
    return false;
  }
};

/**
 * Load layout from localStorage
 */
export const loadLayout = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAYOUT);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Loaded layout from localStorage', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load layout:', error);
  }
  
  console.log('🔧 Using default layout');
  return DEFAULT_LAYOUT;
};

/**
 * Save dashboard preferences
 */
export const savePreferences = (preferences) => {
  try {
    const currentPrefs = loadPreferences();
    const updatedPrefs = {
      ...currentPrefs,
      ...preferences,
      lastUpdated: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
    console.log('✅ Saved dashboard preferences', updatedPrefs);
    return true;
  } catch (error) {
    console.error('❌ Failed to save preferences:', error);
    return false;
  }
};

/**
 * Load dashboard preferences
 */
export const loadPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Loaded dashboard preferences', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load preferences:', error);
  }
  
  return {
    autoSave: true,
    customizationMode: false,
    gridSnap: true,
    compactMode: false,
    lastUpdated: Date.now()
  };
};

/**
 * Reset all dashboard customizations to defaults
 */
export const resetToDefaults = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ENABLED_WIDGETS);
    localStorage.removeItem(STORAGE_KEYS.LAYOUT);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    
    console.log('✅ Reset dashboard to defaults');
    return true;
  } catch (error) {
    console.error('❌ Failed to reset dashboard:', error);
    return false;
  }
};

/**
 * Export dashboard configuration for backup
 */
export const exportDashboardConfig = () => {
  try {
    const config = {
      enabledWidgets: loadEnabledWidgets(),
      layout: loadLayout(),
      preferences: loadPreferences(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    console.log('✅ Exported dashboard configuration', config);
    return config;
  } catch (error) {
    console.error('❌ Failed to export dashboard config:', error);
    return null;
  }
};

/**
 * Import dashboard configuration from backup
 */
export const importDashboardConfig = (config) => {
  try {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration object');
    }
    
    if (config.enabledWidgets) {
      saveEnabledWidgets(config.enabledWidgets);
    }
    
    if (config.layout) {
      localStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(config.layout));
    }
    
    if (config.preferences) {
      savePreferences(config.preferences);
    }
    
    console.log('✅ Imported dashboard configuration', config);
    return true;
  } catch (error) {
    console.error('❌ Failed to import dashboard config:', error);
    return false;
  }
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = () => {
  try {
    const enabledWidgets = localStorage.getItem(STORAGE_KEYS.ENABLED_WIDGETS);
    const layout = localStorage.getItem(STORAGE_KEYS.LAYOUT);
    const preferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    
    const stats = {
      enabledWidgetsSize: enabledWidgets ? enabledWidgets.length : 0,
      layoutSize: layout ? layout.length : 0,
      preferencesSize: preferences ? preferences.length : 0,
      totalSize: (enabledWidgets?.length || 0) + (layout?.length || 0) + (preferences?.length || 0),
      hasCustomizations: !!(enabledWidgets || layout || preferences)
    };
    
    console.log('📊 Dashboard storage stats', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to get storage stats:', error);
    return { totalSize: 0, hasCustomizations: false };
  }
};
