import React, { useState, useEffect } from 'react';
import type { Experience } from '../types';
import apiClient from '../api/apiClient';
import ExperienceCard from '../components/ExperienceCard';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await apiClient.get<Experience[]>('/experiences');
        setExperiences(response.data);
      } catch (err) {
        setError('Failed to load experiences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleExperienceClick = (id: string) => {
    navigate(`/experience/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Experiences</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Book unforgettable travel experiences with local experts. Limited spots available!
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No experiences available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onClick={() => handleExperienceClick(experience.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;