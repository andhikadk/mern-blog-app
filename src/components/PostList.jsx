import React, { useState, useEffect } from 'react';
import Layout from '../pages/Layout';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getPosts();
  });

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getPosts = async () => {
    const response = await axiosJWT.get('http://localhost:5000/posts');
    setPosts(response.data);
  };

  return (
    <Layout>
      <div className='py-6'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className='text-xl font-semibold text-gray-900'>Posts</h1>
              <p className='mt-2 text-sm text-gray-700'>
                A list of all the posts
              </p>
            </div>
            <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'>
                Add post
              </button>
            </div>
          </div>
          <div className='-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'>
                    No
                  </th>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                    Title
                  </th>
                  <th
                    scope='col'
                    className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'>
                    Category
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                    Author
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {posts.map((user, index) => (
                  <tr key={user._id}>
                    <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                      {index + 1}
                    </td>
                    <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
                      {user.title}
                      <dl className='font-normal lg:hidden'>
                        <dt className='sr-only'>Id</dt>
                        <dd className='mt-1 truncate text-gray-700'>
                          {user.category}
                        </dd>
                        <dt className='sr-only sm:hidden'>Email</dt>
                        <dd className='mt-1 truncate text-gray-500 sm:hidden'>
                          {user.author}
                        </dd>
                      </dl>
                    </td>
                    <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                      {user.category}
                    </td>
                    {/* <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                      {user.email}
                    </td> */}
                    <td className='px-3 py-4 text-sm text-gray-500'>
                      {user.author}
                    </td>
                    <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                      <a
                        href='/'
                        className='text-indigo-600 hover:text-indigo-900'>
                        Edit<span className='sr-only'>, {user.title}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostList;
