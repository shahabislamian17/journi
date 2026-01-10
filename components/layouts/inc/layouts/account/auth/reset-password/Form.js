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
    
                                            <h1 className="three">Reset Password</h1>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="1B">
    
                                        <div className="text">
    
                                            <p className="small three">Reset your password.</p>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2" style="display: none">
    
                                <div className="text">
    
                                    <p className="small four">
    
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
    
                                <form className="form" data-form="reset-password">
    
                                    <div className="fields">
    
                                        <div className="fieldset">
    
                                            <div className="blocks" data-blocks="2">
    
                                                <div className="block" data-block="1B" data-inputs="1">
    
                                                    <div className="blocks" data-blocks="3">
    
                                                        <div className="block" data-block="1BA">
    
                                                            <div className="input">
    
                                                                <label>New Password</label>
    
                                                                <input type="password" name="new-password" required />
    
                                                            </div>
    
                                                        </div>
    
                                                        <div className="block" data-block="1BB">
    
                                                            <div className="toggle">
    
                                                                <div className="icons">
    
                                                                    <div className="icon" data-icon="1">
    
                                                                        <i className="icons8 icons8-eye"></i>
    
                                                                    </div>
    
                                                                    <div className="icon" data-icon="2">
    
                                                                        <i className="icons8 icons8-eye-2"></i>
    
                                                                    </div>
    
                                                                </div>
    
                                                            </div>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1C">
    
                                                    <div className="buttons">
    
                                                        <div className="button medium" data-button="1A">
    
                                                            <a className="action" href="#">
    
                                                                <div className="text">Reset Password</div>
    
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
