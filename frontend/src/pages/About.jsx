import React from 'react'
import MainLayout from '../layouts/MainLayout'

const TechBadge = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                   border border-gray-200 bg-white/90 text-gray-700 mr-2 mb-2">
    {children}
  </span>
)

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white/90 p-4 text-center">
    <div className="text-2xl font-extrabold">{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
)

const About = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto mt-8 px-2 sm:px-0">
        {/* Hero */}
        <header className="text-center">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight
                       gradient-accent bg-clip-text text-transparent"
          >
            About Yaadein
          </h1>
          <p className="mt-3 text-gray-700">
            A private image hub to create folders, upload images with metadata, and share via QR codes —
            built with care for speed, security, and simplicity.
          </p>
        </header>

        {/* Content cards */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white/90 p-5">
            <h3 className="font-semibold">What it does</h3>
            <p className="mt-2 text-sm text-gray-700">
              Organize images into folders, add <strong>title/description/tags</strong>, and generate
              <strong> QR codes</strong> for quick sharing. Admin controls and per-user permissions included.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/90 p-5">
            <h3 className="font-semibold">Why it’s reliable</h3>
            <p className="mt-2 text-sm text-gray-700">
              Authenticated APIs, secure uploads to Cloudinary, and strict ownership checks ensure
              only the right people can view or delete content.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/90 p-5">
            <h3 className="font-semibold">How it feels</h3>
            <p className="mt-2 text-sm text-gray-700">
              Snappy UX with polished visuals, responsive layouts, and a thoughtful dark mode so it
              looks great day or night.
            </p>
          </div>
        </section>

        {/* Tech stack + tiny stats */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white/90 p-5 md:col-span-2">
            <h3 className="font-semibold mb-2">Tech stack</h3>
            <div>
              <TechBadge>React</TechBadge>
              <TechBadge>Vite</TechBadge>
              <TechBadge>Tailwind</TechBadge>
              <TechBadge>Node.js</TechBadge>
              <TechBadge>Express</TechBadge>
              <TechBadge>MongoDB</TechBadge>
              <TechBadge>Cloudinary</TechBadge>
              <TechBadge>JWT Auth</TechBadge>
            </div>
            <p className="mt-3 text-sm text-gray-700">
              Clean separation of concerns, Axios with JWT interceptors, and Cloudinary for optimized media delivery.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Privacy" value="🔒" />
            <Stat label="Speed" value="⚡" />
            <Stat label="Uptime" value="99%" />
          </div>
        </section>

        {/* Callout */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white/90 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Your memories, your rules.</h3>
            <p className="text-sm text-gray-700">
              Keep everything organized, secure, and instantly shareable.
            </p>
          </div>
          <a
            href="/dashboard"
            className="app-btn inline-flex items-center px-4 py-2 rounded-md font-medium"
          >
            Go to Dashboard →
          </a>
        </section>
      </div>
    </MainLayout>
  )
}

export default About
