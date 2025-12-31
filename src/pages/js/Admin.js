import { useNavigate, useSearchParams } from 'react-router-dom';
import '../css/admin.css';
import { useContext, useEffect, useState } from 'react';
import Loader from '../../components/js/Loader';
import { DocumentReference, collection, deleteDoc, getDocs, getDocsFromServer, doc, deleteField, updateDoc, where, query } from 'firebase/firestore';
import { db } from '../../needed/Firebase';
import ReportedUserCard from '../../components/js/ReportedUserCard';
import ReportedPost from '../../components/js/ReportedPost';
import ReportedComment from '../../components/js/ReportedComment';
import DbUserContext from '../../context/DbUserContext';

const Admin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { dbUser } = useContext(DbUserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(dbUser){
            if(dbUser.admin == false){
                navigate('/home');
            }
        }
    }, [dbUser])

    const [posts, setPosts] = useState([]);
    const [users, setusers] = useState([]);
    const [comments, setComments] = useState([]);

    const [adminMail, setAdminMail] = useState();
    const [adminId, setAdminId] = useState();

    const getReportedUsers = async () => {
        const colRef = collection(db, 'reportedUsers');
        const snapshot = await getDocsFromServer(colRef);
        let temp = [];
        snapshot.forEach((doc) => temp.push(doc.data()));
        setusers(temp);
    }

    const getReportedPosts = async () => {
        const colRef = collection(db, 'reportedPosts');
        const snapshot = await getDocsFromServer(colRef);
        let temp = [];
        snapshot.forEach((doc) => temp.push(doc.data()));
        setPosts(temp);
    }

    const getReportedComments = async () => {
        const colRef = collection(db, 'reportedComments');
        const snapshot = await getDocsFromServer(colRef);
        let temp = [];
        snapshot.forEach((doc) => temp.push(doc.data()));
        setComments(temp);
    }

    const keepUser = async (userId) => {
        const docref = doc(db, 'reportedUsers', userId)
        const keepReq = await deleteDoc(doc(db, 'reportedUsers', userId));
        await getReportedUsers();
    }

    const deleteUser = async (userId) => {
        const docref = doc(db, 'reportedUsers', userId)
        const keepReq = await deleteDoc(docref);
        const docrefDelete = doc(db, 'users', userId)
        const deletePosts = await updateDoc(docrefDelete, { 
            Posts: deleteField(),
            Followers: deleteField(),
            Following: deleteField(),
            LikedPosts: deleteField()
     })
        const keepReqDelete = await deleteDoc(docrefDelete);
        await getReportedUsers();
    }

    const keepPost = async (postId) => {
        const postRef = doc(db, 'reportedPosts', postId);
        const keepReq = await deleteDoc(postRef);
        window.location.reload();
    }

    const deletePost = async (postId, userId) => {
        const repDelRef = doc(db, 'reportedPosts', postId);
        const repDelReq = await deleteDoc(repDelRef);

        const userDelRef = doc(db, 'users', userId, 'Posts', postId);
        const userDelReq = await deleteDoc(userDelRef);
        window.location.reload();
    }

    useEffect(() => {
        getReportedUsers();
        getReportedPosts();
        getReportedComments();
    }, [])

    useEffect(() => {
        console.log(users);
        //console.log(posts);
        console.log(comments);
    }, [users, posts, comments])

    const keepComment = async (commentId) => {
        const commentRef = doc(db, 'reportedComments', commentId);
        const keepReq = await deleteDoc(commentRef);
        window.location.reload();
    }

    const deleteComment = async (postId, userId, commentId) => {
        const commentRef = doc(db, 'reportedComments', commentId);
        const keepReq = await deleteDoc(commentRef);

        const comDelRef = doc(db, 'users', userId, 'Posts', postId, 'Comments', commentId);
        const userDelReq = await deleteDoc(comDelRef);
        window.location.reload();
    }

    const addAdmin = async () => {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where("mail", "==", `${adminMail}`));

        const userReq = await getDocs(q);
        let temp = '';
        userReq.forEach((us) => temp = us.data())
        setAdminId(temp.id)
        const userRef = doc(db, 'users', temp.id)
        const updateUser = await updateDoc(userRef, {
            admin: true
        }).then(() => {
            alert("Success");
            window.location.reload();
        }).catch(e => console.log(e));
        
    }

    return(
        <div className="feed-page">
            <div className='page-content'>

                <h1 className='adminpage-heading'>Admin</h1>
            
                <p className='adminpage-heading-p'>Reported users</p>
                <div className='rep-user-card-container'>
                    { users.map((user) => <ReportedUserCard deleteUser={deleteUser} keepUser={keepUser} name={user.name} pfpUrl={user.pfpUrl} userId={user.userId} />) }
                </div>

                <p className='adminpage-heading-p'>Reported posts</p>
                <div className='rep-posts-container'>
                    { posts.map((post) => <ReportedPost keepPost={keepPost} deletePost={deletePost} name={post.name} pfpUrl={post.pfpUrl} postId={post.postId} userId={post.userId}/>) }
                </div>

                <p className='adminpage-heading-p'>Reported comments</p>
                <div className='rep-posts-container'>
                    { comments.map((comment) => <ReportedComment postUserId={comment.postUserId} keepComment={keepComment} deleteComment={deleteComment} text={comment.comment} name={comment.name} userId={comment.userId} postId={comment.postId} commentId={comment.commentId} />) }
                </div>

                <p className='adminpage-heading-p'>Add admin</p>

                <input type='email' className='admin-mail' placeholder='Enter users email... ' value={adminMail} onChange={(e) => setAdminMail(e.target.value)} />
                <p className='add-admin-button' onClick={() => addAdmin()}>Add admin</p>

            </div>
            {isLoading ? <Loader /> : null}
        </div>
    )

}

export default Admin;