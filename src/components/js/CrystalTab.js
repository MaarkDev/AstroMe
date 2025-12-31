import '../css/crystaltab.css';
import data from '../../localdata.json';
import { useState } from 'react';
import { useEffect } from 'react';

const CrystalTab = ({ imageToShow, crystal }) => {
    const [crystalData, setCrystalData] = useState();

    const getCrystalData = () => {
        console.log(data[crystal]);
        setCrystalData(data[crystal])
    }

    useEffect(() => {
        getCrystalData();
    }, [crystal])

    return(
        <div className='crystal-tab-outer'>
            <h1>{crystal}</h1>
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

export default CrystalTab;