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
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <div className="text">
    
                                    <p className="small five">Showing 5 of 5 experiences.</p>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2">
    
                                <div className="blocks" data-blocks="2">
    
                                    <div className="block" data-block="2A">
    
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
    
                                    <div className="block" data-block="2B">
    
                                        <div className="filter">
    
                                            <div className="icon">
    
                                                <i className="icons8 icons8-filter"></i>
    
                                            </div>
    
                                            <div className="text">Filters</div>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="2C">
    
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
    
                                        <div className="block" data-block="1">
    
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
    
                                                        <div className="block" data-block="1AAB">
    
                                                            <div className="title">
    
                                                                <h2 className="four">Calendar</h2>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1B">
    
                                                    <div className="buttons">
    
                                                        <div className="button small" data-button="2A">
    
                                                            <div className="action">
    
                                                                <div className="text">Generate Calendar</div>
    
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
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                        <div className="block" data-block="2">
    
                                            <div className="dates">
    
                                                <div className="blocks" data-blocks="4">
    
                                                    <div className="block" data-block="2A">
    
                                                        <div className="labels">
    
                                                            <div className="label">
    
                                                            </div>
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Sunday</span>
                                                                            <span className="two">1 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Monday</span>
                                                                            <span className="two">2 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Tuesday</span>
                                                                            <span className="two">3 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Wednesday</span>
                                                                            <span className="two">4 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Thursday</span>
                                                                            <span className="two">5 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Friday</span>
                                                                            <span className="two">6 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Saturday</span>
                                                                            <span className="two">7 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Sunday</span>
                                                                            <span className="two">8 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Monday</span>
                                                                            <span className="two">9 June</span>
    
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
    
                                                            <div className="label">
    
                                                                <div className="blocks" data-blocks="5">
    
                                                                    <div className="block" data-block="2AA">
    
                                                                        <div className="text">
    
                                                                            <span className="one">Tuesday</span>
                                                                            <span className="two">10 June</span>
    
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
    
                                                    <div className="block" data-block="2B">
    
                                                        <div className="blocks" data-blocks="6">
    
                                                            <div className="block" data-block="2BA">
    
                                                                <div className="labels">
    
                                                                    <div className="label">
    
                                                                        <div className="text">06:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">06:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">07:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">07:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">08:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">08:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">09:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">09:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">10:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">10:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">11:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">11:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">12:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">12:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">13:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">13:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">14:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">14:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">15:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">15:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">16:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">16:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">17:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">17:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">18:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">18:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">19:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">19:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">20:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">20:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">21:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">21:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">22:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">22:30</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">23:00</div>
    
                                                                    </div>
    
                                                                    <div className="label">
    
                                                                        <div className="text">23:30</div>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                            <div className="block" data-block="2BB">
    
                                                                <div className="days">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
    
                                                                                <div className="blocks" data-blocks="7">
    
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
