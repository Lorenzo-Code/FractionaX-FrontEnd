import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Hook for fetching all frontend pages content
export const useFrontendPagesData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/content`);
        
        if (response.data.success) {
          setData(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.error || 'Failed to fetch frontend pages data');
        }
      } catch (err) {
        console.error('Error fetching frontend pages data:', err);
        setError(err.message);
        // Keep any existing data on error to prevent page breaking
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Hook for fetching specific page content
export const usePageContent = (pageName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageName) return;

    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/content/${pageName}`);
        
        if (response.data.success) {
          setData(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.error || `Failed to fetch ${pageName} page data`);
        }
      } catch (err) {
        console.error(`Error fetching ${pageName} page data:`, err);
        setError(err.message);
        // Provide fallback data based on page type
        setData(getFallbackData(pageName));
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageName]);

  return { data, loading, error };
};

// Fallback data in case API fails
const getFallbackData = (pageName) => {
  const fallbacks = {
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that works for your investment goals",
      plans: [
        {
          id: "starter",
          name: "Starter",
          price: 0,
          period: "monthly",
          description: "Perfect for beginners exploring fractional real estate",
          features: [
            "Access to basic property listings",
            "Monthly market reports",
            "Community forum access",
            "Educational resources"
          ],
          popular: false,
          buttonText: "Get Started",
          buttonLink: "/signup",
          active: true
        },
        {
          id: "pro",
          name: "Pro", 
          price: 29.99,
          period: "monthly",
          description: "Advanced features for serious investors",
          features: [
            "Everything in Starter",
            "Premium property insights",
            "Advanced analytics dashboard",
            "Priority customer support"
          ],
          popular: true,
          buttonText: "Upgrade to Pro",
          buttonLink: "/signup?plan=pro",
          active: true
        }
      ]
    },
    
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about FractionaX",
      categories: [
        {
          id: "getting-started",
          name: "Getting Started",
          icon: "rocket",
          questions: [
            {
              id: "faq-1",
              question: "What is FractionaX?",
              answer: "FractionaX is a blockchain-powered platform that enables fractional ownership of real estate through tokenization.",
              tags: ["platform", "blockchain"],
              active: true
            }
          ]
        }
      ]
    },

    'how-it-works': {
      title: "How FractionaX Works",
      subtitle: "Simple steps to start investing in fractional real estate",
      steps: [
        {
          id: "step-1",
          title: "Sign Up & Verify",
          description: "Create your account and complete our quick verification process",
          icon: "user-plus",
          order: 1
        },
        {
          id: "step-2", 
          title: "Fund Your Wallet",
          description: "Add funds to your FractionaX wallet using various payment methods",
          icon: "wallet",
          order: 2
        }
      ]
    },

    'property-marketplace': {
      title: "Property Marketplace",
      subtitle: "Explore premium fractional real estate investment opportunities",
      mockProperties: [
        {
          id: "fallback-1",
          title: "Premium Property",
          description: "High-quality real estate investment opportunity",
          price: 1000000,
          location: "Premium Location",
          roi: 10.0,
          status: "active"
        }
      ]
    },

    careers: {
      title: "Join Our Team",
      subtitle: "Help us revolutionize real estate investment",
      companyDescription: "At FractionaX, we're building the future of real estate investment.",
      openPositions: []
    },

    contact: {
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      contactMethods: [
        {
          id: "email",
          type: "email",
          label: "Support",
          value: "support@fractionax.com",
          icon: "envelope",
          primary: true
        }
      ]
    },

    about: {
      title: "About FractionaX",
      subtitle: "Democratizing real estate investment through blockchain technology",
      mission: {
        title: "Our Mission",
        description: "To democratize real estate investment by providing accessible, transparent, and secure fractional ownership opportunities."
      }
    }
  };

  return fallbacks[pageName] || {};
};

// Hook for global settings
export const useGlobalSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/frontend-pages/content/global-settings`);
        
        if (response.data.success) {
          setSettings(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.error || 'Failed to fetch global settings');
        }
      } catch (err) {
        console.error('Error fetching global settings:', err);
        setError(err.message);
        // Provide fallback settings
        setSettings({
          siteName: "FractionaX",
          tagline: "Fractional Real Estate Investment Platform",
          features: {
            enableNewsletter: true,
            enableLiveChat: true,
            maintenanceMode: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
