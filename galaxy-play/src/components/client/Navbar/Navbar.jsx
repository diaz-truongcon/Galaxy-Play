import React, { useState, useEffect } from 'react';
import { Menu, Image, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './Navbar.scss'

function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <>
            <div className='header'>
                <MenuOutlined
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
                    <AppMenu />
                </div>
                <div>
                    <Button type="primary">Login</Button>
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
function AppMenu({ isInline = false }) {
    return (
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
    );
}
export default Navbar;