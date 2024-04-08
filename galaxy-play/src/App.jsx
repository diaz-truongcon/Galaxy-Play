import logo from './logo.svg';
import './App.css';
import HomeAdmin from './components/admin/HomeAdmin/HomeAdmin';
import { ConfigProvider } from 'antd';
import { darkTheme, ligthTheme } from './components/theme/Theme';
import { useState } from 'react';

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  return (
    <div className="App">
      <ConfigProvider theme={{
        token: currentTheme === "light" ? ligthTheme : darkTheme,
      }
      }>
        <HomeAdmin currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
      </ConfigProvider>
    </div>
  );
}

export default App;
