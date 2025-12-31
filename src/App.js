import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Feed from './pages/js/Feed';
import Home from './pages/js/Home';
import Login from './pages/js/Login';
import Profile from './pages/js/Profile';
import { useEffect, useState } from 'react';
import ProtectedRoute from './needed/ProtectedRoute';
import Redirects from './needed/Redirects';
import AuthContext from './context/AuthContext';
import LoginRoute from './needed/LoginRoute';
import Navbar from './components/js/Navbar';
import Explore from './pages/js/Explore';
import Learn from './pages/js/Learn';
import bg from './images/bg.jpg'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './needed/Firebase'
import DbUserContext from './context/DbUserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './needed/Firebase';
import VisitingProfile from './pages/js/VisitingProfile';
import Admin from './pages/js/Admin'

function App() {
  const [user, setUser] = useState();
  const [dbUser, setDbUser] = useState();


  const getDbUser = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userRes = await getDoc(userRef).then(data => data.data());
    if(!userRes){
      getDbUser()
    }else{
      setDbUser(userRes);
      //console.log(userRes)
    }

}

  useEffect(() => {
      //console.log(user);
      if(user){
        getDbUser();
      }
    }, [user]);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          setUser(user)
          console.log(user)
      });
    }, [])

  return (

    <DbUserContext.Provider value={{ dbUser, setDbUser }}>
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="login"
              element={<LoginRoute><Login /></LoginRoute>}
            />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <div className="page-bg">
                    <img src={bg} alt="Background" />
                  </div>
                  <Routes>
                    <Route
                      path="home"
                      element={<ProtectedRoute user={user}><Home /></ProtectedRoute>}
                    />
                    <Route
                      path="feed"
                      element={<ProtectedRoute user={user}><Feed /></ProtectedRoute>}
                    />
                    <Route
                      path="explore"
                      element={<ProtectedRoute user={user}><Explore /></ProtectedRoute>}
                    />
                    <Route
                      path="learn"
                      element={<ProtectedRoute user={user}><Learn /></ProtectedRoute>}
                    />
                    <Route
                      path="profile"
                      element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>}
                    />
                     <Route
                      path="profile/:uid"
                      element={<ProtectedRoute user={user}><VisitingProfile /></ProtectedRoute>}
                    />
                    <Route
                      path="admin"
                      element={<ProtectedRoute user={user}><Admin /></ProtectedRoute>}
                    />
                    <Route
                      path="*"
                      element={<Redirects />}
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </DbUserContext.Provider>
  );

}

export default App;
