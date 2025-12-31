import '../css/post.css';
import bg from '../../images/bg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faHeart, faComment, faTrash, faTrashCan, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import Loader from './Loader';
import { db } from '../../needed/Firebase';

const Post = ({ data, fetchWall, usersLiked, getUsersLiked, setShowComments, setCurrentPost }) => {
    const { user } = useContext(AuthContext); 
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const deletePost = async () => {
        const postRef = doc(db, 'users', user.uid, 'Posts', data.postId);
        await deleteDoc(postRef);
        await fetchWall();
    }

    const reportPost = async () => {
        setIsLoading(true);
        const reportedPostDocRef = doc(db, 'reportedPosts', data.postId);
        const reportReq = await setDoc(reportedPostDocRef, {
            userId: data.userId,
            pfpUrl: data.pfpUrl,
            name: data.name,
            postId: data.postId
        }).then(() => setIsLoading(false));
    }

    const likePost = async () => {
        console.log(data)
        const postRef = doc(db, 'users', data.userId, 'Posts', data.postId);
        const userRef = doc(db, 'users', user.uid, 'LikedPosts', data.postId);
        if(!isLiked){
            const newLikeNum = data.likeNumber + 1;
            setIsLiked(true);
            await setDoc(userRef, { postId: data.postId })
            await updateDoc(postRef, { likeNumber: newLikeNum });
        }else{
            const newLikeNum = data.likeNumber - 1;
            setIsLiked(false);
            await deleteDoc(userRef);
            await updateDoc(postRef, { likeNumber: newLikeNum });
        } 
        await getUsersLiked();
        await fetchWall();
    }

    useEffect(() => {
        if(usersLiked.includes(data.postId)){
            setIsLiked(true);
        }
    }, [])

    return(
        <div className='post-outer'>
            <div className='post-pfp-and-name'>
                <div className='post-pfp'>
                    <img src={data.pfpUrl} alt='poter pfp'/>
                </div>
                <div className='post-name'>
                    <p>{data.name}</p>
                </div>
            </div>
            <div className='post-content-container'>
                <p className='post-content-text'>{data.text}</p>
                <div className='post-image'>
                    { data.photoUrl ? <img src={data.photoUrl} alt='backgroundiage'/> : null }
                </div>
            </div>
            <div className='post-interaction-container'>
                
                {
                    user.uid == data.userId ? <p className='post-delete-button' onClick={deletePost}><FontAwesomeIcon icon={faTrash} /> Delete</p> : null
                }
                
                
                {
                    isLiked ? <p className='post-like-button' onClick={likePost} style={{ color: 'rgb(198, 108, 198)' }}><FontAwesomeIcon icon={faHeart} /> {data.likeNumber}</p> : <p className='post-like-button' onClick={likePost}><FontAwesomeIcon icon={faHeart} /> {data.likeNumber}</p>
                }
                <p className='post-comments-button' onClick={() => {setShowComments(true); setCurrentPost(data)}}><FontAwesomeIcon icon={faComment} /> Comments</p>
                <p className='post-delete-button' onClick={reportPost}><FontAwesomeIcon icon={faFlag} /> Report</p>
            </div>
            {isLoading ? <Loader /> : null}
        </div>
    )
}

export default Post;