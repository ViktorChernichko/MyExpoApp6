import React, { createContext, useState, useContext, useMemo } from 'react';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const textLength = post.body.length;
      let matchesLength = true;
      if (lengthFilter === 'short') matchesLength = textLength < 150;
      else if (lengthFilter === 'medium')
        matchesLength = textLength >= 150 && textLength <= 250;
      else if (lengthFilter === 'long') matchesLength = textLength > 250;

      return matchesSearch && matchesLength;
    });
  }, [posts, searchQuery, lengthFilter]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        searchQuery,
        setSearchQuery,
        lengthFilter,
        setLengthFilter,
        filteredPosts,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};
