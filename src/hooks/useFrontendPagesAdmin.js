import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useFrontendPagesAdmin = () => {
  const [pagesData, setPagesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all pages data
  const fetchAllPagesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/content`);
      
      if (response.data.success) {
        setPagesData(response.data.data || {});
        setError(null);
      } else {
        throw new Error(response.data.error || 'Failed to fetch pages data');
      }
    } catch (err) {
      console.error('Error fetching pages data:', err);
      setError(err.message);
      // Set fallback data structure
      setPagesData({
        contact: getDefaultContactData(),
        careers: getDefaultCareersData()
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific page data
  const fetchPageData = async (pageName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/content/${pageName}`);
      
      if (response.data.success) {
        setPagesData(prev => ({
          ...prev,
          [pageName]: response.data.data
        }));
        return response.data.data;
      } else {
        throw new Error(response.data.error || `Failed to fetch ${pageName} data`);
      }
    } catch (err) {
      console.error(`Error fetching ${pageName} data:`, err);
      setError(err.message);
      return null;
    }
  };

  // Update page content
  const updatePageContent = async (pageName, content) => {
    try {
      setSaving(true);
      const response = await axios.put(`${API_BASE_URL}/api/frontend-pages/content/${pageName}`, {
        content
      });
      
      if (response.data.success) {
        setPagesData(prev => ({
          ...prev,
          [pageName]: content
        }));
        return true;
      } else {
        throw new Error(response.data.error || `Failed to update ${pageName}`);
      }
    } catch (err) {
      console.error(`Error updating ${pageName}:`, err);
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Create new page content
  const createPageContent = async (pageName, content) => {
    try {
      setSaving(true);
      const response = await axios.post(`${API_BASE_URL}/api/frontend-pages/content`, {
        pageName,
        content
      });
      
      if (response.data.success) {
        setPagesData(prev => ({
          ...prev,
          [pageName]: content
        }));
        return true;
      } else {
        throw new Error(response.data.error || `Failed to create ${pageName}`);
      }
    } catch (err) {
      console.error(`Error creating ${pageName}:`, err);
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete page content
  const deletePageContent = async (pageName) => {
    try {
      setSaving(true);
      const response = await axios.delete(`${API_BASE_URL}/api/frontend-pages/content/${pageName}`);
      
      if (response.data.success) {
        setPagesData(prev => {
          const newData = { ...prev };
          delete newData[pageName];
          return newData;
        });
        return true;
      } else {
        throw new Error(response.data.error || `Failed to delete ${pageName}`);
      }
    } catch (err) {
      console.error(`Error deleting ${pageName}:`, err);
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Add job position to careers page
  const addJobPosition = async (jobData) => {
    try {
      const currentCareersData = pagesData.careers || getDefaultCareersData();
      const updatedCareersData = {
        ...currentCareersData,
        jobPositions: [
          ...(currentCareersData.jobPositions || []),
          {
            id: Date.now().toString(),
            ...jobData
          }
        ]
      };
      
      return await updatePageContent('careers', updatedCareersData);
    } catch (err) {
      console.error('Error adding job position:', err);
      setError(err.message);
      return false;
    }
  };

  // Remove job position from careers page
  const removeJobPosition = async (jobId) => {
    try {
      const currentCareersData = pagesData.careers || getDefaultCareersData();
      const updatedCareersData = {
        ...currentCareersData,
        jobPositions: (currentCareersData.jobPositions || []).filter(job => job.id !== jobId)
      };
      
      return await updatePageContent('careers', updatedCareersData);
    } catch (err) {
      console.error('Error removing job position:', err);
      setError(err.message);
      return false;
    }
  };

  // Update job position
  const updateJobPosition = async (jobId, updatedJobData) => {
    try {
      const currentCareersData = pagesData.careers || getDefaultCareersData();
      const updatedCareersData = {
        ...currentCareersData,
        jobPositions: (currentCareersData.jobPositions || []).map(job => 
          job.id === jobId ? { ...job, ...updatedJobData } : job
        )
      };
      
      return await updatePageContent('careers', updatedCareersData);
    } catch (err) {
      console.error('Error updating job position:', err);
      setError(err.message);
      return false;
    }
  };

  // Add social link to contact page
  const addSocialLink = async (linkData) => {
    try {
      const currentContactData = pagesData.contact || getDefaultContactData();
      const updatedContactData = {
        ...currentContactData,
        socialLinks: [
          ...(currentContactData.socialLinks || []),
          {
            id: Date.now().toString(),
            ...linkData
          }
        ]
      };
      
      return await updatePageContent('contact', updatedContactData);
    } catch (err) {
      console.error('Error adding social link:', err);
      setError(err.message);
      return false;
    }
  };

  // Remove social link from contact page
  const removeSocialLink = async (linkId) => {
    try {
      const currentContactData = pagesData.contact || getDefaultContactData();
      const updatedContactData = {
        ...currentContactData,
        socialLinks: (currentContactData.socialLinks || []).filter(link => link.id !== linkId)
      };
      
      return await updatePageContent('contact', updatedContactData);
    } catch (err) {
      console.error('Error removing social link:', err);
      setError(err.message);
      return false;
    }
  };

  // Export all pages data
  const exportPagesData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/export`);
      
      if (response.data.success) {
        return {
          exportedAt: new Date().toISOString(),
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to export pages data');
      }
    } catch (err) {
      console.error('Error exporting pages data:', err);
      setError(err.message);
      return null;
    }
  };

  // Import pages data
  const importPagesData = async (importData) => {
    try {
      setSaving(true);
      const response = await axios.post(`${API_BASE_URL}/api/frontend-pages/import`, importData);
      
      if (response.data.success) {
        // Refresh all data after import
        await fetchAllPagesData();
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to import pages data');
      }
    } catch (err) {
      console.error('Error importing pages data:', err);
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAllPagesData();
  }, []);

  return {
    // Data
    pagesData,
    loading,
    error,
    saving,
    
    // Page operations
    fetchPageData,
    updatePageContent,
    createPageContent,
    deletePageContent,
    
    // Job position operations
    addJobPosition,
    removeJobPosition,
    updateJobPosition,
    
    // Social link operations
    addSocialLink,
    removeSocialLink,
    
    // Bulk operations
    exportPagesData,
    importPagesData,
    refreshAllPages: fetchAllPagesData
  };
};

// Default data structures
const getDefaultContactData = () => ({
  title: "Get in Touch",
  subtitle: "Have questions? We'd love to hear from you.",
  description: "Send us a message and we'll respond as soon as possible.",
  formLabels: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    submitButton: "Send Message"
  },
  successMessage: "Thank you for your message! We'll get back to you soon.",
  errorMessage: "Sorry, there was an error sending your message. Please try again.",
  contactInfo: {
    email: "hello@fractionax.com",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Drive, Tech City, TC 12345"
  },
  socialLinks: [
    {
      id: "twitter",
      platform: "Twitter",
      url: "https://twitter.com/FractionaX",
      icon: "twitter"
    },
    {
      id: "linkedin", 
      platform: "LinkedIn",
      url: "https://linkedin.com/company/fractionax",
      icon: "linkedin"
    }
  ],
  mapAddress: "123 Innovation Drive, Tech City, TC 12345"
});

const getDefaultCareersData = () => ({
  title: "Be Part of the First 3",
  description: "Join us as we redefine real estate investing with blockchain, AI, and real utility.",
  ctaTitle: "Let's Build the Future—Together",
  ctaDescription: "Don't see a role that fits perfectly? Pitch us. We're open to game-changing talent.",
  ctaEmail: "careers@fractionax.com",
  jobPositions: [
    {
      id: "1",
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Part-time to Full-time",
      experience: "3+ years",
      description: "Work directly with the founder to build and scale our AI-driven real estate investment platform.",
      requirements: ["React/Node.js", "API development", "Startup mindset"],
      salary: "Equity + Cash (DOE)"
    },
    {
      id: "2",
      title: "Founding Product & Marketing Lead",
      department: "Product", 
      location: "Remote",
      type: "Part-time to Full-time",
      experience: "3+ years",
      description: "Drive early product strategy and help shape user experience with a hands-on approach.",
      requirements: ["Marketing & Product experience", "FinTech/PropTech interest", "Strong communicator"],
      salary: "Equity + Cash (DOE)"
    }
  ]
});
