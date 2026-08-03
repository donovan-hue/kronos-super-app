import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useRecommendations = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedPosts = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/recommendations/posts?page=${page}`);
      if (page === 0) setRecommendedPosts(data.posts || []);
      else setRecommendedPosts(prev => [...prev, ...(data.posts || [])]);
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/api/recommendations/users');
      setRecommendedUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching recommended users:', error);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await api.get('/api/recommendations/trending');
      setTrending(data.posts || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  }, []);

  const trackInteraction = useCallback(async (targetId, targetType, action, dwellTime = 0, tags = []) => {
    try {
      await api.post('/api/recommendations/track', { targetId, targetType, action, dwellTime, tags });
    } catch {
      // Silent — tracking should never break the UI
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    fetchRecommendedPosts();
    fetchRecommendedUsers();
  }, []);

  return {
    recommendedPosts,
    recommendedUsers,
    trending,
    loading,
    fetchRecommendedPosts,
    fetchRecommendedUsers,
    fetchTrending,
    trackInteraction
  };
};
