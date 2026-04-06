import React, { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './Shimmer.css';

const PersistentSearch = () => {
  // Persistence: Initialize from LocalStorage to maintain journey across refreshes
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('app_search_cache') || '';
  });
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync Search Term to LocalStorage
  useEffect(() => {
    localStorage.setItem('app_search_cache', searchTerm);
  }, [searchTerm]);

  // Robust API Integration Layer
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch) {
        setResults([]);
        return;
      }

      setIsFetching(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users?q=${debouncedSearch}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Communication Error:", err);
      } finally {
        setIsFetching(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', fontFamily: 'sans-serif' }}>
      <input
        type="text"
        placeholder="Persistent search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '1.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
      />

      <div className="content-area">
        {isFetching ? (
          // Skeleton Loaders: Perceived Performance Optimization
          [1, 2, 3].map((n) => <div key={n} className="skeleton-wrapper" />)
        ) : (
          results.map((item) => (
            <div key={item.id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.email}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersistentSearch;
