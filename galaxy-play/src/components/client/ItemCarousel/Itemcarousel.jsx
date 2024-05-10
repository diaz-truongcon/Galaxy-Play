import React, { useState,useEffect } from 'react';
import { Col, Row, Image } from 'antd';
import { RightCircleOutlined, LeftCircleOutlined } from '@ant-design/icons';


function Itemcarousel({ data ,title }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedData, setDisplayedData] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    const getNumOfDisplayedItems = () => {
        if (windowWidth < 740) {
            return 2;
        } else if (windowWidth > 740 && windowWidth < 1024) {
            return 4;
        } else {
            return 6;
        }
    };

    useEffect(() => {
        if (data.length !== 0) {
            const numOfDisplayedItems = getNumOfDisplayedItems();
            const startIndex = currentIndex;
            const endIndex = (startIndex + numOfDisplayedItems) % data.length;
            const newDisplayedData = [];

            for (let i = startIndex; i !== endIndex; i = (i + 1) % data.length) {

                newDisplayedData.push(data[i]);
            }

            setDisplayedData(newDisplayedData);
        }

    }, [currentIndex, data]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
                console.log("oke");
            }
        }, 4000);

        return () => {
            clearInterval(interval);
        };
    }, [data.length, isPaused]);

    return (
        <>
            <h1>{title}</h1>
            <Row gutter={[16, 16]} style={{ position: "relative" }}>
                <LeftCircleOutlined style={{ fontSize: "50px", color: "red", position: "absolute", zIndex: "2", top: "calc(50% - 25px)" }} />
                {displayedData.map((item) => (
                    <>
                        <Col lg={4} md={6} xs={12}>
                            <Image src={item.imgMovie} />
                        </Col>
                    </>
                ))}
                <RightCircleOutlined style={{ fontSize: "50px", color: "red", position: "absolute", zIndex: "2", right: "0", top: "calc(50% - 25px)" }} />
            </Row>
            
        </>
    );
}

export default Itemcarousel;