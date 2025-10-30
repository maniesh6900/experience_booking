import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface PromoCodeInputProps {
  onApply: (discount: number) => void;
  onRemove: () => void;
  applied: boolean;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply, onRemove, applied }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.post('/promo/validate', { code: code.trim() });
      
      if (response.data.valid) {
        // For simplicity, we'll assume 10% discount for any valid code
        // In a real app, you'd calculate based on discountType and discountValue
        onApply(10); // 10% discount
        setError('');
      } else {
        setError(response.data.error || 'Invalid promo code');
      }
    } catch (err) {
      setError('Failed to validate promo code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    onRemove();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Promo Code</h3>
      
      {applied ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <span className="text-green-800 font-medium">Promo applied: {code}</span>
          <button 
            onClick={handleRemove}
            className="text-green-700 hover:text-green-900 font-medium"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PromoCodeInput;