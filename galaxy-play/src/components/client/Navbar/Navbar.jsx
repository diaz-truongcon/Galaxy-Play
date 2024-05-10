import React, { useState, useEffect } from 'react';
import { Menu, Image, Button, Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './Navbar.scss'

function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };

    const handleLogin = () => {
        setVisible(true);
    };

    return (
        <>
            <div className='header'>
                <MenuOutlined className='menu-icon'
                    onClick={() => setOpenMenu(true)}
                />
                <div>
                    <Image
                        width={80}
                        src="https://assets.glxplay.io/web/images/logoglx.svg"
                        alt="Description of the image"
                    />
                </div>
                <div className="app-menu">
                    <AppMenu visible={visible} />
                </div>
                <div>
                    <Button onClick={() => handleLogin()} className='login-btn' type="primary">Login</Button>
                </div>
            </div>
            <Drawer
                placement='left'
                open={openMenu}
                closable={false}
                style={{ backgroundColor: "#101010" }}
                onClose={() => {
                    setOpenMenu(false);
                }}>
                <AppMenu isInline />
            </Drawer>
        </>
    );
}
function AppMenu({ isInline = false, visible }) {
   
    return (
        <>
            <Menu
                style={{ background: "none", color: "hsla(0,0%,100%,.6)" }}
                mode={isInline ? "inline" : "horizontal"}
                items={[
                    {
                        label: "Home",
                        key: "home",
                    },
                    {
                        label: "Movie Store",
                        key: "movie_store",
                    },
                    {
                        label: "Movies",
                        key: "movies",
                    },
                    {
                        label: "Rent Movies",
                        key: "rent_movies",
                    },
                    {
                        label: "Promotions",
                        key: "promotions",
                    }
                ]}
            />
            <Modal
                title="Login"
                visible={visible}
            >
                <h1>Hello</h1>
            </Modal>
        </>
    );
}
export default Navbar;