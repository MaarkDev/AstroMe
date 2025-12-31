import '../css/repcards.css';
import { useNavigate } from 'react-router-dom';

const ReportedUserCard = ({ name, pfpUrl, userId, keepUser, deleteUser }) => {

    let navigate = useNavigate();

    return(
        <div className="rep-usr-card-outer">
            <h1 onClick={() => navigate(`/profile/${userId}`)} class="rep-username">{name}</h1>
            <div className='rep-pfp-wrapper'>
                <img src={pfpUrl} />
            </div>
            <div className='rep-user-button-contaier' onClick={() => deleteUser(userId)} >
                <div className='rep-user-delete'>
                    <p>Delete</p>
                </div>
                <div className='rep-user-keep' onClick={() =>  keepUser(userId) }>
                    <p>Keep</p>
                </div>
            </div>
        </div>
    )
}

export default ReportedUserCard;