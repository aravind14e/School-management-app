'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  email_id: string;
  about?: string;
  academic_programs?: string;
  facilities?: string;
  website?: string;
  established_year?: string;
  principal_name?: string;
  total_students?: string;
  board_affiliation?: string;
  created_at: string;
}

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchool();
  }, [params.id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const schools = await response.json();
      const foundSchool = schools.find((s: School) => s.id === parseInt(params.id));
      
      if (!foundSchool) {
        setError('School not found');
        return;
      }
      
      setSchool(foundSchool);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-white border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-ping"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading School Details...</h3>
          <p className="text-white/80">Fetching comprehensive information</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-white/20">
          <div className="text-red-200 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">School Not Found</h3>
          <p className="text-white/80 mb-6">{error || 'The requested school could not be found.'}</p>
          <Link 
            href="/showSchools"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Schools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 shadow-2xl border-b border-white/20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="mb-6 lg:mb-0">
              <Link href="/showSchools" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors duration-300">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Schools
              </Link>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                {school.name}
              </h1>
              <p className="text-xl text-white/90">Comprehensive School Information</p>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* School Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 sticky top-8">
              <div className="relative h-80 lg:h-96 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                {school.image ? (
                  <Image
                    src={school.image}
                    alt={school.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-12">
                      <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {school.city}, {school.state}
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium w-20">Phone:</span>
                        <span className="ml-2">{school.contact}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium w-20">Email:</span>
                        <span className="ml-2">{school.email_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start text-gray-600">
                        <span className="font-medium w-20">Address:</span>
                        <span className="ml-2">{school.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium w-20">City:</span>
                        <span className="ml-2">{school.city}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium w-20">State:</span>
                        <span className="ml-2">{school.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* School Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      School Status
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 font-medium">Active & Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School Details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="h-8 w-8 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About {school.name}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {school.about ? (
                    <p className="text-lg leading-relaxed mb-6">{school.about}</p>
                  ) : (
                    <>
                      <p className="text-lg leading-relaxed mb-6">
                        {school.name} is a distinguished educational institution located in the vibrant city of {school.city}, {school.state}. 
                        Our school is committed to providing excellence in education and fostering a nurturing environment where students 
                        can thrive academically, socially, and personally.
                      </p>
                      <p className="text-lg leading-relaxed mb-6">
                        With a rich history of academic achievement and a dedicated team of educators, we strive to empower our students 
                        with the knowledge, skills, and values they need to succeed in an ever-changing world. Our comprehensive curriculum 
                        is designed to challenge and inspire students at every level.
                      </p>
                      <p className="text-lg leading-relaxed">
                        At {school.name}, we believe in the importance of holistic development. Beyond academics, we offer a wide range 
                        of extracurricular activities, sports programs, and community service opportunities that help students develop 
                        leadership skills, creativity, and a sense of social responsibility.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Comprehensive School Information */}
              {(school.established_year || school.principal_name || school.total_students || school.board_affiliation || school.website) && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="h-8 w-8 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    School Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {school.established_year && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Established</h3>
                        <p className="text-2xl font-bold text-purple-600">{school.established_year}</p>
                      </div>
                    )}
                    {school.principal_name && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Principal</h3>
                        <p className="text-lg text-blue-600 font-medium">{school.principal_name}</p>
                      </div>
                    )}
                    {school.total_students && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Students</h3>
                        <p className="text-2xl font-bold text-green-600">{school.total_students}</p>
                      </div>
                    )}
                    {school.board_affiliation && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Board Affiliation</h3>
                        <p className="text-lg text-orange-600 font-medium">{school.board_affiliation}</p>
                      </div>
                    )}
                    {school.website && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Website</h3>
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Academic Programs */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="h-8 w-8 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academic Programs
                </h2>
                {school.academic_programs ? (
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="text-lg leading-relaxed">{school.academic_programs}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Primary Education</h3>
                      <p className="text-gray-600 mb-4">Comprehensive foundation programs for young learners focusing on core subjects and character development.</p>
                      <div className="flex items-center text-sm text-purple-600 font-medium">
                        <span>Grades 1-5</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Secondary Education</h3>
                      <p className="text-gray-600 mb-4">Advanced academic programs preparing students for higher education and future careers.</p>
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <span>Grades 6-12</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Specialized Programs</h3>
                      <p className="text-gray-600 mb-4">STEM, arts, sports, and vocational training programs to cater to diverse student interests.</p>
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <span>All Ages</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Extracurricular Activities</h3>
                      <p className="text-gray-600 mb-4">Sports, music, drama, debate, and various clubs to enhance student development.</p>
                      <div className="flex items-center text-sm text-orange-600 font-medium">
                        <span>After School</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="h-8 w-8 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  School Facilities
                </h2>
                {school.facilities ? (
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="text-lg leading-relaxed">{school.facilities}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Modern Classrooms', icon: '🏫', desc: 'Well-equipped classrooms with modern technology' },
                      { name: 'Science Labs', icon: '🧪', desc: 'State-of-the-art laboratories for practical learning' },
                      { name: 'Library', icon: '📚', desc: 'Extensive collection of books and digital resources' },
                      { name: 'Sports Ground', icon: '⚽', desc: 'Large playground for various sports activities' },
                      { name: 'Computer Lab', icon: '💻', desc: 'Computer facilities with latest technology' },
                      { name: 'Cafeteria', icon: '🍽️', desc: 'Clean and hygienic dining facilities' }
                    ].map((facility, index) => (
                      <div key={index} className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="text-4xl mb-3">{facility.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{facility.name}</h3>
                        <p className="text-sm text-gray-600">{facility.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact & Visit */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get in Touch
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{school.contact}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{school.email_id}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Visit Us</h3>
                    <p className="mb-4">We welcome parents and students to visit our campus and experience our educational environment firsthand.</p>
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                      Schedule a Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
