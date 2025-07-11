import React, { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/common/Footer";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://api.fractionax.io/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("There was a problem sending your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#191d2b] text-white">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[450px] lg:h-[500px] text-white flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/blurred-city.jpg"
            alt="Blurred City Skyline"
            className="w-full h-full object-cover object-center filter blur-sm brightness-75"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Investor support, partner inquiries, or community collaboration — we're here for it all.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-sm text-white">
            <a
              href="https://discord.gg/fractionax"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
            >
              <i className="bi bi-discord text-lg"></i>
              Join Our Discord
            </a>
            <a
              href="/faq"
              className="inline-block underline hover:text-blue-300 transition text-center"
            >
              Visit FAQ
            </a>
          </div>
        </motion.div>
      </section>

      {/* Form & Info */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="bg-[#262a3b] p-6 rounded-lg shadow-lg w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            {submitted ? (
              <p className="text-green-400 font-semibold">
                ✅ Message sent successfully. We’ll get back to you shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-3 rounded text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Box */}
          <motion.div
            className="bg-[#262a3b] p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <ul className="space-y-4 text-sm">
              <li><strong>Email:</strong> <a href="mailto:support@fractionax.io" className="text-blue-400 hover:underline">support@fractionax.io</a></li>
              <li><strong>Phone:</strong> <a href="tel:+17133096573" className="text-blue-400 hover:underline">+1 (713) 309-6573</a></li>
              <li><strong>Location:</strong> 200 Continental Drive, Suite 401, Newark, DE 19713</li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-4 text-xl text-blue-400">
                <a href="#"><i className="bi bi-twitter hover:text-white"></i></a>
                <a href="#"><i className="bi bi-linkedin hover:text-white"></i></a>
                <a href="#"><i className="bi bi-instagram hover:text-white"></i></a>
                <a href="#"><i className="bi bi-discord hover:text-white"></i></a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20 px-6 md:px-12 lg:px-24">
        <motion.div
          className="rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <iframe
            title="FractionaX Headquarters"
            src="https://maps.google.com/maps?q=200%20Continental%20Drive%20Suite%20401%2C%20Newark%2C%20DE%2019713&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            className="rounded-lg"
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
