import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminBlogEditor from './AdminBlogEditor';
import { smartFetch } from '../shared/utils';

export default function EditWrapper() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await smartFetch(`/api/blogs/${id}`);
        const data = await res.json();

        if (!data || data.error) {
          console.error("⚠️ Error fetching blog post:", data.error || data);
          return;
        }

        setPost(data);
      } catch (err) {
        console.error("❌ Failed to load post:", err);
      }
    }

    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6 text-gray-600">Loading blog post...</div>;

  return <AdminBlogEditor existingPost={post} />;
}
