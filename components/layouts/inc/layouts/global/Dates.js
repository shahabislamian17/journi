export default function Dates() {
  return (
        <div className="blocks" data-blocks="1">
    
            <div className="block" data-block="1">
    
                <div className="buttons" >
    
                    <div className="button circle one" data-button="2A" @click="navigateDates('previous')" >
    
                        <div className="action">
    
                            <div className="icon">
    
                                <i className="icons8 icons8-less-than"></i>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="button circle two" data-button="2A" @click="navigateDates('next')">
    
                        <div className="action">
    
                            <div className="icon">
    
                                <i className="icons8 icons8-more-than"></i>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
            <div className="block" data-block="2">
    
                <div className="dates">
    
                    <div className="blocks" data-blocks="2">
    
                        <div className="block" data-block="2A" v-htmlFor="month in months" :attr="month.monthName">
    
                            <div className="month">
    
                                <div className="name">
    
                                    <div className="text">{{ month.monthName + ' ' + month.year }}</div>
    
                                </div>
    
                                <div className="days">
    
                                    <ul className="one">
    
                                        <li>
    
                                            <span>M</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>T</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>W</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>T</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>F</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>S</span>
    
                                        </li>
    
                                        <li>
    
                                            <span>S</span>
    
                                        </li>
    
                                    </ul>
    
                                    <ul className="two">
    
                                        <template v-htmlFor="(week, i) in month.weeks">
    
                                            <template v-htmlFor="day in week">
    
                                                <li  className="alt"><span></span></li>
    
                                                <li v-else @click="selectDay(day)" :className="setDayClass(day.date)">
    
                                                    <span >{{ day.day }}</span>
    
                                                </li>
    
                                            </template>
    
                                        </template>
    
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
