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
    
                                            <a>Account</a>
    
                                        </li>
    
                                        <li>
    
                                            <a>Reset Password</a>
    
                                        </li>
    
                                    </ul>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </div>
    
  );
}
