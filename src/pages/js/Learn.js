import '../pagecontent.css';
import '../css/learn.css';
import Navbar from '../../components/js/Navbar';
import bg from '../../images/bg.jpg';
import data from '../../localdata.json';
import { useState, useContext, useEffect } from 'react';
import DbUserContext from '../../context/DbUserContext';
import CrystalTab from '../../components/js/CrystalTab'; 

import agateImg from '../../images/crystals/Agate.jpg';
import amberImg from '../../images/crystals/Amber.jpg';
import amethystImg from '../../images/crystals/Amethyst.jpg';
import andalusiteImg from '../../images/crystals/Andalusite.jpg';
import aquamarineImg from '../../images/crystals/Aquamarine.jpg';
import aventurineImg from '../../images/crystals/Aventurine.jpg';
import carnelianImg from '../../images/crystals/Carnelian.jpg';
import chalcedonyImg from '../../images/crystals/Chalcedony.jpg';
import chrysocollaImg from '../../images/crystals/Chrysocolla.jpg';
import citrineImg from '../../images/crystals/Citrine.jpg';
import crystalImg from '../../images/crystals/Crystal.jpg';
import fluoriteImg from '../../images/crystals/Fluorite.jpg';
import garnetImg from '../../images/crystals/Garnet.jpg';
import hematiteImg from '../../images/crystals/Hematite.jpg';
import jadeiteImg from '../../images/crystals/Jadeite.jpg';
import jasperImg from '../../images/crystals/Jasper.jpg';
import kunziteImg from '../../images/crystals/Kunzite.jpg';
import lapislazuliImg from '../../images/crystals/LapisLazuli.jpg';
import malachiteImg from '../../images/crystals/Malachite.jpg';
import obsidianImg from '../../images/crystals/Obsidian.jpg';
import roseImg from '../../images/crystals/Rose.jpg';
import smokyQuartzImg from '../../images/crystals/SmokyQuartz.jpg';
import sodaliteImg from '../../images/crystals/Sodalite.jpg';
import tigersEyeImg from "../../images/crystals/TigersEye.jpg";
import topazImg from '../../images/crystals/Topaz.jpg';
import tourmalineImg from '../../images/crystals/Tourmaline.jpg';
import turquoiseImg from '../../images/crystals/Turquoise.jpg';
import ForeignCrystalTab from '../../components/js/ForeignCrystalTab';

const imageMap = {
    agate: agateImg,
    amber: amberImg,
    amethyst: amethystImg,
    andalusite: andalusiteImg,
    aquamarine: aquamarineImg,
    aventurine: aventurineImg,
    carnelian: carnelianImg,
    chalcedony: chalcedonyImg,
    chrysocolla: chrysocollaImg,
    citrine: citrineImg,
    crystal: crystalImg,
    fluorite: fluoriteImg,
    garnet: garnetImg,
    hematite: hematiteImg,
    jadeite: jadeiteImg,
    jasper: jasperImg,
    kunzite: kunziteImg,
    lapislazuli: lapislazuliImg,
    malachite: malachiteImg,
    obsidian: obsidianImg,
    rose: roseImg,
    smokyquartz: smokyQuartzImg,
    sodalite: sodaliteImg,
    tigerseye: tigersEyeImg,
    topaz: topazImg,
    tourmaline: tourmalineImg,
    turquoise: turquoiseImg,
  };
  
const Learn = () => {
    const { dbUser } = useContext(DbUserContext);
    const [userCrystalsArr, setUserCrystalsArr] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    const [foreignZodiac, setForeignZodiac] = useState('Capricorn');
    const [foreignCrystalArray, setForeigntCrystalArr] = useState([]);

    const [learningCrystalName, setLearningCrystalName] = useState('Amethyst')

    useEffect(() => {
        if(dbUser?.zodiac){
            getForeignZodiacData();
            createUserCrystalsArr();
        }
    }, [dbUser])

    const createUserCrystalsArr = () => {
        const zodiac = dbUser.zodiac;

        const formattedZodiac = zodiac.charAt(0).toUpperCase() + zodiac.slice(1);
        const zodiacData = data.zodiac[formattedZodiac];

        setUserCrystalsArr(zodiacData);
    }

    useEffect(() => {
        getForeignZodiacData();
    }, [foreignZodiac])

    const getForeignZodiacData = () => {
        const zodiacData = data.zodiac[foreignZodiac];
        setForeigntCrystalArr(zodiacData);
    }

    return(
        <div className="learn-page">
            <div className='page-content'>

                <div className='learn-heading'>
                    <h1 className='learn-page-heading'>Crystals for your soul</h1>
                    <p>{}</p>
                </div>

                <div className='crystals-for-you-grid'>

                    <div className='crystals-for-you-grid-el' onClick={() => setTabIndex(0)}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap[userCrystalsArr[0]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>{userCrystalsArr[0]}</p>
                    </div>

                    <div className='crystals-for-you-grid-el' onClick={() => setTabIndex(1)}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap[userCrystalsArr[1]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>{userCrystalsArr[1]}</p>
                    </div>

                    <div className='crystals-for-you-grid-el' onClick={() => setTabIndex(2)}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap[userCrystalsArr[2]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>{userCrystalsArr[2]}</p>
                    </div>
                    
                </div> 

                <CrystalTab imageToShow={imageMap[userCrystalsArr[tabIndex]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} crystal={userCrystalsArr[tabIndex]}/>


                <div className='learn-heading'>
                    <h1 className='learn-page-heading secondary'>Learn about crystals for other zodiac signs</h1>
                </div>
                <div className='crystals-foreign-grid'>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Capricorn')}>
                        <p className='foreign-zodiac'>Capricorn </p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Aquarius')}>
                        <p className='foreign-zodiac'>Aquarius</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Pisces')}>
                        <p className='foreign-zodiac'>Pisces</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Aries')}>
                        <p className='foreign-zodiac'>Aries</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Taurus')}>
                        <p className='foreign-zodiac'>Taurus</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Gemini')}>
                        <p className='foreign-zodiac'>Gemini</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Cancer')}>
                        <p className='foreign-zodiac'>Cancer</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Leo')}>
                        <p className='foreign-zodiac'>Leo</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Virgo')}>
                        <p className='foreign-zodiac'>Virgo</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Libra')}>
                        <p className='foreign-zodiac'>Libra</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Scorpio')}>
                        <p className='foreign-zodiac'>Scorpio</p>
                    </div>
                    <div className='crystals-for-you-grid-el' onClick={() => setForeignZodiac('Sagittarius')}>
                        <p className='foreign-zodiac'>Sagittarius</p>
                    </div>
                </div> 

                <ForeignCrystalTab
                    foreignImage1={imageMap[foreignCrystalArray[0]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} 
                    foreignImage2={imageMap[foreignCrystalArray[1]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} 
                    foreignImage3={imageMap[foreignCrystalArray[2]?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} 
                    crystalArr={foreignCrystalArray}
                    foreignZodiac={foreignZodiac}
                />

                <div className='learn-heading'>
                    <h1 className='learn-page-heading secondary'>The crystal encyclopedia</h1>
                </div>
                <div className='crystals-crystals-grid'>

                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Agate")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Agate"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Agate</p>
                    </div>

                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Amber")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Amber"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Amber</p>
                    </div>

                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Amethyst")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Amethyst"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Amethyst</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Andalusite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Andalusite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Andalusite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Aquamarine")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Aquamarine"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Aquamarine</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Aventurine")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Aventurine"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Aventurine</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Carnelian")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Carnelian"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Carnelian</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Chalcedony")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Chalcedony"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Chalcedony</p>
                    </div>

                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Chrysocolla")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Chrysocolla"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} alt='crystal' />
                        </div>
                        <p className='crystal-icon-label'>Chrysocolla</p>
                    </div>
                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Citrine")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Citrine"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Citrine</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Crystal")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Crystal"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} alt='crystal' />
                        </div>
                        <p className='crystal-icon-label'>Crystal</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Fluorite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Fluorite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} alt='crystal' />
                        </div>
                        <p className='crystal-icon-label'>Fluorite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Garnet")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Garnet"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Garnet</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Hematite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Hematite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} alt='crystal' />
                        </div>
                        <p className='crystal-icon-label'>Hematite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Jadeite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Jadeite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Jadeite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Jasper")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Jasper"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Jasper</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Kunzite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Kunzite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Kunzite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Lapis Lazuli")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Lapis Lazuli"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Lapis Lazuli</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Malachite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Malachite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Malachite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Obsidian")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Obsidian"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Obsidian</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Rose")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Rose"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Rose</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Sodalite")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Sodalite"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Sodalite</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Smoky Quartz")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Smoky Quartz"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Smoky Quartz</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Tiger's Eye")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Tiger's Eye"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Tiger's Eye</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Topaz")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Topaz"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Topaz</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Tourmaline")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Tourmaline"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Tourmaline</p>
                    </div>

                    
                    <div className='crystals-for-you-grid-el' onClick={() => setLearningCrystalName("Turquoise")}>
                        <div className='crystal-icon-container'>
                            <img src={imageMap["Turquoise"?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]}  alt='crystal'/>
                        </div>
                        <p className='crystal-icon-label'>Turquoise</p>
                    </div>

                </div> 

                <CrystalTab 
                imageToShow={imageMap[learningCrystalName?.replace(/'/g, "").replace(/\s+/g, "").toLowerCase()]} 
                crystal={learningCrystalName}
                />

            </div>
        </div>
    )
}

export default Learn;