import React, { useState } from 'react';
import type { AvailableDate } from '../types';

interface SlotSelectorProps {
  availableDates: AvailableDate[];
  selectedDate: string | null;
  selectedSlot: string | null;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: string) => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({ 
  availableDates, 
  selectedDate, 
  selectedSlot, 
  onDateSelect, 
  onSlotSelect 
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const toggleDate = (date: string) => {
    if (expandedDate === date) {
      setExpandedDate(null);
    } else {
      setExpandedDate(date);
      if (selectedDate !== date) {
        onDateSelect(date);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
      
      {availableDates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No available dates for the next 30 days. Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableDates.map((dateItem) => (
            <div 
              key={dateItem.date} 
              className={`border rounded-lg overflow-hidden ${selectedDate === dateItem.date ? 'border-indigo-500' : 'border-gray-200'}`}
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50"
                onClick={() => toggleDate(dateItem.date)}
              >
                <div>
                  <span className="font-medium">
                    {new Date(dateItem.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transition-transform ${expandedDate === dateItem.date ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {expandedDate === dateItem.date && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {dateItem.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          selectedSlot === slot
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                        onClick={() => onSlotSelect(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
