import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { smartFetch } from '../../utils/apiClient';

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState([]);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const res = await smartFetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBlogs(blogs.filter(b => b._id !== id));
        console.info("🗑️ Blog deleted:", id);
      } else {
        console.error("❌ Delete failed:", res.status);
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await smartFetch('/api/blogs');
        const data = await res.json();

        if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
          console.info("📥 Loaded blogs:", data.blogs.length);
        } else {
          console.warn("⚠️ Unexpected response shape:", data);
          setBlogs([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch blogs:", err);
        setBlogs([]);
      }
    }

    fetchBlogs();
  }, []);

  console.log("📥 Blog ID list:", blogs.map(b => b._id));


  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Link to="/admin/blogs/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ New Post</Link>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Published</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog._id} className="border-t">
              <td className="p-2">{blog.title}</td>
              <td className="p-2">{blog.published ? '✅' : '❌'}</td>
              <td className="p-2 space-x-4">
                <Link to={`/admin/blogs/edit/${blog._id}`} className="text-blue-600">Edit</Link>
                <button onClick={() => deleteBlog(blog._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
