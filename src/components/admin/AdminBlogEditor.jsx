import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './editor/EditorToolbar';
import { smartFetch, saveBlogDraft } from '../../utils/apiClient';






export default function AdminBlogEditor({ existingPost }) {
  const [title, setTitle] = useState(existingPost?.title || '');
  const [mode, setMode] = useState(existingPost?.mode || 'wysiwyg');
  const [wysiwygContent, setWysiwygContent] = useState(existingPost?.wysiwygContent || '');
  const [codeContent, setCodeContent] = useState(existingPost?.codeContent || '');
  const [published, setPublished] = useState(existingPost?.published ?? true);
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
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
      Placeholder.configure({
        placeholder: '📝 Start writing your blog post here...',
        emptyEditorClass: 'text-gray-400 italic',
      }),
    ],
    content: wysiwygContent,
    onUpdate: ({ editor }) => setWysiwygContent(editor.getHTML()),
  });


  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === 'wysiwyg');
    }
  }, [editor, mode]);


  const handleSubmit = async () => {
  const payload = {
    title,
    slug: title.toLowerCase().replace(/ /g, '-'),
    mode,
    wysiwygContent,
    codeContent,
    published,
    author: 'Admin', // optional but consistent
  };

  try {
    if (existingPost?._id) {
      const res = await smartFetch(`/api/blogs/${existingPost._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      console.info("✅ Post updated:", await res.json());
      alert('Post updated!');
    } else {
      const res = await smartFetch(`/api/blogs`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.info("✅ Post created:", await res.json());
      alert('Post created!');
    }

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
      {isSaving && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg text-sm animate-pulse z-50">
          💾 Saving...
        </div>
      )}
    </div>

  );
}