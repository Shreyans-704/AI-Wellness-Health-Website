import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles, Loader2, X } from "lucide-react";
import { GeminiQueryRequest, GeminiQueryResponse } from "@shared/gemini";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Helper function to get the correct API endpoint
  const getApiEndpoint = () => {
    // Check if we're in development (localhost)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return '/api/gemini';  // Local development
      }
    }
    return '/.netlify/functions/gemini';  // Production
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError("");
    setShowResults(true);
    
    try {
      const requestData: GeminiQueryRequest = { query: query.trim() };
      const endpoint = getApiEndpoint();
      
      console.log('Making request to:', endpoint); // Debug log
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Response status:', res.status); // Debug log
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: GeminiQueryResponse = await res.json();
      
      if (data.error) {
        setError(data.error);
        setResponse(data.response || "Sorry, I couldn't process your request.");
      } else {
        setResponse(data.response);
        setError("");
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError("Network error. Please check your connection and try again.");
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setShowResults(false);
    setResponse("");
    setError("");
    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search health topics, symptoms, or ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-20 py-3 text-lg rounded-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* AI Response */}
      {showResults && (
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                AI Health Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResults}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-sm text-gray-600">
              Your question: "{query}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-primary">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-lg">Getting AI response...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700">{error}</p>
              </div>
            ) : response ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {response}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                  <strong>Disclaimer:</strong> This AI response is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for medical concerns.
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}