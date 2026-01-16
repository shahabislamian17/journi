import { useEffect, useRef } from 'react';

export default function Panel() {
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
    
                                <div className="conversations">
    
                                    <div className="blocks" data-blocks="2">
    
                                        <div className="block" data-block="1A">
    
                                            <div className="title">
    
                                                <h1 className="four">Messages</h1>
    
                                            </div>
    
                                        </div>
    
                                        <div className="block" data-block="1B">
    
                                            <div className="users">
    
                                                <div className="blocks" data-blocks="3">
    
                                                    <div className="block active" data-block="1BA">
    
                                                        <div className="user">
    
                                                            <div className="blocks" data-blocks="4">
    
                                                                <div className="block" data-block="1BAA">
    
                                                                    <div className="images">
    
                                                                        <div className="blocks" data-blocks="5">
    
                                                                            <div className="block" data-block="1BAAA">
    
                                                                                <div className="image" style="background-image: url('/assets/images/experiences/experience-1a.jpg')"></div>
    
                                                                            </div>
    
                                                                            <div className="block" data-block="1BAAB">
    
                                                                                <div className="image" style="background-image: url('/assets/images/global/hosts/placeholder.jpg')"></div>
    
                                                                            </div>
    
                                                                        </div>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="1BAB">
    
                                                                    <div className="text">
    
                                                                        <span className="one">Hugo Carretero</span>
                                                                        <span className="two">Discover Formentera on..</span>
                                                                        <span className="three">01 Jun</span>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                    <div className="block" data-block="1BA">
    
                                                        <div className="user">
    
                                                            <div className="blocks" data-blocks="4">
    
                                                                <div className="block" data-block="1BAA">
    
                                                                    <div className="images">
    
                                                                        <div className="blocks" data-blocks="5">
    
                                                                            <div className="block" data-block="1BAAA">
    
                                                                                <div className="image" style="background-image: url('/assets/images/experiences/experience-7a.jpg')"></div>
    
                                                                            </div>
    
                                                                            <div className="block" data-block="1BAAB">
    
                                                                                <div className="image" style="background-image: url('/assets/images/global/hosts/placeholder.jpg')"></div>
    
                                                                            </div>
    
                                                                        </div>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="1BAB">
    
                                                                    <div className="text">
    
                                                                        <span className="one">Hugo Carretero</span>
                                                                        <span className="two">Paddle along the wilde..</span>
                                                                        <span className="three">30 May</span>
    
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
    
                            <div className="block" data-block="2">
    
                                <div className="conversation">
    
                                    <div className="blocks" data-blocks="6">
    
                                        <div className="block" data-block="2A">
    
                                            <div className="blocks" data-blocks="7">
    
                                                <div className="block" data-block="2AA">
    
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
    
                                                <div className="block" data-block="2AB">
    
                                                    <div className="image" style="background-image: url('/assets/images/global/hosts/placeholder.jpg')"></div>
    
                                                </div>
    
                                                <div className="block" data-block="2AC">
    
                                                    <div className="title">
    
                                                        <h2 className="five">Hugo Carretero</h2>
    
                                                    </div>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                        <div className="block" data-block="2B">
    
                                            <div className="messages">
    
                                                <div className="blocks" data-blocks="8">
    
                                                    <div className="block" data-block="2BA" data-user="1">
    
                                                        <div className="message">
    
                                                            <div className="blocks" data-blocks="9">
    
                                                                <div className="block" data-block="2BAA">
    
                                                                    <div className="text">
    
                                                                        <span>Hugo Carretero</span>
                                                                        <span>01 Jun</span>
                                                                        <span>09:00</span>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="2BAB">
    
                                                                    <div className="text">
    
                                                                        <p className="small three">Lorem ipsum dolor sit amet consectetur pretium. Quisque faucibus sapien vitae pellentesque sem placerat pretium.</p>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                    <div className="block" data-block="2BA" data-user="2">
    
                                                        <div className="message">
    
                                                            <div className="blocks" data-blocks="9">
    
                                                                <div className="block" data-block="2BAA">
    
                                                                    <div className="text">
    
                                                                        <span>Andrew Wheeldon</span>
                                                                        <span>01 Jun</span>
                                                                        <span>10:00</span>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="2BAB">
    
                                                                    <div className="text">
    
                                                                        <p className="small three">Lorem ipsum dolor sit amet consectetur pretium. Quisque faucibus sapien vitae pellentesque sem placerat pretium.</p>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                    <div className="block" data-block="2BA" data-user="1">
    
                                                        <div className="message">
    
                                                            <div className="blocks" data-blocks="9">
    
                                                                <div className="block" data-block="2BAA">
    
                                                                    <div className="text">
    
                                                                        <span>Hugo Carretero</span>
                                                                        <span>01 Jun</span>
                                                                        <span>11:00</span>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="2BAB">
    
                                                                    <div className="text">
    
                                                                        <p className="small three">Lorem ipsum dolor sit amet consectetur pretium. Quisque faucibus sapien vitae pellentesque sem placerat pretium.</p>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                    <div className="block" data-block="2BA" data-user="2">
    
                                                        <div className="message">
    
                                                            <div className="blocks" data-blocks="9">
    
                                                                <div className="block" data-block="2BAA">
    
                                                                    <div className="text">
    
                                                                        <span>Andrew Wheeldon</span>
                                                                        <span>01 Jun</span>
                                                                        <span>12:00</span>
    
                                                                    </div>
    
                                                                </div>
    
                                                                <div className="block" data-block="2BAB">
    
                                                                    <div className="text">
    
                                                                        <p className="small three">Lorem ipsum dolor sit amet consectetur pretium. Quisque faucibus sapien vitae pellentesque sem placerat pretium.</p>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                        <div className="block" data-block="2C">
    
                                            <form className="form">
    
                                                <div className="fields">
    
                                                    <div className="fieldset">
    
                                                        <div className="blocks" data-blocks="10">
    
                                                            <div className="block" data-block="2CA">
    
                                                                <div className="textarea">
    
                                                                    <textarea></textarea>
    
                                                                </div>
    
                                                            </div>
    
                                                            <div className="block" data-block="2CB">
    
                                                                <div className="button small" data-button="1A">
    
                                                                    <a className="action">
    
                                                                        <div className="text">Send</div>
    
                                                                    </a>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                            </form>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                                <div ref={overlayRef}></div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </div>
    
  );
}
