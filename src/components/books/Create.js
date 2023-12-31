import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../common/Error';
import API from '../common/Api';
import CreateBook from './DisplayCreate';

function Create() {
  const [state, setState] = useState({
    name: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [serverErr, setServerErr] = useState('');
  const [validationErrors, setValidationErrors] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name (required)
    if (!state.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate email (required and valid format)
    if (!state.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setValidationErrors(newErrors);

    // Check if there are any validation errors
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => {
    setError('');
    setValidationErrors('');
  };

  const createBook = async (e) => {
    e.preventDefault();
    resetErrors();

    const data = {
      name: state.name,
      category: state.category,
    };

    if (!validateForm()) {
      return; // Don't proceed with the request if there are validation errors
    }

    try {
      await API.post(`/books`, data);

      navigate('/books');
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setServerErr('Internal server error, please try again later');
      } else if (err.response && err.response.status === 409) {
        setError(err.response.data);
      } else {
        setError('Server Error');
      }
    }
  };

  if (serverErr) {
    <Error msg={serverErr} />;
  } else {
    return (
      <CreateBook
        createBook={createBook}
        error={error}
        handleInputChange={handleInputChange}
        validationErrors={validationErrors}
      />
    );
  }
}

export default Create;
