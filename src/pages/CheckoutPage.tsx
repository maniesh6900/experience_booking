import React, { useState, useEffect } from 'react';
import type { BookingData, Experience } from '../types';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import PromoCodeInput from '../components/PromoCodeInput';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<Omit<BookingData, 'experienceId' | 'date' | 'timeSlot'>>({
    fullName: '',
    email: '',
    promoCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        // Get selection from localStorage
        const selectionStr = localStorage.getItem('bookingSelection');
        if (!selectionStr) {
          navigate('/');
          return;
        }
        
        const selection = JSON.parse(selectionStr);
        
        // Fetch experience details
        const response = await apiClient.get<Experience>(`/experiences/${selection.experienceId}`);
        setExperience(response.data);
        
        // Set booking data with selection
        setBookingData(prev => ({
          ...prev,
          ...selection
        }));
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!bookingData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePromoApply = (discount: number) => {
    setPromoDiscount(discount);
    setBookingData(prev => ({ ...prev, promoCode: prev.promoCode }));
  };

  const handlePromoRemove = () => {
    setPromoDiscount(0);
    setBookingData(prev => ({ ...prev, promoCode: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !experience) return;
    
    setIsSubmitting(true);
    
    try {
      const bookingPayload: BookingData = {
        ...bookingData,
        experienceId: experience.id,
        date: (bookingData as any).date,
        timeSlot: (bookingData as any).timeSlot
      };
      
      const response = await apiClient.post('/bookings', bookingPayload);
      
      if (response.data.success) {
        // Clear selection
        localStorage.removeItem('bookingSelection');
        
        // Navigate to success page with booking ID
        navigate(`/result?bookingId=${response.data.bookingId}&success=true`);
      } else {
        navigate(`/result?success=false&error=${encodeURIComponent(response.data.error || 'Unknown error')}`);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Failed to process booking. Please try again.';
      navigate(`/result?success=false&error=${encodeURIComponent(errorMessage)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-red-800">Experience not found. Please go back and select an experience.</p>
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

  // Calculate total price
  const totalPrice = promoDiscount > 0 
    ? experience.price * (1 - promoDiscount / 100)
    : experience.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={bookingData.fullName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <PromoCodeInput
                    onApply={handlePromoApply}
                    onRemove={handlePromoRemove}
                    applied={promoDiscount > 0}
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
              
              {/* Right Column - Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="flex items-start mb-4">
                  <img 
                    src={experience.imageUrl} 
                    alt={experience.title} 
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{experience.title}</h3>
                    <p className="text-gray-600 text-sm">{experience.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {new Date((bookingData as any).date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{(bookingData as any).timeSlot}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{experience.duration}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">${experience.price.toFixed(2)}</span>
                    </div>
                    
                    {promoDiscount > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Promo Discount ({promoDiscount}%)</span>
                        <span className="font-medium text-green-600">
                          -${(experience.price * (promoDiscount / 100)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-indigo-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Note:</span> You'll receive a confirmation email with all details after booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;