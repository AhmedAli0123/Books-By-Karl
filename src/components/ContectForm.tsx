"use client"

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-contain bg-center mt-5"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="max-w-6xl w-full  p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-[40px] font-bold font-Spectral text-slate-200 ">Get all the latest Stephen King news and info sent to your inbox.!</h2>
          
        </div>
        <div className="md:w-1/2 bg-[#252231] p-6 rounded-lg shadow-md w-full">
          {submitted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Thank you.</h2>
              <p>A confirmation email has been sent to you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-[#DE3E16]">Newsletter Signup</h2>
              <div>
                <label className="block font-semibold">Your Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Country</label>
                <select className="w-full p-2 border rounded" required>
                  <option value="" disabled selected hidden>
                    Select One...
                  </option>
                  <option value="US">United States</option>
                  <option value="AF">Afghanistan</option>
                  <option value="PK">Pakistan</option>
                </select>
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" id="gdpr" required />
                <label htmlFor="gdpr">
                  I consent to receive updates and marketing emails.
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-800"
              >
                Sign Up
              </button>
            </form>
          )}
          <div className="mt-4 text-sm text-center">
            <a href="/privacy" className="text-[#DE3E16] hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}