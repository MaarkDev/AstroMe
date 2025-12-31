import { useEffect, useState } from 'react';
import '../css/datepicker.css'

const DatePicker = ({showPicker, setShowPicker, setCustomDate, fetchHoroscopeByDate}) => {
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [dateObj, setDateObj] = useState();
    const [dateValid, setDateValid] = useState(true);

    const dateValidation = () => {
        const currentDate = new Date(); // Get the current date and time
        const newDateObject = new Date(parseInt(year), parseInt(month - 1), parseInt(day));
    
        const monthlist1 = [1, 3, 5, 7, 8, 10, 12]; // 31 days
        const monthlist2 = [4, 6, 9, 11]; // 30 days
        const monthlist3 = [2]; // 28 days
    
        const intm = parseInt(month);
        if(intm < 1 || intm > 12){
            console.log('invalid');
            setDateValid(false);
            return;
        }

        if (monthlist1.includes(intm)) {
            if (day >= 1 && day <= 31) {
                console.log('valid');
                setDateValid(true);
            } else {
                console.log('invalid');
                setDateValid(false);
                return;
            }
        } else if (monthlist2.includes(intm)) {
            if (day >= 1 && day <= 30) {
                console.log('valid');
                setDateValid(true);
            } else {
                console.log('invalid');
                setDateValid(false);
                return;
            }
        } else if (monthlist3.includes(intm)) {
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
            if (isLeapYear && day >= 1 && day <= 29) {
                console.log('valid');
                setDateValid(true);
            } else if (!isLeapYear && day >= 1 && day <= 28) {
                console.log('valid');
                setDateValid(true);
            } else {
                console.log('invalid');
                setDateValid(false);
                return;
            }
        }

        //check if date in future
        if(newDateObject > currentDate){
            setDateValid(false);
            console.log('invalid');
            return;
        }else{
            setDateValid(true);
            console.log('valid');
            setCustomDate(newDateObject);
            fetchHoroscopeByDate(newDateObject);
            setShowPicker(false);
        }
    };
    

    const submit = () => {
        dateValidation();
    }

    return(
        <div className='picker-page' onClick={() =>  {setShowPicker(false); setCustomDate(false)}}>
            <div className='picker-outer' onClick={(e) => e.stopPropagation()}>
                <h1>Pick a date up to a year back</h1>
                <div className='picker-inputs'>
                    <input type='number' placeholder='Day' onChange={(e) => setDay(e.target.value)}/>
                    <input type='number' placeholder='Month' onChange={(e) => setMonth(e.target.value)}/>
                    <input type='number' placeholder='Year' onChange={(e) => setYear(e.target.value)}/>
                </div>
                {dateValid ? null : <div className='date-validity'>
                    <p>Date invalid</p>
                </div>}
                <div className='picker-button' onClick={() => submit()}>
                    <p>Select</p>
                </div>
            </div>
        </div>
        
    )
}  

export default DatePicker;