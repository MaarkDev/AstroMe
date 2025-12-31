import { useContext, useEffect, useState } from 'react';
import '../css/commentbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faBackward, faX } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../needed/Firebase';
import DbUserContext from '../../context/DbUserContext';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Comment from './Comment';

const CommentBox = ({ setShowComments, currentPost }) => {
    const [comment, setComment] = useState();
    const { dbUser } = useContext(DbUserContext);
    const [comments, setComments] = useState([]);

    function isWhitespaceString(str) {
        return /^\s*$/.test(str);
      }

    const addComment = async () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear();
        const newDate = `${day}/${month}/${year}`;

        const commentId = uuidv4();
        const commentRef = doc(db, 'users', currentPost.userId, 'Posts', currentPost.postId, 'Comments', commentId);
        if(!isWhitespaceString(comment)){
            await setDoc(commentRef, {
                userId: dbUser.id,
                pfpUrl: dbUser.pfpUrl,
                name: dbUser.name,
                comment: comment,
                date: newDate,
                id: commentId,
                postId: currentPost.postId,
                postUserId: currentPost.userId
            })
            setComment('');
            await fetchComments();
        }
        
    }

    const fetchComments = async () => {
        let comments = [];
        const commentsRef = collection(db, 'users', currentPost.userId, 'Posts', currentPost.postId, 'Comments');
        const commentsRes = await getDocs(commentsRef);
        commentsRes.docs.forEach((doc) => comments.push(doc.data()))
        setComments(comments);
        console.log(comments)
    }

    useEffect(() => {
        fetchComments();
    }, [])

    return(
        <div className='commentbox-page' onClick={() => setShowComments(false)}>
            <div className='commentbox-box' onClick={e => e.stopPropagation()}>
                <FontAwesomeIcon icon={faAngleLeft}  className='commentbox-icon' onClick={() => setShowComments(false)}/>
                <div className='commentbox-comments-container'>
                    {comments.map((comment) => <Comment postUserId={currentPost.userId} comment={comment} fetchComments={fetchComments} currentPostId={currentPost.postId}/>)}
                </div>
                <div className='commentbox-textarea-wrapper'>
                    <textarea name='comment-area' value={comment} onChange={e => setComment(e.target.value)} placeholder='Got something to say?'/>
                </div>
                <div className='commentbox-post-button' onClick={addComment}>
                    <p>Comment</p>
                </div>
            </div>
        </div>
    )
}

export default CommentBox;