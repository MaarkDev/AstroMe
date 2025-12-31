import '../css/comment.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../needed/Firebase';
import AuthContext from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Loader from './Loader';

const Comment = ({ comment, fetchComments, currentPostId, postUserId }) => {
    const {user} = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false);

    const deleteComment = async () => {
        const commentRef = doc(db, 'users', user.uid, 'Posts', currentPostId, 'Comments', comment.id);
        await deleteDoc(commentRef);
        await fetchComments();
    }

    const reportComment = async () => {
        setIsLoading(true);
        const reportedCommDocRef = doc(db, 'reportedComments', comment.id);
        const reportReq = await setDoc(reportedCommDocRef, {
            userId: comment.userId,
            pfpUrl: comment.pfpUrl,
            name: comment.name,
            commentId: comment.id,
            comment: comment.comment,
            postId: comment.postId,
            postUserId: postUserId
        }).then(() => setIsLoading(false));
    }

    return(
        <div className='comment-outer'>
            <div className='comment-photo-and-name'>
                <div className='comment-photo-container'>
                    <img src={comment.pfpUrl} alt='commenters picture'/>
                </div>
                <div className='comment-name-and-date'>
                    <p className='comment-name'>{comment.name}</p>
                    <p className='comment-date'>{comment.date}</p>
                </div>
                <div className='comment-interaction'>
                {
                    comment.userId == user.uid ? <FontAwesomeIcon icon={faTrashCan} className='comment-delete' onClick={deleteComment}/> : null
                }
                <FontAwesomeIcon icon={faFlag} className='comment-delete' onClick={reportComment} />
                </div>
            </div>
            
            <p className='comment-comment'>{comment.comment}</p>
            {isLoading ? <Loader /> : null}
        </div>
    )
}

export default Comment;