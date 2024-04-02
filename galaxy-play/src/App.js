import logo from './logo.svg';
import './App.css';
import HomeAdmin from './components/admin/HomeAdmin/HomeAdmin';
import { ConfigProvider } from 'antd';
import { darkTheme, ligthTheme } from './components/theme/Theme';

function App() {
  return (
    <div className="App">
      <ConfigProvider theme={
       darkTheme
      }>
        <HomeAdmin />
      </ConfigProvider>
    </div>
  );
}

export default App;
