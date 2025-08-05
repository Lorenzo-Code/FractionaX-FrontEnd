import React, { useState } from 'react';

export default function EditorToolbar({ editor }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const setLink = () => {
    // Empty URL removes the link
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // Add or update the link
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setShowLinkDialog(true);
  };

  return (
    <>
    <div className="flex flex-wrap gap-2 border bg-gray-100 p-2 rounded-t-lg mb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white border'}`}
      >
        Bold
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white border'}`}
      >
        Italic
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white border'}`}
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white border'}`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white border'}`}
      >
        Quote
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="px-2 py-1 rounded text-sm bg-white border"
      >
        Undo
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="px-2 py-1 rounded text-sm bg-white border"
      >
        Redo
      </button>

      {/* Link buttons */}
      <button
        onClick={openLinkDialog}
        className={`px-2 py-1 rounded text-sm ${
          editor.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white border'
        }`}
      >
        {editor.isActive('link') ? '🔗 Edit Link' : '🔗 Add Link'}
      </button>

      {editor.isActive('link') && (
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="px-2 py-1 rounded text-sm bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
        >
          Remove Link
        </button>
      )}
    </div>
    
    {/* Link Dialog Modal */}
    {showLinkDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
          <h3 className="text-lg font-semibold mb-4">
            {editor.isActive('link') ? 'Edit Link' : 'Add Link'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL or Website Address
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or factchecker.org"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowLinkDialog(false);
                  setLinkUrl('');
                }
              }}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Links will automatically open in a new tab for your readers
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowLinkDialog(false);
                setLinkUrl('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={setLink}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editor.isActive('link') ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
