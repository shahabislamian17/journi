import { useEffect, useRef } from 'react';

export default function Experiences() {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.className = "overlay";
    }
  }, []);

  return (
        <div className="container">
    
           <div className="content">
    
               <div className="sections">
    
                   <div className="section one">
    
                       <div className="blocks" data-blocks="1">
    
                           <div className="block">
    
                               <div className="links">
    
                                   <div className="one">
    
                                       <ul>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-stars"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-sparkling"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Featured</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li className="active">
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-yacht"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-yacht-2"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Sightseeing</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-lotus"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-lotus-2"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Wellness</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-collectibles"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-collectibles-2"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Art & Culture</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-entertainment"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-theatre-mask"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Entertainment</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-champagne"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-champagne-2"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Food & Drink</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="2">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-tennis-ball"></i>
    
                                                               </div>
    
                                                               <div className="icon two">
    
                                                                   <i className="icons8 icons8-tennis-ball-2"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Sports</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                       </ul>
    
                                   </div>
    
                                   <div className="two">
    
                                       <ul>
    
                                           <li>
    
                                               <a className="action" href="#">
    
                                                   <div className="blocks" data-blocks="3">
    
                                                       <div className="block">
    
                                                           <div className="icons">
    
                                                               <div className="icon one">
    
                                                                   <i className="icons8 icons8-filter"></i>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block">
    
                                                           <div className="title">
    
                                                               <h4 className="one">Filters</h4>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </a>
    
                                           </li>
    
                                       </ul>
    
                                   </div>
    
                               </div>
    
                           </div>
    
                       </div>
    
                   </div>
    
                   <div className="section two">
    
                       <div className="blocks" data-blocks="1">
    
                           <div className="block">
    
                               <div className="text">
    
                                   <p className="small five">Showing 10 of 124 experiences.</p>
    
                               </div>
    
                           </div>
    
                           <div className="block">
    
                               <div className="blocks" data-blocks="2">
    
                                   <div className="block">
    
                                       <div className="sort">
    
                                           <div className="icon">
    
                                               <i className="icons8 icons8-back-and-forth"></i>
    
                                           </div>
    
                                           <div className="text">Sort:</div>
    
                                           <div className="select">
    
                                               <span className="value"></span>
    
                                               <select>
    
                                                   <option value="relevance">Relevance</option>
                                                   <option value="popular">Popular</option>
                                                   <option value="newest">Newest</option>
                                                   <option value="price-low">Price: Low To High</option>
                                                   <option value="price-high">Price: High To Low</option>
    
                                               </select>
    
                                           </div>
    
                                       </div>
    
                                   </div>
    
                                   <div className="block">
    
                                       <div className="filter">
    
                                           <div className="icon">
    
                                               <i className="icons8 icons8-filter"></i>
    
                                           </div>
    
                                           <div className="text">Filters</div>
    
                                       </div>
    
                                   </div>
    
                                   <div className="block">
    
                                       <div className="view">
    
                                           <div className="buttons">
    
                                               <div className="button circle alt" data-button="2A" data-link="list">
    
                                                   <div className="action">
    
                                                       <div className="icon">
    
                                                           <i className="icons8 icons8-index"></i>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                               <div className="button circle alt" data-button="2A" data-link="calendar">
    
                                                   <div className="action">
    
                                                       <div className="icon">
    
                                                           <i className="icons8 icons8-schedule"></i>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                           </div>
    
                                       </div>
    
                                   </div>
    
                               </div>
    
                           </div>
    
                       </div>
    
                   </div>
    
                   <div className="section three">
    
                       <section className="list">
    
                           <div className="container">
    
                               <div className="content">
    
                                   <div className="blocks" data-blocks="1">
    
                                       <div className="block">
    
                                           <div className="experiences">
    
                                               <div className="blocks" data-blocks="2">
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-1a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Discover Formentera on a beautiful catamaran</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">4 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.7</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €125</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-2a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Sail around Ibiza at sunset with champagne and aperitifs</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">2.5 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.5</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €90</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-3a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Enjoy the pristine waters around Ibiza and Formentera</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">8 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.7</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €100</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
                                                                               <div className="label">New</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-4a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Discover the other side of Ibiza</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">3 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.9</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €125</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-5a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Full running tour of Ibiza Town</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">2 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">5.0</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €50</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-6a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Sail from Ibiza to Formentera on a fantastic boat</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">6 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.5</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €175</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
                                                                               <div className="label">New</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-7a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Paddle along the wildest part of Ibiza</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">3 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.9</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €50</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-8a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Explore Formentera by sailboat</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">6 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.9</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €150</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-9a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">Discover one of Ibiza's most secluded beaches</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">4 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">4.8</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €50</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="1A">
    
                                                       <div className="experience">
    
                                                           <div className="blocks" data-blocks="3">
    
                                                               <div className="block" data-block="1AA">
    
                                                                   <div className="banner">
    
                                                                       <div className="blocks" data-blocks="4">
    
                                                                           <div className="block" data-block="1AAA">
    
                                                                               <div className="icons">
    
                                                                                   <div className="icon one">
    
                                                                                       <i className="icons8 icons8-heart"></i>
    
                                                                                   </div>
    
                                                                                   <div className="icon two">
    
                                                                                       <i className="icons8 icons8-heart-2"></i>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="block" data-block="1AAB">
    
                                                                               <a href="#">
    
                                                                                   <div className="images">
    
                                                                                       <div className="image" style="background-image: url('/assets/images/experiences/experience-10a.jpg')"></div>
    
                                                                                   </div>
    
                                                                               </a>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AB">
    
                                                                   <a href="#">
    
                                                                       <div className="title">
    
                                                                           <h3 className="three">A tour of Ibiza old town</h3>
    
                                                                       </div>
    
                                                                   </a>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AC">
    
                                                                   <div className="blocks" data-blocks="5">
    
                                                                       <div className="block" data-block="1ACA">
    
                                                                           <div className="duration">
    
                                                                               <div className="text">3 Hours</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ACB">
    
                                                                           <div className="rating">
    
                                                                               <div className="icon">
    
                                                                                   <i className="icons8 icons8-star-2"></i>
    
                                                                               </div>
    
                                                                               <div className="text">5.0</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="block" data-block="1AD">
    
                                                                   <div className="blocks" data-blocks="6">
    
                                                                       <div className="block" data-block="1ADA">
    
                                                                           <div className="price">
    
                                                                               <div className="text">From €50</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                       <div className="block" data-block="1ADB">
    
                                                                           <div className="labels">
    
                                                                               <div className="label">Featured</div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                           </div>
    
                                       </div>
    
                                       <div className="block">
    
                                           <div className="buttons">
    
                                               <div className="button medium" data-button="2A">
    
                                                   <div className="action">
    
                                                       <div className="icon">
    
                                                           <i className="icons8 icons8-loading"></i>
    
                                                       </div>
    
                                                       <div className="text">Loading</div>
    
                                                   </div>
    
                                               </div>
    
                                           </div>
    
                                       </div>
    
                                   </div>
    
                               </div>
    
                           </div>
    
                       </section>
    
                       <section className="calendar">
    
                           <div className="container">
    
                               <div className="content">
    
                                   <div className="blocks" data-blocks="1">
    
                                       <div className="block" data-block="1">
    
                                           <div className="blocks" data-blocks="2">
    
                                               <div className="block" data-block="1A">
    
                                                   <div className="blocks" data-blocks="3">
    
                                                       <div className="block" data-block="1AA">
    
                                                           <div className="close">
    
                                                               <div className="button circle" data-button="2A">
    
                                                                   <div className="action">
    
                                                                       <div className="icon">
    
                                                                           <i className="icons8 icons8-less-than"></i>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                       <div className="block" data-block="1AB">
    
                                                           <div className="title">
    
                                                               <h2 className="four">Calendar</h2>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                               <div className="block" data-block="1B">
    
                                                   <div className="buttons">
    
                                                       <div className="blocks" data-blocks="4">
    
                                                           <div className="block" data-block="1BA">
    
                                                               <div className="button small" data-button="2A">
    
                                                                   <div className="action">
    
                                                                       <div className="text">Generate Calendar</div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="button small" data-button="2A">
    
                                                                   <div className="action">
    
                                                                       <div className="text">Share Calendar</div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="button circle alt" data-button="2A">
    
                                                                   <div className="action">
    
                                                                       <div className="icon">
    
                                                                           <i className="icons8 icons8-delete"></i>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                           <div className="block" data-block="1BB">
    
                                                               <div className="button circle alt" data-button="2A" data-action="previous">
    
                                                                   <div className="action">
    
                                                                       <div className="icon">
    
                                                                           <i className="icons8 icons8-less-than"></i>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                               <div className="button circle alt" data-button="2A" data-action="next">
    
                                                                   <div className="action">
    
                                                                       <div className="icon">
    
                                                                           <i className="icons8 icons8-more-than"></i>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                           </div>
    
                                       </div>
    
                                       <div className="block" data-block="2">
    
                                           <div className="dates">
    
                                               <div className="blocks" data-blocks="5">
    
                                                   <div className="block" data-block="2A">
    
                                                       <div className="labels">
    
                                                           <div className="slider">
    
                                                               <div className="slides">
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Sun</span>
                                                                                       <span className="two">1 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Mon</span>
                                                                                       <span className="two">2 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Tue</span>
                                                                                       <span className="two">3 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Wed</span>
                                                                                       <span className="two">4 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Thu</span>
                                                                                       <span className="two">5 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Fri</span>
                                                                                       <span className="two">6 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Sat</span>
                                                                                       <span className="two">7 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Sun</span>
                                                                                       <span className="two">8 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Mon</span>
                                                                                       <span className="two">9 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="slide">
    
                                                                       <div className="label">
    
                                                                           <div className="blocks" data-blocks="6">
    
                                                                               <div className="block" data-block="2AA">
    
                                                                                   <div className="text">
    
                                                                                       <span className="one">Tue</span>
                                                                                       <span className="two">10 Jun</span>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                               <div className="block" data-block="2AB">
    
                                                                                   <div className="button circle alt" data-button="2A">
    
                                                                                       <div className="action">
    
                                                                                           <div className="icon">+</div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                                   <div className="list">
    
                                                                                       <ul>
    
                                                                                           <li>Experience</li>
                                                                                           <li>Bed</li>
                                                                                           <li>Breakfast</li>
                                                                                           <li>Lunch</li>
                                                                                           <li>Dinner</li>
                                                                                           <li>Other</li>
    
                                                                                       </ul>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                                   <div className="block" data-block="2B">
    
                                                       <div className="blocks" data-blocks="7">
    
                                                           <div className="block" data-block="2BA">
    
                                                               <div className="labels">
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">06</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">06</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">07</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">07</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">08</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">08</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">09</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">09</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">10</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">10</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">11</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">11</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">12</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">12</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">13</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">13</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">14</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">14</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">15</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">15</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">16</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">16</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">17</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">17</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">18</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">18</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">19</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">19</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">20</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">20</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">21</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">21</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">22</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">22</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">23</span>
                                                                           <span className="two">:00</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                                   <div className="label">
    
                                                                       <div className="text">
    
                                                                           <span className="one">23</span>
                                                                           <span className="two">:30</span>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                           <div className="block" data-block="2BB">
    
                                                               <div className="days">
    
                                                                   <div className="slider">
    
                                                                       <div className="slides">
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience active" data-time="9" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Paddle along the wildest part of Ibiza</span>
                                                                                                       <span className="two">10:00 - 13:00</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="9" data-duration="6" data-availability="1">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Experience</span>
                                                                                                       <span className="two">10:00 - 13:00</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                           <div className="slide">
    
                                                                               <div className="day">
    
                                                                                   <div className="times">
    
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
                                                                                       <div className="time"></div>
    
                                                                                   </div>
    
                                                                                   <div className="experiences">
    
                                                                                       <div className="experience" data-time="1" data-duration="6">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Bed</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="7" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Breakfast</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                       <div className="experience" data-time="15" data-duration="2">
    
                                                                                           <div className="blocks" data-blocks="8">
    
                                                                                               <div className="block" data-block="2BBA">
    
                                                                                                   <div className="text">
    
                                                                                                       <span className="one">Lunch</span>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                               <div className="block" data-block="2BBB">
    
                                                                                                   <div className="icon">
    
                                                                                                       <i className="icons8 icons8-delete"></i>
    
                                                                                                   </div>
    
                                                                                               </div>
    
                                                                                           </div>
    
                                                                                       </div>
    
                                                                                   </div>
    
                                                                               </div>
    
                                                                           </div>
    
                                                                       </div>
    
                                                                   </div>
    
                                                               </div>
    
                                                           </div>
    
                                                       </div>
    
                                                   </div>
    
                                               </div>
    
                                           </div>
    
                                       </div>
    
                                   </div>
    
                               </div>
    
                           </div>
    
                           <div ref={overlayRef}></div>
    
                       </section>
    
                   </div>
    
                   <div className="section four">
    
                       <div className="blocks" data-blocks="1">
    
                           <div className="block" data-block="1">
    
                               <div className="buttons">
    
                                   <div className="button medium" data-button="2A">
    
                                       <div className="action">
    
                                           <div className="icon">
    
                                               <i className="icons8 icons8-schedule"></i>
    
                                           </div>
    
                                           <div className="text">Calendar</div>
    
                                       </div>
    
                                   </div>
    
                               </div>
    
                           </div>
    
                       </div>
    
                   </div>
    
               </div>
    
           </div>
    
        </div>
    
  );
}
