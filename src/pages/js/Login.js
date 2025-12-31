import '../css/login.css';
import img1 from '../../images/img1.jpg';
import img2 from '../../images/img2.jpg';
import img3 from '../../images/img3.png';
import img4 from '../../images/img4.jpg';
import img5 from '../../images/img5.png';
import img6 from '../../images/img6.jpg'; //IMPORTY
import bg from '../../images/bg.jpg';
import GoogleButton from 'react-google-button';
import { useContext, useEffect } from 'react';import AuthContext from '../../context/AuthContext';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig, auth, provider, db } from '../../needed/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore";

const Login = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const checkUser = async (user) => { //POMOCOU FIREBASE CHECKUJEME CI EXISTUJE POUZIVATEL
        try{
            const docRef = doc(db, 'users', user.uid); 
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    id: user.uid,
                    name: user.displayName,
                    bio: 'This user has not set his bio yet.',
                    pfpUrl: user.photoURL,
                    zodiac: 'und',
                    lowercaseName: user.displayName.toLowerCase(),
                    mail: user.email,
                    admin: false
                })
            }
        }catch(e){
            console.log(e);
        }
        
    }

    const signIn = async () => { // FIREBASE GOOGLE LOGIN, TOTO JE SKOPIROVANE Z DOKUMENTACIE
        
        signInWithPopup(auth, provider)
            .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            //get user to db
            checkUser(user);
            //console.log(user.email)

            setUser(user);
            navigate('/home')
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            setUser(null)
            // ...
        })
    }

    return( //MARKUP
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-container-left'>
                    <div className='login-container-left-bg'>
                        <img src={bg} />
                    </div>
                    <h1>Astrome</h1>
                    <p>Astrome is your gateway to a deeper connection with astrology. Uncover the mysteries of the cosmos and explore your astrological self like never before. Delve into a world of personalized horoscopes, track the ever-changing moon phases, uncover the enchanting properties of crystals, and embrace a wealth of wisdom, all within a single app. Whether you're seeking guidance, inspiration, or simply a moment of cosmic reflection, Astrome empowers you to embrace the universe's secrets and enrich your journey through life.</p>
                    <GoogleButton type="light" className='google-btn-login' onClick={signIn}/>
                    <p className='cookie-info'>By logging in, you acknowledge and accept the use of cookies. These cookies are exclusively of a technical nature and are essential for the proper functioning of this web application.</p>
                </div>

                

                <div className='divider'></div>

                <div className='login-container-right'>
                    <div className='login-grid-element'>
                        <img src={img1} className='login-image' />
                    </div>
                    <div className='login-grid-element'>
                        <img src={img2} className='login-image' />
                    </div>
                    <div className='login-grid-element'>
                        <img src={img3} className='login-image' />
                    </div>
                    <div className='login-grid-element'>
                        <img src={img6} className='login-image' />
                    </div>
                    <div className='login-grid-element'>
                        <img src={img5} className='login-image' />
                    </div>
                    <div className='login-grid-element'>
                        <img src={img4} className='login-image' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;