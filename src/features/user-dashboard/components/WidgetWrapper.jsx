import React from 'react';
import { X, Move, Minimize2, Maximize2 } from 'lucide-react';
import { WIDGET_CONFIG } from '../config/widgetConfig';

const WidgetWrapper = ({ 
  widgetId, 
  children, 
  onRemove, 
  isCustomizing = false,
  className = "",
  ...gridProps 
}) => {
  const widgetConfig = WIDGET_CONFIG[widgetId];
  
  if (!widgetConfig) {
    console.warn(`No configuration found for widget: ${widgetId}`);
    return null;
  }

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50/20',
    green: 'border-green-200 bg-green-50/20',
    purple: 'border-purple-200 bg-purple-50/20',
    yellow: 'border-yellow-200 bg-yellow-50/20',
    red: 'border-red-200 bg-red-50/20',
    orange: 'border-orange-200 bg-orange-50/20',
    pink: 'border-pink-200 bg-pink-50/20',
    teal: 'border-teal-200 bg-teal-50/20',
    indigo: 'border-indigo-200 bg-indigo-50/20',
    gray: 'border-gray-200 bg-gray-50/20',
    slate: 'border-slate-200 bg-slate-50/20',
    emerald: 'border-emerald-200 bg-emerald-50/20',
    violet: 'border-violet-200 bg-violet-50/20'
  };

  const handleRemoveWidget = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(widgetId);
    }
  };

  return (
    <div 
      className={`
        relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 h-full
        ${isCustomizing ? 'border-dashed cursor-move' : 'border-solid'}
        ${isCustomizing ? colorClasses[widgetConfig.color] || colorClasses.gray : 'border-gray-200'}
        ${isCustomizing ? 'hover:shadow-lg hover:border-opacity-80' : 'hover:shadow-md'}
        ${className}
      `}
      {...gridProps}
    >
      {/* Widget Header - Only visible in customization mode */}
      {isCustomizing && (
        <div className="absolute -top-8 left-0 right-0 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2 px-2 py-1 bg-white rounded-t-md shadow-sm border border-b-0 border-gray-200 text-xs">
            <widgetConfig.icon className={`w-3 h-3 text-${widgetConfig.color}-500`} />
            <span className="font-medium text-gray-700">{widgetConfig.title}</span>
            <Move className="w-3 h-3 text-gray-400 cursor-move" />
          </div>
          <div className="flex items-center space-x-1">
            {/* Widget removal button */}
            <button
              onClick={handleRemoveWidget}
              className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
              title={`Remove ${widgetConfig.title}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={`h-full w-full ${isCustomizing ? 'pt-2 px-2 pb-2' : 'p-4'} overflow-hidden`}>
        {children}
      </div>

      {/* Widget Resize Handle - Only visible in customization mode */}
      {isCustomizing && (
        <div className="absolute bottom-1 right-1 text-gray-400">
          <Maximize2 className="w-3 h-3" />
        </div>
      )}

      {/* Drag overlay in customization mode */}
      {isCustomizing && (
        <div className="absolute inset-0 bg-transparent cursor-move rounded-lg" />
      )}
    </div>
  );
};

export default WidgetWrapper;
