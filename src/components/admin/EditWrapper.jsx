import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminBlogEditor from './AdminBlogEditor';

export default function EditWrapper() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error loading post:", err);
      }
    }
    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6 text-gray-600">Loading blog post...</div>;

  return <AdminBlogEditor existingPost={post} />;
}
