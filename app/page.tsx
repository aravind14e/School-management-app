'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface SchoolFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  about: string;
  academic_programs: string;
  facilities: string;
  website: string;
  established_year: string;
  principal_name: string;
  total_students: string;
  board_affiliation: string;
}

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchoolFormData>();

  const onSubmit = async (data: SchoolFormData) => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      formData.append('about', data.about || '');
      formData.append('academic_programs', data.academic_programs || '');
      formData.append('facilities', data.facilities || '');
      formData.append('website', data.website || '');
      formData.append('established_year', data.established_year || '');
      formData.append('principal_name', data.principal_name || '');
      formData.append('total_students', data.total_students || '');
      formData.append('board_affiliation', data.board_affiliation || '');
      formData.append('image', selectedFile);

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add school');
      }
    } catch (error) {
      console.error('Error adding school:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New School</h2>
        
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            School added successfully!
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error adding school. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">
              School Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'School name is required' })}
              className="form-input"
              placeholder="Enter school name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <textarea
              id="address"
              {...register('address', { required: 'Address is required' })}
              className="form-input"
              rows={3}
              placeholder="Enter school address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <input
                id="city"
                type="text"
                {...register('city', { required: 'City is required' })}
                className="form-input"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="form-label">
                State *
              </label>
              <input
                id="state"
                type="text"
                {...register('state', { required: 'State is required' })}
                className="form-input"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="contact" className="form-label">
              Contact Number *
            </label>
            <input
              id="contact"
              type="tel"
              {...register('contact', {
                required: 'Contact number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Contact number must be exactly 10 digits',
                },
              })}
              className="form-input"
              placeholder="Enter 10-digit contact number"
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email_id" className="form-label">
              Email Address *
            </label>
            <input
              id="email_id"
              type="email"
              {...register('email_id', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className="form-input"
              placeholder="Enter email address"
            />
            {errors.email_id && (
              <p className="mt-1 text-sm text-red-600">{errors.email_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="image" className="form-label">
              School Image *
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input"
              required
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Comprehensive School Information Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comprehensive School Information</h3>
            
            <div>
              <label htmlFor="about" className="form-label">
                About School
              </label>
              <textarea
                id="about"
                {...register('about')}
                className="form-input"
                rows={4}
                placeholder="Describe the school's mission, vision, and unique features..."
              />
            </div>

            <div>
              <label htmlFor="academic_programs" className="form-label">
                Academic Programs
              </label>
              <textarea
                id="academic_programs"
                {...register('academic_programs')}
                className="form-input"
                rows={3}
                placeholder="List academic programs, courses, and specializations offered..."
              />
            </div>

            <div>
              <label htmlFor="facilities" className="form-label">
                School Facilities
              </label>
              <textarea
                id="facilities"
                {...register('facilities')}
                className="form-input"
                rows={3}
                placeholder="Describe available facilities like labs, library, sports, etc..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  {...register('website')}
                  className="form-input"
                  placeholder="https://www.schoolname.com"
                />
              </div>

              <div>
                <label htmlFor="established_year" className="form-label">
                  Established Year
                </label>
                <input
                  id="established_year"
                  type="text"
                  {...register('established_year')}
                  className="form-input"
                  placeholder="e.g., 1995"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="principal_name" className="form-label">
                  Principal Name
                </label>
                <input
                  id="principal_name"
                  type="text"
                  {...register('principal_name')}
                  className="form-input"
                  placeholder="Enter principal's name"
                />
              </div>

              <div>
                <label htmlFor="total_students" className="form-label">
                  Total Students
                </label>
                <input
                  id="total_students"
                  type="text"
                  {...register('total_students')}
                  className="form-input"
                  placeholder="e.g., 500+ students"
                />
              </div>
            </div>

            <div>
              <label htmlFor="board_affiliation" className="form-label">
                Board Affiliation
              </label>
              <input
                id="board_affiliation"
                type="text"
                {...register('board_affiliation')}
                className="form-input"
                placeholder="e.g., CBSE, ICSE, State Board, etc."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedFile(null);
                setSubmitStatus('idle');
              }}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding School...' : 'Add School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
