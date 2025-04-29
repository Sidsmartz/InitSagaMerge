import React, { useState } from 'react';

export const GardenPreferences = ({ width, height, onClose, onSuggest, hideHeader = false }) => {
  const [preferences, setPreferences] = useState({
    sunlight: 'medium',
    plantType: 'mixed',
    purpose: '',
    experience: 'beginner',
    maintenance: 'medium',
    notes: ''
  });

  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error when user makes changes
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate required fields
      if (!preferences.purpose.trim()) {
        throw new Error('Please specify a garden purpose');
      }

      // Format the prompt for Gemini
      const prompt = `As a garden planning expert, provide suggestions for a ${width}x${height} grid garden layout with the following preferences:
      - Sunlight level: ${preferences.sunlight}
      - Plant types preferred: ${preferences.plantType}
      - Purpose: ${preferences.purpose}
      - Gardening experience: ${preferences.experience}
      - Maintenance level preferred: ${preferences.maintenance}
      Additional notes: ${preferences.notes}

      Please provide:
      1. Recommended plant layout (specify exact grid positions using the available plants)
      2. Specific plant suggestions and their placement coordinates
      3. Care tips based on the preferences
      4. Additional considerations for the layout

      Available plants for placement:
      - Potted Plant (1x1 tiles) - Best for small decorative plants
      - Palm Plant (3x3 tiles) - Large statement plant
      - Plant Vase (2x2 tiles) - Medium-sized decorative arrangement
      - Plant Collection (3x2 tiles) - Mixed variety arrangement

      Please format the response in a clear, structured way and ensure the suggested layout fits within the ${width}x${height} grid.`;

      const response = await onSuggest(prompt);
      setSuggestions(response);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setError(error.message || 'Failed to get suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideHeader ? "" : "fixed left-6 top-6 z-30 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 w-[400px] text-white max-h-[calc(100vh-4rem)] overflow-y-auto"}>
      {!hideHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-sans text-emerald-400">Garden Preferences</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Available Sunlight
          </label>
          <select
            name="sunlight"
            value={preferences.sunlight}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="low">Low Light</option>
            <option value="medium">Medium Light</option>
            <option value="high">Full Sun</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Plant Types
          </label>
          <select
            name="plantType"
            value={preferences.plantType}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="vegetables">Vegetables</option>
            <option value="herbs">Herbs</option>
            <option value="flowers">Flowers</option>
            <option value="mixed">Mixed Garden</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Garden Purpose
          </label>
          <input
            type="text"
            name="purpose"
            value={preferences.purpose}
            onChange={handleChange}
            placeholder="e.g., Food production, decoration, etc."
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Gardening Experience
          </label>
          <select
            name="experience"
            value={preferences.experience}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Maintenance Level
          </label>
          <select
            name="maintenance"
            value={preferences.maintenance}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="low">Low Maintenance</option>
            <option value="medium">Medium Maintenance</option>
            <option value="high">High Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={preferences.notes}
            onChange={handleChange}
            placeholder="Any specific requirements or preferences..."
            className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white h-24"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full ${loading 
            ? 'bg-emerald-500/50 cursor-not-allowed' 
            : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting Suggestions...
            </span>
          ) : 'Get Garden Suggestions'}
        </button>

        {suggestions && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">Suggestions</h3>
            <div className="text-white/90 whitespace-pre-line prose prose-invert prose-sm max-w-none">
              {suggestions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 