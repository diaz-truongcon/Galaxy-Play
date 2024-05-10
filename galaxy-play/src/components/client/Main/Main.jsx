import React, {useContext} from 'react';
import Slideshow from '../Slideshow/Slideshow';
import Itemcarousel from '../ItemCarousel/Itemcarousel';
import { ContextMovie } from '../../../App';


function Main(props) {
    const movie = useContext(ContextMovie);
    const movieFast = movie.filter(element => element.categoryId == "iZWaesO11BIfYIZS3qoW");
   
   console.log(movieFast.length);
    return (
        <>
            <Slideshow/>
            {movieFast ? (<Itemcarousel data={movieFast} title={"Phim moi"} />) : ("")} 
            <Itemcarousel data={movie} title={"Phim Hanh Dong"} />
            <Itemcarousel data={movie} title={"Phim Kinh Di"} />
            <Itemcarousel data={movie} title={"Phim Bi An"}/>
        </>
    );
}

export default Main;