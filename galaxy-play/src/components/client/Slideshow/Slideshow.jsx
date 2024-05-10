import React from 'react';
import { Carousel, Image } from 'antd';

function Slideshow() {
    return (
        <>
            <Carousel>
               <div>
                    <Image
                        src="https://www.galaxycine.vn/media/2023/8/8/-l3a9944_1691483657619.jpg"
                    />
               </div>
               <div>
                    <Image
                        src="https://www.galaxycine.vn/media/2023/8/8/-l3a9944_1691483657619.jpg"
                    />
               </div>
               <div>
                    <Image
                        src="https://www.galaxycine.vn/media/2023/8/8/-l3a9944_1691483657619.jpg"
                    />
               </div>
               <div>
                    <Image
                        src="https://www.galaxycine.vn/media/2023/8/8/-l3a9944_1691483657619.jpg"
                    />
               </div>
               <div>
                    <Image
                        src="https://www.galaxycine.vn/media/2023/8/8/-l3a9944_1691483657619.jpg"
                    />
               </div>
            </Carousel>
        </>
    );
}

export default Slideshow;