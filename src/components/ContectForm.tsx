"use client"

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of countries
const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          country: formData.country,
          message: formData.message,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          country: "",
          message: "",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center mt-5"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="max-w-6xl w-full p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-8 ">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold font-Spectral text-slate-200 leading-tight">
            Get all the latest Karl's news and info sent to your inbox!
          </h2>
          <p className="mt-4 text-slate-50 text-lg">
            Stay updated with exclusive content, new releases, and special announcements.
          </p>
        </div>
        <div className="md:w-1/2 bg-[#252231]/95 p-8 rounded-xl shadow-xl w-full backdrop-blur-sm">
          {submitted ? (
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-[#DE3E16]">Thank You!</h2>
              <p className="text-slate-300">A confirmation email has been sent to you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-[#DE3E16] mb-6">Newsletter Signup</h2>
              <div className="space-y-2">
                <label className="block font-semibold text-slate-200">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE3E16] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-slate-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE3E16] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-slate-200">Country</label>
                <Select 
                  onValueChange={(value) => {
                    setSelectedCountry(value);
                    setFormData(prev => ({ ...prev, country: value }));
                  }} 
                  required
                >
                  <SelectTrigger className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-200">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border border-slate-600">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-slate-200">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message (optional)"
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DE3E16] focus:border-transparent transition-all min-h-[100px] resize-y"
                />
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="gdpr"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800/50 text-[#DE3E16] focus:ring-[#DE3E16]"
                />
                <label htmlFor="gdpr" className="text-sm text-slate-300">
                  I consent to receive updates and marketing emails.
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#DE3E16] text-white py-3 rounded-lg hover:bg-[#b83312] transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Sign Up"}
              </button>
            </form>
          )}
          <div className="mt-6 text-sm text-center">
            <a href="/privacy" className="text-[#DE3E16] hover:text-[#b83312] transition-colors duration-200">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}