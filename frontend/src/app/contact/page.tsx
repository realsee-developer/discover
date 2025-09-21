import React from "react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-base-content/80 mb-6">
            Have a project in mind or need assistance? Reach out to our team or join the Realsee creator community.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="iconify text-primary" data-icon="heroicons:envelope" data-width="18"></span>
              <span>support@realsee.ai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="iconify text-primary" data-icon="heroicons:phone" data-width="18"></span>
              <span>+1 (555) 000-0000</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="iconify text-primary" data-icon="heroicons:map-pin" data-width="18"></span>
              <span>New York, NY</span>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <a href="https://home.realsee.ai/en/contact-us" target="_blank" className="btn btn-primary">Contact Sales</a>
            <a href="/photographer" className="btn btn-outline">Join Community</a>
          </div>
        </div>

        {/* Form */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Send a message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="input input-bordered" placeholder="First name" />
              <input className="input input-bordered" placeholder="Last name" />
              <input className="input input-bordered sm:col-span-2" placeholder="Email" />
              <input className="input input-bordered sm:col-span-2" placeholder="Company (optional)" />
              <select className="select select-bordered sm:col-span-2">
                <option>General Inquiry</option>
                <option>Sales</option>
                <option>Support</option>
              </select>
              <textarea className="textarea textarea-bordered sm:col-span-2" placeholder="Tell us about your project" rows={6}></textarea>
            </div>
            <div className="card-actions justify-end mt-2">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


