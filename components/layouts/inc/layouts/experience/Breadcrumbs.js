export default function Breadcrumbs() {
  return (
        <div className="container">
    
            <div className="content">
    
                <div className="sections">
    
                    <div className="section one">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <div className="buttons">
    
                                    <div className="button circle alt" data-button="2A">
    
                                        <a className="action" onclick="history.go(-1)">
    
                                            <div className="icon">
    
                                                <i className="icons8 icons8-less-than"></i>
    
                                            </div>
    
                                        </a>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2">
    
                                <div className="links">
    
                                    <ul>
    
                                        <li>
    
                                            <a href="#">Ibiza</a>
    
                                        </li>
    
                                        <li>
    
                                            <a href="#">Sightseeing</a>
    
                                        </li>
    
                                    </ul>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <div className="buttons">
    
                                    <div className="button small alt" data-button="1A">
    
                                        <a className="action" href="#availability">
    
                                            <div className="text">View Availability</div>
    
                                        </a>
    
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
