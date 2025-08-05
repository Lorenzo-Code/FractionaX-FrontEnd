import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './editor/EditorToolbar';
import { smartFetch, saveBlogDraft } from '../../../shared/utils';






export default function AdminBlogEditor({ existingPost }) {
  const [title, setTitle] = useState(existingPost?.title || '');
  const [mode, setMode] = useState(existingPost?.mode || 'wysiwyg');
  const [wysiwygContent, setWysiwygContent] = useState(existingPost?.wysiwygContent || '');
  const [codeContent, setCodeContent] = useState(existingPost?.codeContent || '');
  const [published, setPublished] = useState(existingPost?.published ?? true);
  const [featuredImage, setFeaturedImage] = useState(existingPost?.image || '');
  const [imagePreview, setImagePreview] = useState(existingPost?.image || '');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [imageEditData, setImageEditData] = useState({
    src: '',
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    aspectRatio: 1
  });
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  // Handle image upload and convert to base64 or upload to server
  const handleImageUpload = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // Get image dimensions
  const getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = src;
    });
  };

  // Resize image to specified dimensions
  const resizeImage = (src, targetWidth, targetHeight, quality = 0.9) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Convert to base64
        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedDataUrl);
      };
      
      img.src = src;
    });
  };

  // Handle opening image editor
  const handleEditImage = async (src) => {
    const dimensions = await getImageDimensions(src);
    setImageEditData({
      src,
      width: dimensions.width,
      height: dimensions.height,
      originalWidth: dimensions.width,
      originalHeight: dimensions.height,
      aspectRatio: dimensions.width / dimensions.height
    });
    setShowImageEditor(true);
  };

  // Handle applying image resize
  const handleApplyResize = async () => {
    const resizedSrc = await resizeImage(imageEditData.src, imageEditData.width, imageEditData.height);
    setPendingImageSrc(resizedSrc);
    setShowImageEditor(false);
    setShowImageOptions(true);
  };

  // Handle maintaining aspect ratio
  const handleWidthChange = (newWidth) => {
    const newHeight = Math.round(newWidth / imageEditData.aspectRatio);
    setImageEditData(prev => ({ ...prev, width: newWidth, height: newHeight }));
  };

  const handleHeightChange = (newHeight) => {
    const newWidth = Math.round(newHeight * imageEditData.aspectRatio);
    setImageEditData(prev => ({ ...prev, width: newWidth, height: newHeight }));
  };
  dayjs.extend(relativeTime);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: '📝 Start writing your blog post here...\n\n💡 Tip: You can drag and drop images directly into this editor!',
        emptyEditorClass: 'text-gray-400 italic',
      }),
    ],
    content: wysiwygContent,
    onUpdate: ({ editor }) => setWysiwygContent(editor.getHTML()),
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file).then((src) => {
              setPendingImageSrc(src);
              setShowImageOptions(true);
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file).then((src) => {
                setPendingImageSrc(src);
                setShowImageOptions(true);
              });
            }
            return true;
          }
        }
        return false;
      },
    },
  });


  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === 'wysiwyg');
    }
  }, [editor, mode]);


  const handleSubmit = async () => {
    // Check if featuredImage is a File object or a URL string
    const isFileUpload = featuredImage instanceof File;
    
    let payload;
    let options;
    
    if (isFileUpload) {
      // Use FormData for file uploads
      payload = new FormData();
      payload.append('title', title);
      payload.append('slug', title.toLowerCase().replace(/ /g, '-'));
      payload.append('mode', mode);
      payload.append('wysiwygContent', wysiwygContent);
      payload.append('codeContent', codeContent);
      payload.append('published', published);
      payload.append('author', 'Admin');
      payload.append('image', featuredImage);
      
      options = {
        method: existingPost?._id ? 'PUT' : 'POST',
        body: payload,
        // Don't set Content-Type header for FormData - browser will set it automatically
      };
    } else {
      // Use JSON for URL-based images
      payload = {
        title,
        slug: title.toLowerCase().replace(/ /g, '-'),
        mode,
        wysiwygContent,
        codeContent,
        published,
        image: featuredImage,
        author: 'Admin',
      };
      
      options = {
        method: existingPost?._id ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      };
    }

    try {
      const endpoint = existingPost?._id ? `/api/blogs/${existingPost._id}` : '/api/blogs';
      const res = await smartFetch(endpoint, options);
      
      console.info("✅ Post " + (existingPost?._id ? "updated" : "created") + ":", await res.json());
      alert('Post ' + (existingPost?._id ? 'updated' : 'created') + '!');
      
      navigate('/admin/blogs');
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Something went wrong saving the post.");
    }
  };



  // Auto-save functionality with debouncing
  useEffect(() => {
    const shouldSave =
      title.trim() !== '' || wysiwygContent.trim() !== '' || codeContent.trim() !== '';

    if (!shouldSave) return;

    // Debounce auto-save to prevent excessive API calls
    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        const res = await saveBlogDraft({
          title,
          mode,
          wysiwygContent,
          codeContent,
          author: 'Admin', // or get from context later
          published,
        });

        console.info("✅ Autosave success", res);
      } catch (err) {
        console.error("❌ Autosave failed:", err);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeout);
  }, [title, wysiwygContent, codeContent, mode, published]); // Removed isSaving from dependencies




  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/blogs')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to All Blog Posts
      </button>

      {/* Header + Save + Preview */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{existingPost ? 'Edit Post' : 'New Blog Post'}</h1>
        <div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded ml-2"
          >
            {showPreview ? "Hide Preview" : "Preview Post"}
          </button>
        </div>
      </div>

      {existingPost && (
        <div className="mb-2 text-sm text-gray-500">
          <p>📅 Created: {new Date(existingPost.createdAt).toLocaleString()}</p>
          <p>
            💾 Last Updated: {new Date(existingPost.updatedAt).toLocaleString()} &nbsp;
            <span className="text-xs text-gray-400">
              ({dayjs(existingPost.updatedAt).fromNow()})
            </span>
          </p>
        </div>

      )}

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
        <input
          type="text"
          className="w-full text-2xl font-semibold border-b p-2"
          placeholder="Write a compelling blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          URL slug:{" "}
          <span className="font-mono text-blue-600">
            /blog/{title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}
          </span>
        </p>
      </div>

      {/* Featured Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <div className="relative">
            <img
              src={imagePreview}
              alt="Featured image preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={() => setImagePreview('')}
            />
            <button
              type="button"
              onClick={() => {
                setFeaturedImage('');
                setImagePreview('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 This image will appear as the background of your blog card and in social media shares.
          </p>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode('wysiwyg')}
          className={`px-3 py-1 rounded ${mode === 'wysiwyg' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Standard
        </button>
        <button
          onClick={() => setMode('code')}
          className={`px-3 py-1 rounded ${mode === 'code' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          HTML
        </button>
      </div>

      {/* Editor */}
      {mode === 'wysiwyg' ? (
        editor ? (
          <div className="bg-white border rounded-xl shadow-sm p-4 mb-10 min-h-[780px] prose max-w-none">
            <EditorToolbar editor={editor} />
            <EditorContent
              editor={editor}
              className="focus:outline-none min-h-[600px]"
            />
          </div>
        ) : (
          <div className="text-gray-500 mb-6">Loading editor...</div>
        )
      ) : (
        <textarea
          className="w-full h-96 border rounded p-4 font-mono mb-6"
          placeholder="<html>...</html>"
          value={codeContent}
          onChange={(e) => setCodeContent(e.target.value)}
        />
      )}

      {/* Preview Output */}
      {showPreview && (
        <div className="bg-white border rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">📖 Post Preview</h2>
          {mode === 'wysiwyg' ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: wysiwygContent }}
            />
          ) : (
            <iframe
              title="HTML Preview"
              srcDoc={codeContent}
              className="w-full h-[600px] border"
            />
          )}
        </div>
      )}

      {/* Publish Toggle */}
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={published}
            onChange={() => setPublished(!published)}
            className="mr-2"
          />
          Publish this post
        </label>
      </div>
      {/* Image Options Modal */}
      {showImageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Image</h3>
            <div className="mb-4">
              <img
                src={pendingImageSrc}
                alt="Image preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  if (editor) {
                    editor.chain().focus().setImage({ src: pendingImageSrc }).run();
                  }
                  setShowImageOptions(false);
                  setPendingImageSrc('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📝 Add to Blog Content
              </button>
              <button
                onClick={() => {
                  setFeaturedImage(pendingImageSrc);
                  setImagePreview(pendingImageSrc);
                  setShowImageOptions(false);
                  setPendingImageSrc('');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🖼️ Set as Featured Image
              </button>
              <button
                onClick={() => {
                  if (editor) {
                    editor.chain().focus().setImage({ src: pendingImageSrc }).run();
                  }
                  setFeaturedImage(pendingImageSrc);
                  setImagePreview(pendingImageSrc);
                  setShowImageOptions(false);
                  setPendingImageSrc('');
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                🎯 Add to Content & Set as Featured
              </button>
              <button
                onClick={() => handleEditImage(pendingImageSrc)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                ✏️ Edit Image
              </button>
              <button
                onClick={() => {
                  setShowImageOptions(false);
                  setPendingImageSrc('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Image Size</h3>
            
            {/* Image Preview */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={imageEditData.src}
                  alt="Image editor preview"
                  className="max-w-full max-h-64 object-contain rounded-lg border"
                  style={{
                    width: Math.min(imageEditData.width, 400),
                    height: 'auto'
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Preview (scaled to fit display)
              </p>
            </div>

            {/* Size Controls */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Width Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    value={imageEditData.width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Height Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    value={imageEditData.height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Original Size Info */}
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                <p><strong>Original size:</strong> {imageEditData.originalWidth} × {imageEditData.originalHeight} px</p>
                <p><strong>Current size:</strong> {imageEditData.width} × {imageEditData.height} px</p>
                <p><strong>Aspect ratio:</strong> {imageEditData.aspectRatio.toFixed(2)}:1 (maintained)</p>
              </div>

              {/* Quick Size Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Size Presets:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleWidthChange(imageEditData.originalWidth)}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Original
                  </button>
                  <button
                    onClick={() => handleWidthChange(800)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Large (800px)
                  </button>
                  <button
                    onClick={() => handleWidthChange(600)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Medium (600px)
                  </button>
                  <button
                    onClick={() => handleWidthChange(400)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Small (400px)
                  </button>
                  <button
                    onClick={() => handleWidthChange(200)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Thumbnail (200px)
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImageEditor(false);
                  setShowImageOptions(true);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyResize}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Resize
              </button>
            </div>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg text-sm animate-pulse z-50">
          💾 Saving...
        </div>
      )}
    </div>

  );
}