'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  email_id: string;
  created_at: string;
}

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'cities'>('cities');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; school: School | null }>({ show: false, school: null });
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 12;

  // Calculate cities and city groups only when schools data is available
  const cities = schools.length > 0 ? Array.from(new Set(schools.map(s => s.city))).sort() : [];
  
  // Group schools by city for cities view
  const cityGroups = cities.map(city => ({
    city,
    schools: schools.filter(s => s.city === city),
    schoolCount: schools.filter(s => s.city === city).length
  }));

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    let filtered = schools;

    if (searchTerm) {
      // First check if search term matches any school name exactly
      const nameMatches = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // If we found school name matches, only show those schools
      if (nameMatches.length > 0) {
        filtered = nameMatches;
        // Switch to list view when searching for schools
        setViewMode('list');
      } else {
        // If no school name matches, then search in city and address
        filtered = filtered.filter(school =>
          school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Switch to list view when searching
        if (filtered.length > 0) {
          setViewMode('list');
        }
      }
      
      // If search term is a complete school name, show only exact matches
      const exactNameMatch = schools.find(school =>
        school.name.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactNameMatch) {
        filtered = [exactNameMatch];
        setViewMode('list');
      }
    }

    if (selectedCity) {
      filtered = filtered.filter(school => school.city === selectedCity);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'city': return a.city.localeCompare(b.city);
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });

    setFilteredSchools(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCity, sortBy, schools]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      setSchools(data);
      setFilteredSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (schoolId: number) => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete school');
      }
      
      // Remove from local state
      setSchools(prev => prev.filter(school => school.id !== schoolId));
      setDeleteModal({ show: false, school: null });
      
    } catch (err) {
      console.error('Error deleting school:', err);
      alert('Failed to delete school. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSchools = filteredSchools.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSortBy('name');
  };

  // Function to get city image and theme
  const getCityTheme = (cityName: string) => {
    const city = cityName.toLowerCase();
    
    if (city.includes('hyderabad')) {
      return {
        image: 'https://images.unsplash.com/photo-1750834115164-8c2658f18dd0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ3fHxoeWRlcmFiYWR8ZW58MHx8MHx8fDA%3D',
        gradient: 'from-orange-400 to-red-500',
        nickname: 'City of Pearls'
      };
    }
    if (city.includes('vijayawada')) {
      return {
        image: 'https://images.unsplash.com/photo-1700310633830-74095f9f70c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmlqYXlhd2FkYSUyMGFuZGhyYSUyMHByYWRlc2h8ZW58MHx8MHx8fDA%3D',
        gradient: 'from-blue-400 to-purple-500',
        nickname: 'City of Victory'
      };
    }
    if (city.includes('mumbai')) {
      return {
        image: 'https://images.unsplash.com/photo-1598434192043-71111c1b3f41?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE11bWJhaXxlbnwwfHwwfHx8MA%3D%3D',
        gradient: 'from-indigo-400 to-blue-500',
        nickname: 'City of Dreams'
      };
    }
    if (city.includes('delhi')) {
      return {
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVsaGl8ZW58MHx8MHx8fDA%3D',
        gradient: 'from-green-400 to-teal-500',
        nickname: 'Heart of India'
      };
    }
    if (city.includes('bengaluru')) {
      return {
        image: 'https://images.unsplash.com/photo-1675589412450-571c4a5afe6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFuZ2Fsb3JlJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D',
        gradient: 'from-emerald-400 to-green-500',
        nickname: 'Garden City'
      };
    }
    if (city.includes('chennai')) {
      return {
        image: 'https://images.unsplash.com/photo-1661366698983-3cb843219300?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hlbm5haXxlbnwwfHwwfHx8MA%3D%3D',
        gradient: 'from-cyan-400 to-blue-500',
        nickname: 'Gateway to South'
      };
    }
    if (city.includes('kolkata')) {
      return {
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8S29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D',
        gradient: 'from-yellow-400 to-orange-500',
        nickname: 'City of Joy'
      };
    }
    if (city.includes('pune')) {
      return {
        image: 'https://images.unsplash.com/photo-1652144570437-37207890d993?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHVuZSUyMGluZGlhfGVufDB8fDB8fHww',
        gradient: 'from-purple-400 to-pink-500',
        nickname: 'Oxford of East'
      };
    }
    
    // Default theme for other cities
    return {
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      gradient: 'from-purple-100 to-pink-100',
      nickname: 'Educational Hub'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-white border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-ping"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading Schools...</h3>
          <p className="text-white/80">Discovering amazing educational institutions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-white/20">
          <div className="text-red-200 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-white/80 mb-6">{error}</p>
          <button 
            onClick={fetchSchools} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                School Directory
              </h1>
              <p className="text-xl text-white/90">Discover amazing educational institutions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </button>
              <a 
                href="/" 
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add School
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search schools by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-6 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 text-lg bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-6 border border-purple-200/50 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-3">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 bg-white/90 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-3">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 bg-white/90 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="city">City</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
                                 <div>
                   <label className="block text-sm font-semibold text-purple-700 mb-3">View</label>
                   <div className="flex border-2 border-purple-200 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm">
                     <button
                       onClick={() => setViewMode('cities')}
                       className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-300 ${viewMode === 'cities' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-purple-700 hover:bg-purple-50'}`}
                     >
                       Cities
                     </button>
                     <button
                       onClick={() => setViewMode('grid')}
                       className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-purple-700 hover:bg-purple-50'}`}
                     >
                       Grid
                     </button>
                     <button
                       onClick={() => setViewMode('list')}
                       className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-purple-700 hover:bg-purple-50'}`}
                     >
                       List
                     </button>
                   </div>
                 </div>
              </div>
              {(searchTerm || selectedCity || sortBy !== 'name') && (
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <button 
                    onClick={clearFilters} 
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors duration-300"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {schools.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-4">No schools found</h3>
            <p className="text-xl text-gray-600 mb-8">Be the first to add a school!</p>
            <a 
              href="/" 
              className="inline-flex items-center px-10 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Add First School
            </a>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-4">
                {(selectedCity || viewMode !== 'cities') && (
                  <button
                    onClick={() => {
                      setSelectedCity('');
                      setViewMode('cities');
                      setSearchTerm('');
                      setSortBy('name');
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-purple-600 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all duration-300"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Cities
                  </button>
                )}
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedCity ? `Schools in ${selectedCity}` : `${filteredSchools.length} of ${schools.length} Schools`}
                </h2>
              </div>
              <div className="text-sm text-purple-600 font-semibold bg-purple-100 px-4 py-2 rounded-full">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No schools found</h3>
                <button 
                  onClick={clearFilters} 
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
                >
                  View all schools
                </button>
              </div>
                         ) : (
               <>
                 {viewMode === 'cities' && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                     {cityGroups.map((cityGroup, index) => {
                       const theme = getCityTheme(cityGroup.city);
                       return (
                         <div 
                           key={cityGroup.city}
                           className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                           style={{ animationDelay: `${index * 100}ms` }}
                           onClick={() => {
                             setSelectedCity(cityGroup.city);
                             setViewMode('list');
                           }}
                         >
                           <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-purple-100 transition-all duration-500 group-hover:border-purple-300 relative">
                             <div className="relative h-48 overflow-hidden">
                               {/* Background Image with Fallback */}
                               <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}>
                                 <Image
                                   src={theme.image}
                                   alt={`${cityGroup.city} city`}
                                   fill
                                   className="object-cover"
                                   onError={(e) => {
                                     // Hide image on error, show gradient background
                                     e.currentTarget.style.display = 'none';
                                   }}
                                 />
                               </div>
                               
                               {/* Gradient Overlay */}
                               <div className="absolute inset-0 bg-black/40"></div>
                               
                                                               {/* City Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-white text-center">
                                    <div className="text-lg font-bold mb-1">{cityGroup.city}</div>
                                    <div className="text-xs opacity-90">{theme.nickname}</div>
                                  </div>
                                </div>
                               
                               {/* School Count Badge */}
                               <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                 {cityGroup.schoolCount} {cityGroup.schoolCount === 1 ? 'School' : 'Schools'}
                               </div>
                               
                               {/* Hover Overlay */}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                             </div>
                             
                             <div className="p-6 text-center">
                               <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                 Best Schools in {cityGroup.city}
                               </h3>
                               <p className="text-sm text-gray-600 mb-4">
                                 {cityGroup.schoolCount} {cityGroup.schoolCount === 1 ? 'educational institution' : 'educational institutions'} available
                               </p>
                               <div className="flex items-center justify-center space-x-2">
                                 <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                 <span className="text-xs text-gray-500 font-medium">Active Directory</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 )}

                 {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentSchools.map((school, index) => (
                                             <div 
                         key={school.id} 
                         className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                         style={{ animationDelay: `${index * 100}ms` }}
                         onClick={() => window.location.href = `/schools/${school.id}`}
                       >
                         <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-purple-100 transition-all duration-500 group-hover:border-purple-300 relative">
                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ show: true, school });
                            }}
                            className="absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                            title="Delete School"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                            {school.image ? (
                              <Image
                                src={school.image}
                                alt={school.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-6">
                                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {school.city}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                              {school.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{school.address}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-purple-700">{school.city}, {school.state}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500 font-medium">Active</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {currentSchools.map((school, index) => (
                                             <div 
                         key={school.id} 
                         className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-100 group cursor-pointer transform hover:scale-[1.02] relative"
                         style={{ animationDelay: `${index * 100}ms` }}
                         onClick={() => window.location.href = `/schools/${school.id}`}
                       >
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ show: true, school });
                          }}
                          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                          title="Delete School"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <div className="flex">
                          <div className="relative w-56 h-40 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden rounded-l-2xl">
                            {school.image ? (
                              <Image
                                src={school.image}
                                alt={school.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="200px"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-4">
                                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">{school.name}</h3>
                            <p className="text-gray-600 mb-4">{school.address}</p>
                            <div className="flex items-center space-x-6 text-sm">
                              <span className="text-purple-700 font-semibold">{school.city}, {school.state}</span>
                              <span className="text-gray-500">{school.contact}</span>
                              <span className="text-gray-500">{school.email_id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <nav className="flex items-center space-x-3">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-3 text-sm font-semibold text-purple-600 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                              : 'text-purple-600 bg-white border-2 border-purple-200 hover:bg-purple-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-3 text-sm font-semibold text-purple-600 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}


          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.school && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete School</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-purple-600">{deleteModal.school.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, school: null })}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-300"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSchool(deleteModal.school!.id)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {deleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete School'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
