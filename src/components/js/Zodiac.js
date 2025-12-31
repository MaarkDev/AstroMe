import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/zodiac.css'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../needed/Firebase';
import AuthContext from '../../context/AuthContext';
import Loader from './Loader';

const Zodiac = ({ setShowZodiac, setCanFetchHoroscope }) => {
    const [showDd, setShowDd] = useState(false);
    const [headerContent, setHeaderContent] = useState('Select your zodiac sign');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true)
        if(user){
            if(headerContent != 'Select your zodiac sign'){
                await updateDoc(doc(db, 'users', user.uid), {
                    zodiac: headerContent.toLowerCase()
                })
                setIsLoading(false);
                setShowZodiac(false);
                setCanFetchHoroscope(true);
            }
        }else{
            handleSubmit();
        }
    }

    return(
        <div className='zodiac-page'>
            <div className='zodiac-tab'>
                <p>Before we begin, please select your zodiac sign</p>
                <div className='outer-select'  onMouseEnter={() => setShowDd(true)} onMouseLeave={() => setShowDd(false)}>
                    <div className='zodiac-select-header'>
                        <p className='zodiac-select-label'>{headerContent}</p>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    {
                        showDd ? 
                        <div className='zodiac-dd'>
                            <p onClick={() => {setHeaderContent('Aries'); setShowDd(false)}}>Aries</p>
                            <p onClick={() => {setHeaderContent('Taurus'); setShowDd(false)}}>Taurus</p>
                            <p onClick={() => {setHeaderContent('Gemini'); setShowDd(false)}}>Gemini</p>
                            <p onClick={() => {setHeaderContent('Cancer'); setShowDd(false)}}>Cancer</p>
                            <p onClick={() => {setHeaderContent('Leo'); setShowDd(false)}}>Leo</p>
                            <p onClick={() => {setHeaderContent('Virgo'); setShowDd(false)}}>Virgo</p>
                            <p onClick={() => {setHeaderContent('Libra'); setShowDd(false)}}>Libra</p>
                            <p onClick={() => {setHeaderContent('Scorpio'); setShowDd(false)}}>Scorpio</p>
                            <p onClick={() => {setHeaderContent('Sagittarius'); setShowDd(false)}}>Sagittarius</p>
                            <p onClick={() => {setHeaderContent('Capricorn'); setShowDd(false)}}>Capricorn</p>
                            <p onClick={() => {setHeaderContent('Aquarius'); setShowDd(false)}}>Aquarius</p>
                            <p onClick={() => {setHeaderContent('Pisces'); setShowDd(false)}}>Pisces</p>
                        </div>
                         : null
                    }
                </div>
                <div className='zodiac-submit-button' onClick={handleSubmit}>
                    <p>Continue</p>
                </div>
            </div>
            { isLoading ? <Loader /> : null }
        </div>
    )
}

export default Zodiac;