export default function Search() {
  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="view">
                  <div className="links">
                    <ul>
                      <li>
                        <div className="text">View As</div>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="icons8 icons8-index"></i>
                        </div>
                        <div className="text">List</div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="icons8 icons8-schedule"></i>
                        </div>
                        <div className="text">Calendar</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form id="search" className="form vue">
                  <div className="blocks" data-blocks="2">
                    <div className="block" data-block="1A">
                      <div className="fields">
                        <div className="blocks" data-blocks="3">
                          <div className="block" data-block="1AA">
                            <div className="input">
                              <div className="icon">
                                <i className="icons8 icons8-location"></i>
                              </div>
                              <input type="text" name="destination" placeholder="Destination" value="Ibiza" readOnly required />
                            </div>
                          </div>
                          <div className="block" data-block="1AB">
                            <div className="input">
                              <div className="icon">
                                <i className="icons8 icons8-calendar"></i>
                              </div>
                              <input type="text" name="dates" placeholder="Dates" readOnly required />
                            </div>
                          </div>
                          <div className="block" data-block="1AC">
                            <div className="input">
                              <div className="icon">
                                <i className="icons8 icons8-guardian"></i>
                              </div>
                              <input type="text" name="guests" placeholder="Guests" readOnly required />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block" data-block="1B">
                      <div className="buttons">
                        <button className="button circle" data-button="1C" type="button">
                          <div className="action">
                            <div className="icon">
                              <i className="icons8 icons8-search"></i>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="block" data-block="1C">
                      <div className="modals">
                        <div className="modal" data-modal="destination">
                          <div className="blocks" data-blocks="4">
                            <div className="block" data-block="1CA">
                              <div className="title">Destinations</div>
                            </div>
                            <div className="block" data-block="1CB">
                              <div className="list">
                                <ul>
                                  <li>
                                    <div className="icon">
                                      <i className="icons8 icons8-location"></i>
                                    </div>
                                    <div className="text">
                                      <span className="one">Ibiza</span>
                                      <span className="two">Spain</span>
                                    </div>
                                  </li>
                                  <li className="alt">
                                    <div className="icon">
                                      <i className="icons8 icons8-location"></i>
                                    </div>
                                    <div className="text">
                                      <span className="one">Madrid</span>
                                      <span className="two">Spain</span>
                                    </div>
                                  </li>
                                  <li className="alt">
                                    <div className="icon">
                                      <i className="icons8 icons8-location"></i>
                                    </div>
                                    <div className="text">
                                      <span className="one">Barcelona</span>
                                      <span className="two">Spain</span>
                                    </div>
                                  </li>
                                  <li className="alt">
                                    <div className="icon">
                                      <i className="icons8 icons8-location"></i>
                                    </div>
                                    <div className="text">
                                      <span className="one">Seville</span>
                                      <span className="two">Spain</span>
                                    </div>
                                  </li>
                                  <li className="alt">
                                    <div className="icon">
                                      <i className="icons8 icons8-location"></i>
                                    </div>
                                    <div className="text">
                                      <span className="one">Palma</span>
                                      <span className="two">Spain</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal dates" data-modal="dates">
                          {/* Dates component will be injected here */}
                        </div>
                        <div className="modal" data-modal="guests">
                          <div className="blocks" data-blocks="5">
                            <div className="block" data-block="1CA">
                              <div className="title">Guests</div>
                            </div>
                            <div className="block" data-block="1CB">
                              <div className="numbers">
                                <div className="blocks" data-blocks="6">
                                  <div className="block" data-block="1CBA">
                                    <div className="number">
                                      <div className="blocks" data-blocks="7">
                                        <div className="block" data-block="1CBAA">
                                          <div className="icon">
                                            <i className="icons8 icons8-guardian"></i>
                                          </div>
                                          <div className="text">
                                            <span className="one">Adults</span>
                                            <span className="two">Ages 18+</span>
                                          </div>
                                        </div>
                                        <div className="block" data-block="1CBAB">
                                          <div className="buttons">
                                            <div className="button circle alt" data-button="2A">
                                              <div className="action">
                                                <div className="icon">-</div>
                                              </div>
                                            </div>
                                            <input name="quantity" value="1" className="amount" readOnly />
                                            <div className="button circle alt" data-button="2A">
                                              <div className="action">
                                                <div className="icon">+</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="1CBB">
                                    <div className="number">
                                      <div className="blocks" data-blocks="8">
                                        <div className="block" data-block="1CBBA">
                                          <div className="icon">
                                            <i className="icons8 icons8-guardian"></i>
                                          </div>
                                          <div className="text">
                                            <span className="one">Children</span>
                                            <span className="two">Ages 0-17</span>
                                          </div>
                                        </div>
                                        <div className="block" data-block="1CBBB">
                                          <div className="buttons">
                                            <div className="button circle alt" data-button="2A">
                                              <div className="action">
                                                <div className="icon">-</div>
                                              </div>
                                            </div>
                                            <input name="quantity" value="0" className="amount" readOnly />
                                            <div className="button circle alt" data-button="2A">
                                              <div className="action">
                                                <div className="icon">+</div>
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
                </form>
              </div>
            </div>
          </div>

          <div className="section three">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="form">
                  <div className="fields">
                    <div className="blocks" data-blocks="2">
                      <div className="block" data-block="1A">
                        <div className="icon">
                          <i className="icons8 icons8-location"></i>
                        </div>
                      </div>
                      <div className="block" data-block="1B">
                        <div className="blocks" data-blocks="3">
                          <div className="block" data-block="1BA">
                            <div className="text">Ibiza</div>
                          </div>
                          <div className="block" data-block="1BB">
                            <div className="blocks" data-blocks="4">
                              <div className="block" data-block="1BBA">
                                <div className="text">Dates</div>
                              </div>
                              <div className="block" data-block="1BBB">
                                <div className="text">Guests</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="buttons">
                    <div className="button circle" data-button="1C">
                      <div className="action">
                        <div className="icon">
                          <i className="icons8 icons8-search"></i>
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
  );
}

