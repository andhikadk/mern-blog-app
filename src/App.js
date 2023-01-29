import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import UserList from './components/UserList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/posts' element={<PostList />} />
        <Route path='/users' element={<UserList />} />
      </Routes>
    </Router>
  );
};

export default App;
