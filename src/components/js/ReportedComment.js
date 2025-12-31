import { useEffect, useState } from 'react';
import '../css/repcards.css';
import { db } from '../../needed/Firebase';
import { doc, getDoc } from 'firebase/firestore';

const ReportedComment = ({ userId, commentId, postId, name, text, keepComment, deleteComment, postUserId }) => {

    const [commentData, setCommentData] = useState();

    const getActualComment = async (userId, commentId, postId) => {
        const commentRef = doc(db, 'users', userId, 'Posts', postId, 'Comments', commentId);
        const commentReq = await getDoc(commentRef);
        setCommentData(commentReq.data());
    }

    useEffect(() => {
        console.log(commentData)
    }, [commentData])

    useEffect(() => {
        getActualComment(userId, commentId, postId);
    }, [])

    return(
        <div className="rep-comment-outer">
            <h1>{name}</h1>
            <p className="repcomment">{text}</p>
            <div className='rep-post-buttons'>
                <div className='rep-post-keep' onClick={() => { keepComment(commentId) }}>
                    <p>Keep</p>
                </div>
                <div className='rep-post-delete' onClick={() => { deleteComment(postId, postUserId, commentId) }}>
                    <p>Delete</p>
                </div>
            </div>
        </div>
    )
}

export default ReportedComment;