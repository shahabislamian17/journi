export default function Form() {
  return (
        <div className="container">
    
            <div className="content">
    
                <div className="sections">
    
                    <div className="section one">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <div className="blocks" data-blocks="2">
    
                                    <div className="block" data-block="1A">
    
                                        <div className="title">
    
                                            <h1 className="three">Forgot Password</h1>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="1B">
    
                                        <div className="text">
    
                                            <p className="small three">Reset your password.</p>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2">
    
                                <div className="text">
    
                                    <p className="small five">
    
                                        <span>Remembered your password?</span>
                                        <span>Click <a className="link" href="/account/log-in">here</a>.</span>
    
                                    </p>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <form className="form" data-form="forgot-password">
    
                                    <div className="fields">
    
                                        <div className="fieldset">
    
                                            <div className="blocks" data-blocks="2">
    
                                                <div className="block" data-block="1A" data-inputs="1">
    
                                                    <div className="input">
    
                                                        <label>Email Address</label>
    
                                                        <input type="text" name="email-address" autocapitalize="none" required />
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1C">
    
                                                    <div className="buttons">
    
                                                        <div className="button medium" data-button="1A">
    
                                                            <a className="action" href="#">
    
                                                                <div className="text">Submit</div>
    
                                                                <div className="background"></div>
    
                                                            </a>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                    </div>
    
                                </form>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </div>
    
  );
}
