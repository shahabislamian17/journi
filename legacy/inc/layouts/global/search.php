    <div class="container">

        <div class="content">

            <div class="sections">

                <div class="section one">

                    <div class="blocks" data-blocks="1">

                        <div class="block" data-block="1">

                            <div class="view">

                                <div class="links">

                                    <ul>

                                        <li>

                                            <div class="text">View As</div>

                                        </li>

                                        <li class="active">

                                            <div class="icon">

                                                <i class="icons8 icons8-index"></i>

                                            </div>

                                            <div class="text">List</div>

                                        </li>

                                        <li>

                                            <div class="icon">

                                                <i class="icons8 icons8-schedule"></i>

                                            </div>

                                            <div class="text">Calendar</div>

                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="section two">

                    <div class="blocks" data-blocks="1">

                        <div class="block" data-block="1">

                            <form id="search" class="form vue">

                                <div class="blocks" data-blocks="2">

                                    <div class="block" data-block="1A">

                                        <div class="fields">

                                            <div class="blocks" data-blocks="3">

                                                <div class="block" data-block="1AA">

                                                    <div class="input">

                                                        <div class="icon">

                                                            <i class="icons8 icons8-location"></i>

                                                        </div>

                                                        <input type="text" name="destination" placeholder="Destination" value="Ibiza" readonly required>

                                                    </div>

                                                </div>

                                                <div class="block" data-block="1AB">

                                                    <div class="input">

                                                        <div class="icon">

                                                            <i class="icons8 icons8-calendar"></i>

                                                        </div>

                                                        <input type="text" name="dates" placeholder="Dates" readonly required :value="(query.checkInDate && query.checkOutDate ? ( query.checkInDate.replace(/\s\d{4}$/, '') + ' - ' + query.checkOutDate.replace(/\s\d{4}$/, '') ) : '')">

                                                    </div>

                                                </div>

                                                <div class="block" data-block="1AC">

                                                    <div class="input">

                                                        <div class="icon">

                                                            <i class="icons8 icons8-guardian"></i>

                                                        </div>

                                                        <input type="text" name="guests" placeholder="Guests" readonly required>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="block" data-block="1B">

                                        <div class="buttons">

                                            <button class="button circle" data-button="1C">

                                                <div class="action">

                                                    <div class="icon">

                                                        <i class="icons8 icons8-search"></i>

                                                    </div>

                                                </div>

                                            </button>

                                        </div>

                                    </div>

                                    <div class="block" data-block="1C">

                                        <div class="modals">

                                            <div class="modal" data-modal="destination">

                                                <div class="blocks" data-blocks="4">

                                                    <div class="block" data-block="1CA">

                                                        <div class="title">Destinations</div>

                                                    </div>

                                                    <div class="block" data-block="1CB">

                                                        <div class="list">

                                                            <ul>

                                                                <li>

                                                                    <div class="icon">

                                                                        <i class="icons8 icons8-location"></i>

                                                                    </div>

                                                                    <div class="text">

                                                                        <span class="one">Ibiza</span>
                                                                        <span class="two">Spain</span>

                                                                    </div>

                                                                </li>

                                                                <li class="alt">

                                                                    <div class="icon">

                                                                        <i class="icons8 icons8-location"></i>

                                                                    </div>

                                                                    <div class="text">

                                                                        <span class="one">Madrid</span>
                                                                        <span class="two">Spain</span>

                                                                    </div>

                                                                </li>

                                                                <li class="alt">

                                                                    <div class="icon">

                                                                        <i class="icons8 icons8-location"></i>

                                                                    </div>

                                                                    <div class="text">

                                                                        <span class="one">Barcelona</span>
                                                                        <span class="two">Spain</span>

                                                                    </div>

                                                                </li>

                                                                <li class="alt">

                                                                    <div class="icon">

                                                                        <i class="icons8 icons8-location"></i>

                                                                    </div>

                                                                    <div class="text">

                                                                        <span class="one">Seville</span>
                                                                        <span class="two">Spain</span>

                                                                    </div>

                                                                </li>

                                                                <li class="alt">

                                                                    <div class="icon">

                                                                        <i class="icons8 icons8-location"></i>

                                                                    </div>

                                                                    <div class="text">

                                                                        <span class="one">Palma</span>
                                                                        <span class="two">Spain</span>

                                                                    </div>

                                                                </li>

                                                            </ul>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            <div class="modal dates" data-modal="dates">

                                                <dates :query="query"></dates>

                                            </div>

                                            <div class="modal" data-modal="guests">

                                                <div class="blocks" data-blocks="5">

                                                    <div class="block" data-block="1CA">

                                                        <div class="title">Guests</div>

                                                    </div>

                                                    <div class="block" data-block="1CB">

                                                        <div class="numbers">

                                                            <div class="blocks" data-blocks="6">

                                                                <div class="block" data-block="1CBA">

                                                                    <div class="number">

                                                                        <div class="blocks" data-blocks="7">

                                                                            <div class="block" data-block="1CBAA">

                                                                                <div class="icon">

                                                                                    <i class="icons8 icons8-guardian"></i>

                                                                                </div>

                                                                                <div class="text">

                                                                                    <span class="one">Adults</span>
                                                                                    <span class="two">Ages 18+</span>

                                                                                </div>

                                                                            </div>

                                                                            <div class="block" data-block="1CBAB">

                                                                                <div class="buttons">

                                                                                    <div class="button circle alt" data-button="2A">

                                                                                        <div class="action">

                                                                                            <div class="icon">-</div>

                                                                                        </div>

                                                                                    </div>

                                                                                    <input name="quantity" value="1" class="amount" readonly>

                                                                                    <div class="button circle alt" data-button="2A">

                                                                                        <div class="action">

                                                                                            <div class="icon">+</div>

                                                                                        </div>

                                                                                    </div>

                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                                <div class="block" data-block="1CBB">

                                                                    <div class="number">

                                                                        <div class="blocks" data-blocks="8">

                                                                            <div class="block" data-block="1CBBA">

                                                                                <div class="icon">

                                                                                    <i class="icons8 icons8-guardian"></i>

                                                                                </div>

                                                                                <div class="text">

                                                                                    <span class="one">Children</span>
                                                                                    <span class="two">Ages 0-17</span>

                                                                                </div>

                                                                            </div>

                                                                            <div class="block" data-block="1CBBB">

                                                                                <div class="buttons">

                                                                                    <div class="button circle alt" data-button="2A">

                                                                                        <div class="action">

                                                                                            <div class="icon">-</div>

                                                                                        </div>

                                                                                    </div>

                                                                                    <input name="quantity" value="0" class="amount" readonly>

                                                                                    <div class="button circle alt" data-button="2A">

                                                                                        <div class="action">

                                                                                            <div class="icon">+</div>

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

                <div class="section three">

                    <div class="blocks" data-blocks="1">

                        <div class="block" data-block="1">

                            <div class="form">

                                <div class="fields">

                                    <div class="blocks" data-blocks="2">

                                        <div class="block" data-block="1A">

                                            <div class="icon">

                                                <i class="icons8 icons8-location"></i>

                                            </div>

                                        </div>

                                        <div class="block" data-block="1B">

                                            <div class="blocks" data-blocks="3">

                                                <div class="block" data-block="1BA">

                                                    <div class="text">Ibiza</div>

                                                </div>

                                                <div class="block" data-block="1BB">

                                                    <div class="blocks" data-blocks="4">

                                                        <div class="block" data-block="1BBA">

                                                            <div class="text">Dates</div>

                                                        </div>

                                                        <div class="block" data-block="1BBB">

                                                            <div class="text">Guests</div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div class="buttons">

                                    <div class="button circle" data-button="1C">

                                        <div class="action">

                                            <div class="icon">

                                                <i class="icons8 icons8-search"></i>

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
