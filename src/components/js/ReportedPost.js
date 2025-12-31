import { useSearchParams } from 'react-router-dom';
import '../css/repcards.css';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../needed/Firebase';
import { useNavigate } from 'react-router-dom';

const ReportedPost = ({ name, postId, userId, deletePost, keepPost }) => {

    const [postData, setPostData] = useState();

    const getActualPost = async (userId, postId) => {
        const postRef = doc(db, 'users', userId, 'Posts', postId);
        const postReq = await getDoc(postRef);
        setPostData(postReq.data());
    }

    useEffect(() => {
        getActualPost(userId, postId);
    }, [])

    const navigate = useNavigate();

    return(
        <div className="rep-post-outer">
            <h1 className='rep-post-header' onClick={() => navigate(`/profile/${userId}`)}>{name}</h1>
            <div className='rep-post-photo'>
                <img src={postData?.photoUrl} />
            </div>
            <p className='rep-post-desc'>{postData?.text}</p>
            <div className='rep-post-buttons'>
                <div className='rep-post-keep' onClick={() => { keepPost(postId) }}>
                    <p>Keep</p>
                </div>
                <div className='rep-post-delete' onClick={() => { deletePost(postId, userId) }}>
                    <p>Delete</p>
                </div>
            </div>
        </div>
    )
}

export default ReportedPost;