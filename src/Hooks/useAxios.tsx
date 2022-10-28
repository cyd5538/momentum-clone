import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.baseURL = `https://api.unsplash.com/search/photos?page=1&query=`;

export const useAxios = (axiosParams: AxiosRequestConfig) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);

 const fetchData = async (params: AxiosRequestConfig) => {
    try {
      const result = await axios.request(params);
      setResponse(result);
    } catch( err ) {
      setError(err);
    } finally {
      setLoading(false);
    }
 };

useEffect(() => {
  fetchData(axiosParams);
},[]);

 return { response, error, loading };
}
