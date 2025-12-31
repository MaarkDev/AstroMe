import {auth} from '../../needed/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/js/Navbar';  // IMPORTY KTORE POTREBYJEME VSETKO CO TU VIDIS
import '../css/home.css'
import '../pagecontent.css'; //CSS IMPORTY
import { useContext, useEffect, useState } from 'react'; //REACT FUNKCIA IMPORTY
import AuthContext from '../../context/AuthContext';
import bg from '../../images/bg.jpg';
import DatePicker from '../../components/js/DatePicker';
import ProfileWidget from '../../components/js/ProfileWidget';
import { updateDoc, doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore'; // FIREBASE FUNKCIA
import { db } from '../../needed/Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  //IMPORT NA IKONT
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../components/js/Loader';
import TabLoader from '../../components/js/TabLoader';  //KOMPONENTY
import DbUserContext from '../../context/DbUserContext';
import Zodiac from '../../components/js/Zodiac';

const Home = () => {
    const { user, setUser } = useContext(AuthContext);
    const { dbUser, setDbUser } = useContext(DbUserContext);

    const [stateUser, setStateUser] = useState();
    const [quoteObj, setQuoteObj] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState(); // TOTO VSETKO SU USESTATE PREMENNE
    const [whichDay, setWhichDay] = useState('TODAY'); 
    const [customDate, setCustomDate] = useState(false);
    const [position, setPosition] = useState();
    const [moonData, setMoonData] = useState();
    const [starsData, setStarsData] = useState();
    const [nasaData, setNasaData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState();
    const [showZodiac, setShowZodiac] = useState(false);
    const [canFetchHoroscope, setCanFetchHoroscope] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {                
        //location
        getPosition(); //ZISKAVAME POLOHU PRI NACITANI ABY SME VEDELI ZE KDE SME KVOLI API PRE MESIAC A HVIEZDNU OBLOHU
    },[])

    const checkSaved = async (userId) => { //CHECKUJEME CI SME UZ ULOZILI DNESNY DEN
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const docRef = doc(db, 'users', userId, 'SavedDays', formattedDate);
        const docRes = await getDoc(docRef)
        if(docRes.exists()){
            setIsSaved(true);
        }else{
            setIsSaved(false);
        }
        
    }

    const getPosition = async () => { //FUNKCIA KTORA VOLA PI NA ZISKANIE IP A SURADNIC
        const ip = await fetch('https://api.bigdatacloud.net/data/client-ip');
        const ipJson = await ip.json();

        const url = 'https://corsproxy.io/?' + `http://api.ipstack.com/${ipJson.ipString}?access_key=${process.env.REACT_APP_LOC_API}`
        const loc = await fetch(url);
        const locJson = await loc.json();
        //console.log(locJson)

        setPosition({
            lat: parseInt(locJson.latitude),
            lng: parseInt(locJson.longitude)
        })

    }

    const fetchNewQuote = async (userId) => { //ZISKAVANIE NOVEHO CITATU
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        let userData = null;

        if(userDoc.exists()){
            //console.log('OK');
            userData = userDoc.data();
            const lastDateFetched = userData?.lastQuoteFetch || "2000-01-01";
            const lastDateString = new Date(lastDateFetched).toDateString();
            const today = new Date().toDateString();

            if(lastDateString != today){ // POZERAMY KEDY BOL POSLEDNY, AK NIE DNES FETCHNEME NOVY, AK DNES ZOBRAZIME ULOZENY
                //console.log('FETHCING NEW')
                const quoteDate = new Date()
                const year = quoteDate.getFullYear();
                const month = String(quoteDate.getMonth() + 1).padStart(2, '0');
                const day = String(quoteDate.getDate()).padStart(2, '0');
                // Format the date as "YYYY-MM-DD" string
                const formattedDate = `${year}-${month}-${day}`;
    
                const categories = ['inspirational', 'love'];
                const r = Math.floor(Math.random() * 2);
                const quoteRes = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${categories[r]}`, {
                    method: 'GET',
                    headers: { 'X-Api-Key': process.env.REACT_APP_QUOTES_KEY},
                    contentType: 'application/json'
                });
    
                const quoteData = await quoteRes.json()
                //console.log(quoteData[0]);
                setQuoteObj(quoteData[0]);
                await updateDoc (userRef, {
                    lastQuoteFetch: formattedDate,
                    quote: quoteData[0].quote,
                    author: quoteData[0].author
                });
            }else{
                //console.log('im here\n\n')
                setQuoteObj({ quote: userData.quote, author: userData.author})
            }
        }else{
            fetchNewQuote(userId)
        }

    }

    useEffect(() => { //CHECKUJEME CITAT POMOCOU USER ID V DB
        //console.log(user)
        
        if(user){
            fetchNewQuote(user.uid);
            checkSaved(user.uid);
        }
    }, [user])

    const fetchHoroscopeByDate = async (horoscopeDate) => { //FETCHUJEME HOROSKOP POMOCOU DATUMU
        // Get the year, month, and day components
        const year = horoscopeDate.getFullYear();
        const month = String(horoscopeDate.getMonth() + 1).padStart(2, '0');
        const day = String(horoscopeDate.getDate()).padStart(2, '0');

        // Format the date as "YYYY-MM-DD" string
        const formattedDate = `${year}-${month}-${day}`;
        //console.log('date: ' + formattedDate)
        const horoscopeRes = await fetch(`https://corsproxy.io/?https%3A%2F%2Fhoroscope-app-api.vercel.app%2Fapi%2Fv1%2Fget-horoscope%2Fdaily%3Fsign%3Dpisces%26day%3D${formattedDate}`);
        if(horoscopeRes.status == 400){
            setHoroscopeData({
                data: { horoscope_data: 'Oops, no horoscope for this day was found.' }
            })
        }else{
            const horoscopeData = await horoscopeRes.json();
            //console.log(horoscopeData);
            setHoroscopeData(horoscopeData);
        }
        
    }

    const fetchHoroscopeByString = async () => { //FETCHUJEME HOROSKOP POMOCOU  SLOVA CI JE TODAY, YESTERDAY ALEBO TOMORROW, TO SU TIE BUTTONY NA DOM. OBRAZOVKE
        if(user){
            const zodaicReq = await getDoc(doc(db, 'users', user.uid))
            const ZodiacRes = zodaicReq.data();
            //console.log('ZODIACRES')
            //console.log(ZodiacRes)
            if(ZodiacRes?.zodiac != 'und' && zodaicReq.exists()){
                const zodiac = ZodiacRes.zodiac;
                const horoscopeRes = await fetch(`https://corsproxy.io/?https%3A%2F%2Fhoroscope-app-api.vercel.app%2Fapi%2Fv1%2Fget-horoscope%2Fdaily%3Fsign%3D${zodiac}%26day%3D${whichDay}`);
                if(horoscopeRes.status == 400){
                    setHoroscopeData({
                        data: { horoscope_data: 'Oops, no horoscope for this day was found.' }
                    })
                    return;
                }
                const horoscopeData = await horoscopeRes.json();
                setHoroscopeData(horoscopeData);
                //console.log(horoscopeData);
                
            }else{
                setShowZodiac(true);
            }
        }
    }

    useEffect(() => { 
    
        fetchHoroscopeByString();
        
        
    }, [canFetchHoroscope, user])


    useEffect(() => { //KED POUZIVATEL KLIKNE NA BUTTON, FETCHNI PODLA TOHO NA AKY KLIKOL
        const fetchAsync = async () => {
            await fetchHoroscopeByString();
        }
        fetchAsync();
    }, [whichDay]);

    const fetchMoonApi = async () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const authString = btoa(`${process.env.REACT_APP_ASTROAPI_APPID}:${process.env.REACT_APP_ASTROAPI_SEC}`);
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://api.astronomyapi.com/api/v2/studio/moon-phase')
        const urlLcl = 'https://api.astronomyapi.com/api/v2/studio/moon-phase'
        console.log(urlLcl)
        const moonRes = await fetch(urlLcl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authString}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "format": "png",
                "observer": {
                    "date": formattedDate,
                    "latitude": position.lat,
                    "longitude": position.lng
                },
                "style": {
                    "moonStyle": "shaded",
                    "backgroundStyle": "solid",
                    "backgroundColor": "aliceblue",
                    "headingColor": "black",
                    "textColor": "black"
                },
                
                "view": {
                    "type": "landscape-simple",
                    "orientation": "south-up"
                }
            })
        })
        const moonJson = await moonRes.json();
        setMoonData(moonJson?.data?.imageUrl);
    }

    const fetchStarsApi = async () => { //FETHCUJEME NOCNU OBLOHU
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const authString = btoa(`${process.env.REACT_APP_ASTROAPI_APPID}:${process.env.REACT_APP_ASTROAPI_SEC}`);
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://api.astronomyapi.com/api/v2/studio/star-chart')
        const urlLcl = 'https://api.astronomyapi.com/api/v2/studio/star-chart';
        const starsRes = await fetch(urlLcl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authString}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "style": "navy",
                "observer": {
                    "latitude": position.lat,
                    "longitude": position.lng,
                    "date": formattedDate
                },
                "view": {
                    "type": "constellation",
                    "parameters": {
                        "constellation": "ori"
                    }
                }
            })
        })
        const starsJson = await starsRes.json();
        console.log(starsJson);
        setStarsData(starsJson?.data?.imageUrl);
    }

    const fetchAPOD = async () => { //FETCHUJEME NASA
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_KEY}`)
        const apodJSON = await apodRes.json();
        //console.log(apodJSON);
        setNasaData(apodJSON);
    }

    useEffect(() => { //AK MAME SURADNICE, TECHUJEME TIETO 3 API
        const fetchMoonApiUseEffect = async () => {
            await fetchMoonApi();
            await fetchStarsApi();
            await fetchAPOD();
        } 
        if(position){
            fetchMoonApiUseEffect();
        }
        //console.log(position)
    }, [position])

    const saveDayToDb = async () => { //UKLADAME POMOCOU FIREBASE FUNKCII DO DATABAZY ULOZENY DEN
        setIsLoading(true);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const docRef = doc(db, 'users', user.uid, 'SavedDays', formattedDate);
        if(!isSaved){
            await setDoc(docRef, {
                quote: quoteObj.quote,
                author: quoteObj.author,
                date: horoscopeData.data.date,
                horoscope: horoscopeData.data?.horoscope_data,
                moon: moonData,
                nasa: nasaData.hdurl,
                nasatitle: nasaData.title,
                nasaexplanation: nasaData.explanation,
                stars: starsData,
                date: formattedDate,
                time: new Date().getTime()
            })
            setIsSaved(true);
        }else{
            await deleteDoc(docRef);
            setIsSaved(false);
        }
        setIsLoading(false)
        
    }

    return ( //MARKUP
        <div className="home-page">
            <div className='page-content'>
                <div className='home-welcome-section'>
                    <h1 className='home-greeting'>Welcome, {dbUser?.name}!</h1>
                    <h1 className='save-day' onClick={saveDayToDb}><FontAwesomeIcon icon={faHeart} /> {!isSaved ? "Save day" : "Unsave day"} </h1>
                    <div className='home-quote-block'>
                        <p className='home-quote-block-heading'>Todays quote of the day is:</p>
                        <p className='home-quote-block-quote'>{quoteObj?.quote}</p>
                        <p className='home-quote-block-author'>~{quoteObj?.author}</p>
                    </div>
                </div>

                <div className='home-moon-horoscope-section'>
                    <div className='home-horoscope-section'>
                        <p className='home-quote-block-heading'>Horoscope</p>
                        <p>{horoscopeData?.data?.date}</p>
                        <div className='home-horoscope-date-window'>
                            <div className='home-horoscope-date-first-row'>
                                <p onClick={() => {setWhichDay('YESTERDAY'); setCustomDate(false)}} className={ whichDay == 'YESTERDAY' && !customDate ? 'selectedHorDay' : '' }>Yesterday</p>
                                <p onClick={() => {setWhichDay('TODAY'); setCustomDate(false)}} className={ whichDay == 'TODAY' && !customDate ? 'selectedHorDay' : '' }>Today</p>
                                <p onClick={() => {setWhichDay('TOMORROW'); setCustomDate(false)}} className={ whichDay == 'TOMORROW' && !customDate ? 'selectedHorDay' : '' }>Tomorrow</p>
                                <p onClick={() => {setShowPicker(true); setCustomDate(true)}} className={ customDate ? 'selectedHorDay' : '' }>Pick a date</p>
                            </div>
                            <div className='home-horoscope-date-second-row'>
                                
                            </div>
                        </div>
                        <p className='home-horoscope-text'>
                            {
                                horoscopeData ? horoscopeData.data?.horoscope_data  : <TabLoader />
                            }
                        </p>
                    
                    </div>
                    <div className='ver-divider'></div>
                    <div className='home-moon-section'>
                        <p className='home-quote-block-heading'>Moon</p>
                        <div className='moon-image-wrapper'>
                            <img src={moonData} className='moon-img'/>
                            {!moonData && <TabLoader />}
                        </div>
                    </div>
                </div>

                <div className='home-stars-apod-section'>
                <div className='home-apod-section home-moon-section'>
                        <p className='home-quote-block-heading'>NASA's Astronomy Picture Of The Day</p>
                        <p className='nasa-photo-p'>{nasaData?.date}</p>
                        <div className='nasa-photo-text-container'>
                            {!nasaData && <TabLoader />}
                            <div className='nasa-photo-wrapper'>
                                <img src={nasaData?.hdurl}/>
                            </div>
                            <div className='ver-divider'></div>
                            <div className='nasa-photo-text'>
                                <p className='home-quote-block-heading'><b>{nasaData?.title}</b></p>
                                <p className='nasa-photo-p nasa-photo-desc'>{nasaData?.explanation}</p>
                            </div>
                        </div>
                    </div>
                    <div className='ver-divider'></div>
                    <div className='home-stars-section home-moon-section'>
                        
                        <p className='home-quote-block-heading'>Today's night sky</p>
                        <div className='stars-image-wrapper'>
                            {starsData ? <img src={starsData} className='stars-img'/> : <TabLoader />}
                        </div>
                    </div>
                </div>
            </div>
            
            {
            // PODMIENKA ? (AK TRUE) UROB A : (AK FALSE) UROB B
                showPicker ? <DatePicker showPicker={showPicker} setShowPicker={setShowPicker}
                                setCustomDate={setCustomDate} fetchHoroscopeByDate={(dateObj) => fetchHoroscopeByDate(dateObj)}/> : null
            }
            {
                isLoading ? <Loader /> : null
            }
            {
                showZodiac ? <Zodiac setShowZodiac={setShowZodiac} setCanFetchHoroscope={setCanFetchHoroscope}/> : null
            }
        </div>
    )
}

export default Home;