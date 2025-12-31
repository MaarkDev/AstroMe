import '../css/crystaltab.css';
import data from '../../localdata.json';
import { useState } from 'react';
import { useEffect } from 'react';

const InformationTab = ({ crystalName, imageToShow }) => {
    const [crystalData, setCrystalData] = useState(data[crystalName]);

    const getCrystalData = () => {
        setCrystalData(data[crystalName])
    }

    useEffect(() => {
        getCrystalData();
    }, [crystalName])

    return(
    <div className='foreign-info-tab'>
        <h1>{crystalName}</h1>
        <div className='crystal-tab-content-container'>
            <div className='crystal-tab-image-container'>
                <img src={imageToShow} alt='image of a crystal'/>
            </div>
            <div className='crystal-tab-text-container'>
                <p><span className='bold'>Colours:</span> {crystalData?.Colours}</p>
                <p><span className='bold'>Degree of hardness:</span> {crystalData?.DegreeOfHardness}</p>
                <p><span className='bold'>Origin:</span> {crystalData?.Origin}</p>
                <p><span className='bold'>Description:</span> <br></br> {crystalData?.Desc}</p>
            </div>
        </div>        
    </div>
    )
}

const ForeignCrystalTab = ({ foreignImage1, foreignImage2, foreignImage3, crystalArr, foreignZodiac }) => {

    return (
        <div className='crystal-tab-outer'>
            <h1 className='foreign-tab-heading'>Crystals for a {foreignZodiac}</h1>

            {
                crystalArr.map((item, index) => (
                    <InformationTab
                        key={index}
                        crystalName={item}
                        imageToShow={index === 0 ? foreignImage1 : index === 1 ? foreignImage2 : foreignImage3}
                    />
                ))
            }
        </div>
    )
}


export default ForeignCrystalTab;