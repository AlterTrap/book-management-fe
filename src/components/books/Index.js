import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '../books/DisplayList';
import Error from '../common/Error';
import API from '../common/Api';

function Index() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const category = searchParams.get('category');
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const getBooks = useCallback(
    async (page = 1) => {
      const params = { page };

      if (name && name.trim('')) params.name = name;

      if (category && category.trim('')) params.category = category;

      try {
        const res = await API.get('books', { params: params });

        setList(res.data.list);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Book Not Found');
        } else if (err.response && err.response.status === 500) {
          setError('Internal server error, please try again later');
        }
      }
    },
    [category, name]
  );

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  if (error) {
    return <Error msg={error} />;
  } else {
    return <List list={list} getBooks={getBooks} totalPages={totalPages} />;
  }
}

export default Index;
