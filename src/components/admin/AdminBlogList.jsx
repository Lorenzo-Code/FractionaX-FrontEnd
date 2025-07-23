import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminBlogList() {
  const [posts, setPosts] = useState([]);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`/api/blog/${id}`);
    setPosts(posts.filter(p => p._id !== id));
  };

  useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await axios.get('/api/blog');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]); // prevent crash
    }
  }
  fetchPosts();
}, []);


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
          {posts.map(post => (
            <tr key={post._id} className="border-t">
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.published ? '✅' : '❌'}</td>
              <td className="p-2 space-x-4">
                <Link to={`/admin/blogs/edit/${post._id}`} className="text-blue-600">Edit</Link>
                <button onClick={() => deletePost(post._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
