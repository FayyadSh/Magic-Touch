'use client';
import { useState, useEffect } from "react";

/**
 * A custom React hook for handling data fetching with loading and error states.
 * 
 * @param {Function} fetchFunction - The async function to call for fetching data
 * @param {...any} dependencies - Dependencies array that triggers re-fetch when changed (similar to useEffect)
 * @returns {Object} An object containing:
 *   - data: The fetched data (defaults to empty array)
 *   - loading: Boolean indicating if fetch is in progress
 *   - error: Error message if fetch failed (null if no error)
 */
const useFetch = (fetchFunction, ...dependencies) => {
    // State for storing fetched data
    const [data, setData] = useState([]);
    // State for storing error information
    const [error, setError] = useState(null);
    // State for tracking loading status
    const [loading, setLoading] = useState(false);

    /**
     * Reloads data by calling the fetchFunction
     * Handles loading states and error scenarios
     */
    const reload = () => {
        setLoading(true);
        fetchFunction()
            .then((response) => {
                setData(response);
                setError(null); // Clear any previous errors on success
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    setError('Not Found Page');
                } else {
                    setError(err?.message || 'An unknown error occurred');
                }
                console.error('Fetch error:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Automatically reload when dependencies change
    useEffect(() => {
        reload();
    }, [...dependencies]);

    return { data, loading, error, reload }; // Consider exposing reload for manual refreshes
};

export default useFetch;