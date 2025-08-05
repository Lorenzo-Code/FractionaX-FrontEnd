import React from 'react';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Blog Post</h1>
      <p>This is a placeholder for the blog post with slug: {slug}</p>
      <p>Individual blog posts will be displayed here once content is available.</p>
    </div>
  );
};

export default BlogPost;
