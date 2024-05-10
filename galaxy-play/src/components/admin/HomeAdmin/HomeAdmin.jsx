import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Radio } from 'antd';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import {
    PieChartOutlined,
    UserOutlined,
    CustomerServiceOutlined,
    AppstoreOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import Categories from '../Categories/Categories';
import Movie from '../Movie/Movie'
import Customers from '../Customers/Customers'


const { Header, Content, Footer, Sider } = Layout;

const HomeAdmin = ({currentTheme, setCurrentTheme}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    useEffect(() => {
        // Load the selected key from local storage on component mount
        const storedKey = localStorage.getItem('selectedKey');
        if (storedKey) {
            setSelectedKey(storedKey);
        }
    }, []);

    const handleMenuClick = (key) => {
        // Update the selected key in local storage and state
        localStorage.setItem('selectedKey', key);
        setSelectedKey(key);
    };

    // Define your menu items as an array
    const menuItems = [
        { key: '1', icon: <PieChartOutlined />, label: 'Dashboard', route: '/' },
        { key: '2', icon: <AppstoreOutlined />, label: 'Categories', route: '/categories' },
        { key: '3', icon: <PlayCircleOutlined />, label: 'Movies', route: '/movies' },
        { key: '4', icon: <CustomerServiceOutlined />, label: 'Customers', route: '/customers' },
        { key: '5', icon: <UserOutlined />, label: 'Profile', route: '/profile' },
        // Add other menu items as needed
    ];

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" style={{ height: '50px' }}>
                        <img src="https://assets.glxplay.io/web/images/logoglx.svg" alt="" style={{ height: '50px' }} />
                    </div>
                    <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
                        {menuItems.map(item => (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.route} onClick={() => handleMenuClick(item.key)}>
                                    {item.label}
                                </Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0, textAlign:"end" }} >
                        <Radio.Group
                            value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)}
                        >
                            <Radio value={"light"}>Light</Radio>
                            <Radio value={"dark"}>Dark</Radio>
                        </Radio.Group>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Truong</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Routes>
                                <Route path="/" element={<h1>Dashboard</h1>} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/movies" element={<Movie />} />
                                <Route path="/customers" element={<Customers />} />
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design Admin ©2023 Created by Xuan Truong</Footer>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
};

export default HomeAdmin;