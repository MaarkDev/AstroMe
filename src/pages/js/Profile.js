import '../pagecontent.css';
import Navbar from '../../components/js/Navbar';
import bg from '../../images/bg.jpg';
import '../css/profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { auth } from '../../needed/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import SavedDay from '../../components/js/SavedDay'; //IMPRORTY
import { db } from '../../needed/Firebase';
import { doc, getDocs, collection, getDocsFromServer, setDoc, query, orderBy, getCountFromServer } from 'firebase/firestore';
import Post from '../../components/js/Post';
import {Cloudinary} from "@cloudinary/url-gen";
import { v4 as uuidv4 } from 'uuid';
import EditProfile from '../../components/js/EditProfile';
import DbUserContext from '../../context/DbUserContext';
import Loader from '../../components/js/Loader';
import CommentBox from '../../components/js/CommentBox';

const Profile = () => {
    const [wallSelectClass, setWallSelectClass] = useState('profile-tab active-tab');
    const [daySelectClass, setDaySelectClass] = useState('profile-tab');
    const { user } = useContext(AuthContext);
    const { dbUser, setDbUser } = useContext(DbUserContext);

    const [showSaved, setShowSaved] = useState(false);
    const [daysArray, setDaysArray] = useState([]);
    const [postsArray, setPostsArray] = useState([]);

    const [showEditProfile, setShowEditProfile] = useState(false); // DEFINICIA REACT PREMENNYCH
    const [isLoading, setIsLoading] = useState(false);

    const [postCount, setPostCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);

    const [usersLiked, setUsersLiked] = useState([]);

    const [showComments, setShowComments] = useState(false);
    const [currentPost, setCurrentPost] = useState();

    const navigate = useNavigate();

    const onWallSelect = () => { //AK KLIMENEM NA WALL, ZOBRAZ WALL
        setWallSelectClass('profile-tab active-tab');
        setDaySelectClass('profile-tab');
        setShowSaved(false);
        setDaysArray([]);
    }

    const onDaySelect = () => { //AK KLIKNEME NA DEN, ZOBRAZ DNI
        setDaySelectClass('profile-tab active-tab');
        setWallSelectClass('profile-tab');
        setShowSaved(true);
    }

    const logOut = async () => { //ODHLASENIE
        signOut(auth).then(() => {
            navigate('/login')
        })
    }

    const fetchDays = async () => { //FETHCOCVANIE ULOZENYCH DNI POMOCOU FIREBASE FUNKCII
        const collRef = collection(db, 'users', user.uid, 'SavedDays');
        const sortedDocs = [];

        const daysRes = await getDocsFromServer(collRef);
        daysRes.forEach((doc) => {
            sortedDocs.push(doc.data());
        })

        sortedDocs.sort((a, b) => a.time - b.time);
        sortedDocs.reverse();
        setDaysArray(sortedDocs);
    }
    
    const fetchWall = async () => { //FETCHOVANIE STENZ PROFILU POMOCOU FIREBASE FUNKCII
        const collRef = collection(db, 'users', user.uid, 'Posts');
        const sortedDocs = [];

        const postsRes = await getDocsFromServer(collRef);
        let count = 0;
        postsRes.forEach((doc) => {
            sortedDocs.push(doc.data());
            count++;
        })
        setPostCount(count)
        sortedDocs.sort((a, b) => a.time - b.time); //ZORADOVANIE PODLA CASU
        sortedDocs.reverse();
        setPostsArray(sortedDocs);
    }

    const countFollowers = async () => { //SPOCITANIE FOLLOWERV
        const followersRef = collection(db, 'users', user.uid, 'Followers');
        const followersRes = await getCountFromServer(followersRef);
        const count = followersRes.data().count;
        setFollowersCount(count)
    }

    const getUsersLiked = async () => {
        const likedRef = collection(db, 'users', user.uid, 'LikedPosts');
        const likedRes = await getDocs(likedRef);
        let likedArr = [];
        likedRes.docs.forEach(doc => {
            const docData = doc.data();
            likedArr.push(docData.postId);
        })
        setUsersLiked(likedArr);
    }

    useEffect(() => { //AK MAME POUZIVATELA, UROB TOTO
        if(user){
            countFollowers();
            getUsersLiked();
        }
    }, [user])


    useEffect(() => { //AK KLIKNEME NA NA SAVED DAYS, NECH TO FETCHNE ULOZENE DNI
        if(showSaved){
            console.log('here')
            fetchDays();
        }
    }, [showSaved])

    useEffect(() => {
        if(!showSaved && user){
            fetchWall();
        }
    }, [user, showSaved])

    

    const uploadNewPost = async (e) => { //PRIDANIE NOVEHO POSYU POMOCOU FIREBASE, NAHRAVANIE FOTIEK NA CLOUDINARY
        e.preventDefault();
        const attachedPhoto = e.target.attachedPhoto.files[0];
        const postText = e.target.postText.value;
        console.log(attachedPhoto)

        if(attachedPhoto){
            const newFormData = new FormData();
            newFormData.append('file', attachedPhoto);
            newFormData.append("upload_preset", "fe7qwoaw");

            const cloudinaryData = await fetch(process.env.REACT_APP_CLOUDINARY_API_UPLOAD, { //NAHRAVANIE NA CLOUDIANRY POMCOU BASE64 FORMATU OBRAZKA
                method: "POST",
                body: newFormData
            }).then((res) => res.json()).catch(e => console.log(e));

            const cloudinaryURL = cloudinaryData.url;

            const postId = uuidv4();
            const docRef = doc(db, 'users', user.uid, 'Posts', postId);
            await setDoc(docRef, {
                userId: user.uid,
                postId: postId,
                text: postText,
                photoUrl: cloudinaryURL,
                likeNumber: 0,
                type: 'original',
                name: user.displayName,
                pfpUrl: user.photoURL,
                time: new Date().getTime()
            })
        }else{
            const postId = uuidv4(); //GENEROVANIE RANDOM ID
            const docRef = doc(db, 'users', user.uid, 'Posts', postId);
            await setDoc(docRef, {
                userId: user.uid,
                postId: postId,
                text: postText,
                likeNumber: 0,
                comments: [],
                type: 'original',
                name: user.displayName,
                pfpUrl: user.photoURL,
                time: new Date().getTime()
            })
        }
        
        e.target.reset();
        setPostsArray([]);
        await fetchWall();

    }

    useEffect(() => {
        console.log(user);
    }, [user])

    return( //MARKUP
        <div className="profile-page">
            <div className='page-content'>
                <div className='profile-info'>
                    <div className='edit-icon'>
                        <FontAwesomeIcon icon={faPencil} onClick={() => setShowEditProfile(true)}/>
                    </div>
                    <div className='profile-info-photo-name'>
                        <img src={dbUser?.pfpUrl} alt='profile-photo' />
                        <h1>{dbUser?.name}</h1>
                    </div>
                    <div className='profile-stats'>
                        <p>Posts: {postCount}</p>
                        <p>Followers: {followersCount}</p>
                    </div>
                    <div className='profile-buttons'>
                        <div className='logout-button' onClick={logOut}>
                            <p>Log Out</p>
                        </div>
                    </div>
                    
                    <p>{dbUser?.bio}</p>
                </div>

                <div className='profile-content'>
                    <div className='profile-tab-selection'>
                        <div className={wallSelectClass} onClick={onWallSelect}>
                            <p>Wall</p>
                        </div>
                        <div className={daySelectClass} onClick={onDaySelect}>
                            <p>Saved</p>
                        </div>
                        
                    </div>
                    <div className='profile-content-container'>
                        {
                            showSaved 
                            ? 

                                daysArray.length != 0 ? daysArray.map((day) => <SavedDay data={day} />) : <p className='no-day-message'>You have not saved any of your days yet.</p>         

                            :
                                <div className='profile-wall'>
                                    <form name='new-post-form' onSubmit={uploadNewPost}>
                                        <div className='profile-add-post'>
                                            <textarea placeholder='Something on your mind?' name='postText'/>
                                            <div className='profile-add-buttons'>
                                                <div className='profile-attach-file-button'>
                                                    <p><FontAwesomeIcon icon={faPaperclip} /> Attach a photo</p>
                                                    <input type='file' className='post-file-input' name='attachedPhoto' />
                                                </div>
                                                
                                                <div className='profile-post-button'>
                                                    <button type="submit" className='no-opacity'>
                                                        <p><FontAwesomeIcon icon={faPaperPlane} /> Post</p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {
                                        postsArray.map((data) => <Post data={data} fetchWall={fetchWall} usersLiked={usersLiked} getUsersLiked={getUsersLiked} setShowComments={setShowComments} setCurrentPost={setCurrentPost}/>)
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
            {showEditProfile ? <EditProfile setShowEditProfile={setShowEditProfile} setIsLoading={setIsLoading}/> : null}
            {isLoading ? <Loader /> : null}
            {showComments ? <CommentBox setShowComments={setShowComments} currentPost={currentPost}/> : null}
        </div>
    )
}

export default Profile;