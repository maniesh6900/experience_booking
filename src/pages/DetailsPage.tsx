import React, { useState, useEffect } from 'react';
import type { ExperienceDetails } from '../types';
import apiClient from '../api/apiClient';
import { useParams, useNavigate } from 'react-router-dom';
import SlotSelector from '../components/SlotSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) {
        setError('Invalid experience ID');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ExperienceDetails>(`/experiences/${id}`);
        setExperience(response.data);
        
        // Auto-select first available date and slot
        if (response.data.availableDates.length > 0) {
          const firstDate = response.data.availableDates[0].date;
          setSelectedDate(firstDate);
          setSelectedSlot(response.data.availableDates[0].availableSlots[0]);
        }
      } catch (err) {
        setError('Failed to load experience details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }
    
    // Store selection in localStorage for checkout
    localStorage.setItem('bookingSelection', JSON.stringify({
      experienceId: id,
      date: selectedDate,
      timeSlot: selectedSlot
    }));
    
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-red-800">{error || 'Experience not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Experiences
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img 
              src={experience.imageUrl} 
              alt={experience.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
            {experience.originalPrice > experience.price && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                SAVE ${(experience.originalPrice - experience.price).toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{experience.title}</h1>
                <p className="text-gray-600 mt-1">{experience.location}</p>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Local Guide</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold text-indigo-600">
                  ${experience.price.toFixed(2)}
                </div>
                {experience.originalPrice > experience.price && (
                  <div className="text-lg text-gray-500 line-through mt-1">
                    ${experience.originalPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this experience</h2>
              <p className="text-gray-700 leading-relaxed">{experience.description}</p>
            </div>
            
            <div className="mt-8">
              <SlotSelector
                availableDates={experience.availableDates}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={setSelectedDate}
                onSlotSelect={setSelectedSlot}
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleContinue}
                disabled={!selectedDate || !selectedSlot}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;