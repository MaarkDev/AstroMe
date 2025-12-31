import '../pagecontent.css';
import Navbar from '../../components/js/Navbar';
import bg from '../../images/bg.jpg';
import '../css/profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faPaperPlane, faPaperclip, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { auth } from '../../needed/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import SavedDay from '../../components/js/SavedDay';
import { db } from '../../needed/Firebase';
import { doc, getDocs, collection, getDocsFromServer, setDoc, query, orderBy, getCountFromServer, getDoc, where, deleteDoc } from 'firebase/firestore';
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
    const { dbUser } = useContext(DbUserContext);

    const navigate = useNavigate()

    const [showSaved, setShowSaved] = useState(false);
    const [daysArray, setDaysArray] = useState([]);
    const [postsArray, setPostsArray] = useState([]);

    const [showEditProfile, setShowEditProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [postCount, setPostCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);

    const [usersLiked, setUsersLiked] = useState([]);

    const [showComments, setShowComments] = useState(false);
    const [currentPost, setCurrentPost] = useState();

    const [isFollowed, setIsFollowed] = useState(false);

    const [visitingUser, setVisitingUser] = useState()
    const { uid } = useParams()

    const getUser = async () => {
        const userRef = doc(db, 'users', uid)
        const userRes = await getDoc(userRef);
        setVisitingUser(userRes.data());
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        if(user){
            if(user.uid == uid){
                navigate('/profile');
            }
        }
    }, [user])

    const onWallSelect = () => {
        setWallSelectClass('profile-tab active-tab');
        setDaySelectClass('profile-tab');
        setShowSaved(false);
        setDaysArray([]);
    }

    const onDaySelect = () => {
        setDaySelectClass('profile-tab active-tab');
        setWallSelectClass('profile-tab');
        setShowSaved(true);
    }

    const fetchDays = async () => {
        const collRef = collection(db, 'users', visitingUser.id, 'SavedDays');
        const sortedDocs = [];

        const daysRes = await getDocsFromServer(collRef);
        daysRes.forEach((doc) => {
            sortedDocs.push(doc.data());
        })

        sortedDocs.sort((a, b) => a.time - b.time);
        sortedDocs.reverse();
        setDaysArray(sortedDocs);
    }
    
    const fetchWall = async () => {
        const collRef = collection(db, 'users', visitingUser.id, 'Posts');
        const sortedDocs = [];

        const postsRes = await getDocsFromServer(collRef);
        let count = 0;
        postsRes.forEach((doc) => {
            sortedDocs.push(doc.data());
            count++;
        })
        setPostCount(count)
        sortedDocs.sort((a, b) => a.time - b.time);
        sortedDocs.reverse();
        setPostsArray(sortedDocs);
    }

    const getUsersLiked = async () => {
        const likedRef = collection(db, 'users', visitingUser.id, 'LikedPosts');
        const likedRes = await getDocs(likedRef);
        let likedArr = [];
        likedRes.docs.forEach(doc => {
            const docData = doc.data();
            likedArr.push(docData.postId);
        })
        setUsersLiked(likedArr);
    }

    useEffect(() => {
        if(visitingUser){
            countFollowers();
            getUsersLiked();
            checkFollow();
        }
    }, [visitingUser])

    useEffect(() => {
        if(showSaved){
            console.log('here')
            fetchDays();
        }
    }, [showSaved])

    useEffect(() => {
        if(!showSaved && visitingUser){
            fetchWall();
        }
    }, [visitingUser, showSaved])


    const checkFollow = async () => {
        const q = query(collection(db, 'users', user.uid, 'Following'), where('uid', '==', visitingUser.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setIsFollowed(true);
        } else {
            setIsFollowed(false);
        }
    }

    const countFollowers = async () => {
        const followersRef = collection(db, 'users', visitingUser.id, 'Followers');
        const followersRes = await getCountFromServer(followersRef);
        const count = followersRes.data().count;
        setFollowersCount(count)
    }

    const followUser = async () => {
        const meRef = doc(db, 'users', user.uid, 'Following', visitingUser.id);
        const followersDocRef = doc(db, 'users', visitingUser.id, 'Followers', user.uid);
        if(!isFollowed){
            await setDoc(meRef, {
                uid: visitingUser.id,
                name: visitingUser.name,
                pfpUrl: visitingUser.pfpUrl
            })
            await setDoc(followersDocRef, {
                uid: dbUser.id,
                name: dbUser.name,
                pfpUrl: dbUser.pfpUrl
            })
        }else{
            await deleteDoc(meRef);
            await deleteDoc(followersDocRef)
        }
        countFollowers();
        checkFollow();
    }

    const reportProfile = async () => {
        setIsLoading(true);
        const reportedUserDocRed = doc(db, 'reportedUsers', visitingUser.id);
        const reportReq = await setDoc(reportedUserDocRed, {
            userId: visitingUser.id,
            pfpUrl: visitingUser.pfpUrl,
            name: visitingUser.name
        }).then(() => setIsLoading(false));
    }
    
    return(
        <div className="profile-page">
            <div className='page-content'>
                <div className='profile-info'>
                <div className='edit-icon'>
                        <FontAwesomeIcon icon={faFlag} onClick={() => reportProfile()}/>
                    </div>
                    <div className='profile-info-photo-name'>
                        <img src={visitingUser?.pfpUrl} alt='profile-photo' />
                        <h1>{visitingUser?.name}</h1>
                    </div>
                    <div className='profile-stats'>
                        <p>Posts: {postCount}</p>
                        <p>Followers: {followersCount}</p>
                    </div>
                    <div className='profile-buttons'>
                        
                        {
                            !isFollowed
                            ?
                            <div className='logout-button' onClick={followUser} style={{ backgroundColor: 'purple', color: 'white' }}>
                                <p style={{
                                    color: 'white'
                                }}>Follow</p>
                            </div>
                            :
                            <div className='logout-button' onClick={followUser} style={{ backgroundColor: 'rgb(219, 219, 219)', color: 'black' }}>
                                <p>Followed</p>
                            </div>
                        }
                    </div>
                    
                    <p>{visitingUser?.bio}</p>
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
                            daysArray.length != 0 ? daysArray.map((day) => <SavedDay data={day} />) : <p className='no-day-message'>This user has not saved any of his days yet.</p>
                            :
                            postsArray.length != 0 ? <div className='profile-wall'>
                            {
                                postsArray.map((data) => <Post data={data} fetchWall={fetchWall} usersLiked={usersLiked} getUsersLiked={getUsersLiked} setShowComments={setShowComments} setCurrentPost={setCurrentPost}/>)
                            }
                        </div> : <p className='no-day-message'>This user has not posted anything yet.</p>
                        }
                    </div>
                </div>
            </div>
            {isLoading ? <Loader /> : null}
            {showComments ? <CommentBox setShowComments={setShowComments} currentPost={currentPost}/> : null}
        </div>
    )
}

export default Profile;