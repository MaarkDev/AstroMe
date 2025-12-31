import { useEffect } from 'react'
import '../css/savedday.css'

const SavedDay = ({ data }) => {

    return(
        <div className='saved-day-outer'>
            <h1>{data?.date.replace(/-/g, '/')}</h1>
            <div className='saved-day-quote-section'>
                <p className='saved-day-quote-first'>Days quote:</p>
                <p className='saved-day-quote'>{data?.quote}</p>
                <p className='saved-day-quote-author'>~{data?.author}</p>
            </div>
            <div className='saved-day-horoscope-section'>
                <p className='saved-day-horoscope-heading'>Horoscope for that day</p>
                <p className='saved-day-horoscope-text'>{data?.horoscope}</p>
            </div>
            <div className='saved-day-moon-section'>
                <p className='saved-day-moon-heading'>Moon on that day</p>
                <img src={data?.moon} alt='moondata'/>
            </div>
            <div className='saved-day-nasa-section'>
                <p className='saved-day-nasa-title'>NASA's Astronomy Picture Of That Day</p>
                <div className='saved-day-nasa-details'>
                    <div className='saved-day-nasa-photo'>
                        <img src={data?.nasa} alt='nasadata'/>
                    </div>
                    <div className='saved-day-nasa-text'>
                        <p className='saved-day-nasa-name'>{data.nasatitle}</p>
                        <p>{data?.nasaexplanation}</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default SavedDay