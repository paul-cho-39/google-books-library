import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Sample(props) {
   const settings: Settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
   };
   return (
      <div className='container'>
         <Slider {...settings}>
            <div className='bg-blue-300 w-36 h-24'>Hello</div>

            <div className='bg-blue-300 w-36 h-24'>Hello</div>

            <div className='bg-blue-300 w-36 h-24'>Hello</div>

            <div className='bg-blue-300 w-36 h-24'>Hello</div>
         </Slider>
      </div>
   );
}
