// File: components/AutocompleteInput.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { Input } from '@/components/ui';
import debounce from 'lodash.debounce';
interface AutocompleteInputProps {
  query: any;
  register: any;
  name: string;
  placeholder: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ query, register, name, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedQuery = useCallback(debounce((value) => useQuery(query, { inputValue: value }), 300), []);
  const { data } = useQuery(query, { inputValue });

  useEffect(() => {
    if (inputValue) {
      debouncedQuery(inputValue);
    }
  }, [inputValue, debouncedQuery]);

  useEffect(() => {
    if (data) {
      setSuggestions(data);
    }
  }, [data]);

  return (
    <div>
      <Input
        {...register(name)}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        list={`${name}-suggestions`}
      />
      <datalist id={`${name}-suggestions`}>
        {suggestions.map((suggestion) => (
          <option key={index} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
};