import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  X, 
  Plus,
  Grid,
  Layout,
  Palette,
  Filter
} from 'lucide-react';
import { 
  WIDGET_CONFIG, 
  WIDGET_CATEGORIES, 
  WIDGET_TYPES,
  DEFAULT_LAYOUT,
  DEFAULT_ENABLED_WIDGETS 
} from '../config/widgetConfig';

const DashboardCustomizer = ({ 
  isOpen, 
  onClose, 
  enabledWidgets, 
  onToggleWidget, 
  onSaveLayout,
  onResetLayout,
  layout,
  currentBreakpoint
}) => {
  const [activeTab, setActiveTab] = useState('widgets');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Group widgets by category
  const widgetsByCategory = Object.values(WIDGET_CONFIG).reduce((acc, widget) => {
    if (!acc[widget.category]) {
      acc[widget.category] = [];
    }
    acc[widget.category].push(widget);
    return acc;
  }, {});

  // Sort widgets by priority within each category
  Object.keys(widgetsByCategory).forEach(category => {
    widgetsByCategory[category].sort((a, b) => a.priority - b.priority);
  });

  const filteredWidgets = selectedCategory === 'all' 
    ? Object.values(WIDGET_CONFIG)
    : widgetsByCategory[selectedCategory] || [];

  const enabledCount = Object.values(enabledWidgets).filter(Boolean).length;
  const totalCount = Object.keys(WIDGET_CONFIG).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Customizer Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Customize Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'widgets'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Grid className="w-4 h-4" />
              <span>Widgets</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'layout'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Layout</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'widgets' && (
            <div className="p-4 space-y-4">
              {/* Widget Stats */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Active Widgets</span>
                  <span className="text-blue-600 font-semibold">{enabledCount}/{totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(enabledCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by Category</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Widget List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Available Widgets</span>
                </h3>
                
                {filteredWidgets.map((widget) => {
                  const isEnabled = enabledWidgets[widget.id];
                  const IconComponent = widget.icon;
                  
                  return (
                    <div
                      key={widget.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                        isEnabled 
                          ? 'border-blue-200 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isEnabled ? `bg-${widget.color}-100` : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            isEnabled ? `text-${widget.color}-600` : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{widget.title}</div>
                          <div className="text-xs text-gray-500">{widget.description}</div>
                          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                            isEnabled 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {WIDGET_CATEGORIES[widget.category]?.name}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onToggleWidget(widget.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isEnabled
                            ? 'text-blue-600 hover:bg-blue-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isEnabled ? `Hide ${widget.title}` : `Show ${widget.title}`}
                      >
                        {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-medium text-gray-900 mb-2">Layout Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Current Breakpoint:</span>
                    <span className="font-medium text-blue-600 uppercase">{currentBreakpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grid Layout:</span>
                    <span className="font-medium">12 Columns</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Widgets Visible:</span>
                    <span className="font-medium">{layout?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Layout className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Drag & Drop</div>
                    <div className="text-sm text-blue-800">
                      Exit this panel and drag widgets to rearrange them. Resize by dragging the corners.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={onSaveLayout}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              <Save className="w-4 h-4" />
              <span>Save Layout</span>
            </button>
            <button
              onClick={onResetLayout}
              className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Changes are saved automatically. Use "Save Layout" to store as your default.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomizer;
