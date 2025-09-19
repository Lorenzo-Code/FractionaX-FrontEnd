import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText,
  Image,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const DocumentUploadStep = ({ listingData, onNext, onPrevious, loading }) => {
  const [files, setFiles] = useState({
    offeringMemorandum: null,
    financials: [],
    photos: [],
    additionalDocs: []
  });
  
  const [photoDescriptions, setPhotoDescriptions] = useState([]);
  const [financialTypes, setFinancialTypes] = useState([]);
  const [dragActive, setDragActive] = useState({
    offeringMemorandum: false,
    financials: false,
    photos: false,
    additionalDocs: false
  });
  
  const [errors, setErrors] = useState({});
  
  // File input refs
  const offeringMemRef = useRef();
  const financialsRef = useRef();
  const photosRef = useRef();
  const additionalDocsRef = useRef();

  // File type restrictions
  const fileTypes = {
    offeringMemorandum: ['.pdf'],
    financials: ['.pdf', '.xlsx', '.xls', '.csv'],
    photos: ['.jpg', '.jpeg', '.png', '.webp'],
    additionalDocs: ['.pdf', '.doc', '.docx', '.xlsx', '.xls']
  };

  const maxFileSizes = {
    offeringMemorandum: 25 * 1024 * 1024, // 25MB
    financials: 10 * 1024 * 1024, // 10MB per file
    photos: 5 * 1024 * 1024, // 5MB per photo
    additionalDocs: 10 * 1024 * 1024 // 10MB per file
  };

  const maxFileCounts = {
    offeringMemorandum: 1,
    financials: 10,
    photos: 50,
    additionalDocs: 20
  };

  const handleDragEnter = (e, section) => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [section]: true }));
  };

  const handleDragLeave = (e, section) => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [section]: false }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateFile = (file, section) => {
    const allowedExtensions = fileTypes[section];
    const maxSize = maxFileSizes[section];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`;
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    return null;
  };

  const handleFileUpload = (uploadedFiles, section) => {
    const newErrors = { ...errors };
    const validFiles = [];
    const fileArray = Array.from(uploadedFiles);

    // Validate each file
    fileArray.forEach((file, index) => {
      const error = validateFile(file, section);
      if (error) {
        newErrors[`${section}_${index}`] = error;
      } else {
        validFiles.push(file);
      }
    });

    // Check file count limits
    const currentCount = section === 'offeringMemorandum' ? (files[section] ? 1 : 0) : files[section].length;
    const totalCount = currentCount + validFiles.length;
    
    if (totalCount > maxFileCounts[section]) {
      newErrors[section] = `Maximum ${maxFileCounts[section]} file(s) allowed for this section`;
      setErrors(newErrors);
      return;
    }

    // Update files state
    if (section === 'offeringMemorandum') {
      setFiles(prev => ({ ...prev, [section]: validFiles[0] || null }));
    } else {
      setFiles(prev => ({ 
        ...prev, 
        [section]: [...prev[section], ...validFiles] 
      }));
      
      // Initialize descriptions/types for new files
      if (section === 'photos') {
        setPhotoDescriptions(prev => [
          ...prev,
          ...validFiles.map(() => '')
        ]);
      }
      
      if (section === 'financials') {
        setFinancialTypes(prev => [
          ...prev,
          ...validFiles.map(() => 'Other')
        ]);
      }
    }

    setErrors(newErrors);
  };

  const handleDrop = (e, section) => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [section]: false }));
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles, section);
    }
  };

  const removeFile = (section, index = null) => {
    if (section === 'offeringMemorandum') {
      setFiles(prev => ({ ...prev, [section]: null }));
    } else {
      setFiles(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
      
      // Remove corresponding descriptions/types
      if (section === 'photos') {
        setPhotoDescriptions(prev => prev.filter((_, i) => i !== index));
      }
      
      if (section === 'financials') {
        setFinancialTypes(prev => prev.filter((_, i) => i !== index));
      }
    }
  };

  const updatePhotoDescription = (index, description) => {
    setPhotoDescriptions(prev => {
      const newDescriptions = [...prev];
      newDescriptions[index] = description;
      return newDescriptions;
    });
  };

  const updateFinancialType = (index, type) => {
    setFinancialTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = type;
      return newTypes;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that we have at least one document
    const hasFiles = files.offeringMemorandum || 
                    files.financials.length > 0 || 
                    files.photos.length > 0 || 
                    files.additionalDocs.length > 0;
    
    if (!hasFiles) {
      setErrors({ general: 'Please upload at least one document or photo.' });
      return;
    }

    const documentsData = {
      offeringMemorandum: files.offeringMemorandum,
      financials: files.financials,
      photos: files.photos,
      additionalDocs: files.additionalDocs,
      photoDescriptions: photoDescriptions,
      financialTypes: financialTypes
    };

    onNext(documentsData);
  };

  // Upload area component
  const UploadArea = ({ section, title, description, icon: Icon, accept, multiple = false }) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Icon className="w-5 h-5 mr-2 text-blue-600" />
        <h4 className="text-md font-medium text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive[section]
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={(e) => handleDragEnter(e, section)}
        onDragLeave={(e) => handleDragLeave(e, section)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, section)}
        onClick={() => {
          if (section === 'offeringMemorandum') offeringMemRef.current?.click();
          else if (section === 'financials') financialsRef.current?.click();
          else if (section === 'photos') photosRef.current?.click();
          else if (section === 'additionalDocs') additionalDocsRef.current?.click();
        }}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Drag & drop files here, or <span className="text-blue-600 font-medium">browse</span>
        </p>
        <p className="text-xs text-gray-500">
          Accepted: {fileTypes[section].join(', ')} • Max {(maxFileSizes[section] / 1024 / 1024).toFixed(0)}MB each
        </p>
        
        <input
          ref={section === 'offeringMemorandum' ? offeringMemRef : 
               section === 'financials' ? financialsRef :
               section === 'photos' ? photosRef : additionalDocsRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files, section)}
        />
      </div>
      
      {errors[section] && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[section]}
        </div>
      )}
    </div>
  );

  // File list component
  const FileList = ({ section, files, showDescriptions = false, showTypes = false }) => {
    if (!files || (Array.isArray(files) && files.length === 0) || (!Array.isArray(files) && !files)) {
      return null;
    }

    const fileArray = Array.isArray(files) ? files : [files];

    return (
      <div className="mt-4 space-y-2">
        {fileArray.map((file, index) => (
          <div key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start flex-1">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                
                {showDescriptions && (
                  <input
                    type="text"
                    placeholder="Add photo description (optional)"
                    value={photoDescriptions[index] || ''}
                    onChange={(e) => updatePhotoDescription(index, e.target.value)}
                    className="mt-2 w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                
                {showTypes && (
                  <select
                    value={financialTypes[index] || 'Other'}
                    onChange={(e) => updateFinancialType(index, e.target.value)}
                    className="mt-2 text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Rent Roll">Rent Roll</option>
                    <option value="P&L">P&L Statement</option>
                    <option value="Operating Statement">Operating Statement</option>
                    <option value="Tax Returns">Tax Returns</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => removeFile(section, Array.isArray(files) ? index : null)}
              className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Step 3: Upload Documents</h2>
        <p className="text-gray-600">
          Upload your property documents and photos. These will be included in your listing and syndication packages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Offering Memorandum */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <UploadArea
            section="offeringMemorandum"
            title="Offering Memorandum"
            description="Upload your property's offering memorandum or marketing package (PDF format)."
            icon={FileText}
            accept=".pdf"
            multiple={false}
          />
          <FileList section="offeringMemorandum" files={files.offeringMemorandum} />
        </div>

        {/* Financial Documents */}
        <div className="bg-green-50 p-6 rounded-lg">
          <UploadArea
            section="financials"
            title="Financial Documents"
            description="Upload rent rolls, P&L statements, operating statements, tax returns, and other financial documents."
            icon={FileText}
            accept=".pdf,.xlsx,.xls,.csv"
            multiple={true}
          />
          <FileList 
            section="financials" 
            files={files.financials} 
            showTypes={true}
          />
        </div>

        {/* Property Photos */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <UploadArea
            section="photos"
            title="Property Photos"
            description="Upload high-quality photos of the property interior, exterior, and surrounding area."
            icon={Image}
            accept=".jpg,.jpeg,.png,.webp"
            multiple={true}
          />
          <FileList 
            section="photos" 
            files={files.photos} 
            showDescriptions={true}
          />
        </div>

        {/* Additional Documents */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <UploadArea
            section="additionalDocs"
            title="Additional Documents"
            description="Upload any other relevant documents such as surveys, environmental reports, contracts, etc."
            icon={FileText}
            accept=".pdf,.doc,.docx,.xlsx,.xls"
            multiple={true}
          />
          <FileList section="additionalDocs" files={files.additionalDocs} />
        </div>

        {/* Upload Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Offering Memorandum:</span>
              <span className="ml-2 font-medium">
                {files.offeringMemorandum ? '1 file' : 'None'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Financials:</span>
              <span className="ml-2 font-medium">{files.financials.length} files</span>
            </div>
            <div>
              <span className="text-gray-600">Photos:</span>
              <span className="ml-2 font-medium">{files.photos.length} files</span>
            </div>
            <div>
              <span className="text-gray-600">Additional:</span>
              <span className="ml-2 font-medium">{files.additionalDocs.length} files</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deal Info
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Continue to Enrichment
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadStep;