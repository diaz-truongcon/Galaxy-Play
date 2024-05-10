import logo from './logo.svg';
import './App.css';
import HomeAdmin from './components/admin/HomeAdmin/HomeAdmin';
import { ConfigProvider } from 'antd';
import { darkTheme, ligthTheme } from './components/theme/Theme';
import { useState, useEffect, createContext } from 'react';
import Home from './components/client/Home/Home';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./components/config/firebaseconfig";

export const ContextCategories = createContext();
export const ContextMovie = createContext();

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const categoriesCollectionRef = collection(db, "Categories");
  const movieCollectionRef = collection(db, "Movie");
  const [movie, setMovie] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(categoriesCollectionRef);
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoriesData);

      const querySnapshot1 = await getDocs(movieCollectionRef);
      const movieData = [];
      querySnapshot1.forEach((doc) => {
        movieData.push({ id: doc.id, ...doc.data() });
      });
      setMovie(movieData);
    };
    fetchData();
  }, []);


  return (
    <div className="App">
      <ConfigProvider theme={{
        token: currentTheme === "light" ? ligthTheme : darkTheme,
      }
      }>
        <ContextCategories.Provider value={categories}>
          <ContextMovie.Provider value={movie}>
            {/* <HomeAdmin currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} /> */}
            <Home/>
          </ContextMovie.Provider>
        </ContextCategories.Provider>

      </ConfigProvider>
    </div>
  );
}

export default App;
