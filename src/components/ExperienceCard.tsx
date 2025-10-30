import React from 'react';
import type { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
  onClick: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={experience.imageUrl} 
          alt={experience.title} 
          className="w-full h-48 object-cover"
        />
        {experience.originalPrice > experience.price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">{experience.title}</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">
              ${experience.price.toFixed(2)}
            </div>
            {experience.originalPrice > experience.price && (
              <div className="text-sm text-gray-500 line-through">
                ${experience.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-600 mt-1 text-sm">{experience.location}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {experience.duration}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;