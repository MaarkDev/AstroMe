import '../pagecontent.css';
import Navbar from '../../components/js/Navbar';
import bg from '../../images/bg.jpg';
import '../css/feed.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../needed/Firebase';
import Post from '../../components/js/Post';
import CommentBox from '../../components/js/CommentBox';
import Loader from '../../components/js/Loader';

const Feed = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [usersLiked, setUsersLiked] = useState([]);
    const [currentPost, setCurrentPost] = useState();
    const [showComments, setShowComments] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [nameToSearch, setNameToSearch] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [linkClass, setLinkClass] = useState('found-user-name link')

    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(20);
    // To load the next page of posts, increment the pageNumber and call getFeed again
    const loadNextPage = () => {
        setIsLoading(true);
        const nextPageNumber = pageNumber + 1;
        setPageNumber(nextPageNumber)
        getFeed(nextPageNumber, postsPerPage);
    };

    const getFeed = async (pageNumber, postsPerPage) => {
        const followingRef = collection(db, 'users', user.uid, 'Following');
        const followingRes = await getDocs(followingRef);
        let followingArr = [];
        followingRes.forEach((doc) => {
            const docData = doc.data();
            followingArr.push(docData.uid);
        });

        let collsData = [];
        const promises = followingArr.map(async (id) => {
            const collRef = collection(db, 'users', id, 'Posts');
            const collRes = await getDocs(collRef);
            collRes.forEach((doc) => collsData.push(doc.data()));
        });

        await Promise.all(promises);

        collsData.sort((a, b) => b.time - a.time); // Sort in descending order
        const startIndex = (pageNumber - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const slicedData = collsData.slice(startIndex, endIndex);

        setPosts((prev) => [...prev, ...slicedData]);
        setIsLoading(false);
    };

    useEffect(() => {
        if(user){
            getUsersLiked();
            getFeed(pageNumber, postsPerPage); 
        }
    }, [user])

    useEffect(() => {
        console.log(posts)
    }, [posts])

    const getUsersLiked = async () => {
        const likedRef = collection(db, 'users', user.uid, 'LikedPosts');
        const likedRes = await getDocs(likedRef);
        let likedArr = [];
        likedRes.docs.forEach(doc => {
            const docData = doc.data();
            likedArr.push(docData.postId);
        })
        setUsersLiked(likedArr);
        console.log(likedArr)
    }

    const searchForUser = async () => {
        const usersCollection = collection(db, "users"); // Replace 'db' with your Firestore instance
        const q = query(usersCollection, where("lowercaseName", ">=", nameToSearch.toLowerCase()), limit(4));
        
        let list = [];
        const usersRes = await getDocs(q);
        usersRes.docs.forEach((user) => {
            list.push(user.data());
        })
        setFoundUsers(list);
        console.log(list);
    }

    const updateScreenWidth = () => {
        const newScreenWidth = window.innerWidth;
        if (newScreenWidth <= 768) {
          setLinkClass('found-user-name link hidden');
        } else {
          setLinkClass('found-user-name link');
        }
        setScreenWidth(newScreenWidth);
      };
      
      useEffect(() => {
        window.addEventListener('resize', updateScreenWidth);
      
        return () => {
          window.removeEventListener('resize', updateScreenWidth);
        };
      }, []);

    useEffect(() => {
        searchForUser();
    }, [])  

    return(
        <div className="feed-page">
            <div className='page-content'>
                <div className='feed-search-container'>
                    <input type='text' placeholder='Search...' onChange={e => setNameToSearch(e.target.value)} value={nameToSearch}/>
                    <div className='feed-search-mag'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} onClick={searchForUser}/>
                    </div>
                </div>

                <div className='found-users-outer'>
                    
                    {

                        foundUsers.map((user) => 
                            <div className='found-user-item' onClick={() => navigate(`/profile/${user.id}`)}>
                                <div className='found-user-image'>
                                    <img src={user.pfpUrl} alt='pfp'/>
                                </div>
                                <p className='found-user-name'>{user.name}</p>
                                <FontAwesomeIcon icon={faLink} className={linkClass}/>
                            </div>
                        ) 

                    }
                    
                
                </div>

                <div className='feed-container'>
                    {
                        posts.length != 0 
                        ?
                        posts.map((data) => <Post data={data} fetchWall={getFeed} usersLiked={usersLiked} 
                                    getUsersLiked={getUsersLiked} setShowComments={setShowComments} setCurrentPost={setCurrentPost}/>)
                        :
                        <p className='no-feed-message'>Your are not following any other users, follow some users to create your feed!</p>
                    }
                </div>
                <div className='load-more-button' onClick={() => loadNextPage()}>
                    <p>Load more</p>
                </div>
            </div>
            {showComments ? <CommentBox setShowComments={setShowComments} currentPost={currentPost}/> : null}
            {isLoading ? <Loader /> : null}
        </div>
    )
}

export default Feed;