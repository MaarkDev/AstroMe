import { useSearchParams } from 'react-router-dom';
import '../css/editprofile.css'
import { useContext, useState } from 'react';
import DbUserContext from '../../context/DbUserContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../needed/Firebase';

const EditProfile = ({ setShowEditProfile, setIsLoading }) => {
    const { dbUser, setDbUser } = useContext(DbUserContext);
    const [name, setName] = useState(dbUser.name);
    const [bio, setBio] = useState(dbUser.bio);
    const [pfpUrl, setPfpUrl] = useState(dbUser.pfpUrl);
    const [selectedFile, setSelectedFile] = useState();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const updateUser = async () => {
        const newFormData = new FormData();
        setIsLoading(true);
        let cloudinaryURL = pfpUrl;

        if(selectedFile){
            newFormData.append('file', selectedFile);
            newFormData.append("upload_preset", "fe7qwoaw");

            const cloudinaryData = await fetch(process.env.REACT_APP_CLOUDINARY_API_UPLOAD, {
                method: "POST",
                body: newFormData
            }).then((res) => res.json()).catch(e => console.log(e));

            cloudinaryURL = cloudinaryData.url;
        }
        
        const docRef = doc(db, 'users', dbUser.id);
        await updateDoc(docRef, {
            name: name,
            lowercaseName: name.toLowerCase(),
            bio: bio,
            pfpUrl: cloudinaryURL
        });

        await getDoc(docRef).then((res) => setDbUser(res.data()))
        setShowEditProfile(false);
        setIsLoading(false);
    }

    return(
        <div className='edit-profile-page'>
            <div className='edit-profile-outer'>
                <form className='edit-profile-form'>
                    <div className='edit-profile-form-el'>
                        <p className='edit-profile-form-label'>Name</p>
                        <input type='text' max='20' className='edit-profile-input' value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className='edit-profile-form-el'>
                        <p className='edit-profile-form-label'>Bio</p>
                        <textarea className='edit-profile-textarea' max='200' value={bio} onChange={(e) => setBio(e.target.value)}/>
                    </div>
                    <div className='edit-profile-form-el'>
                        <p className='edit-profile-form-label'>Set a new picture</p>
                        <input type='file' onChange={handleFileChange}/>
                    </div>
                    <div className='edit-profile-buttons'>
                        <div className='edit-profile-save' onClick={() => updateUser()}>
                            <p>Save</p>
                        </div>
                        <div className='edit-profile-cancel' onClick={() => setShowEditProfile(false)}>
                            <p>Cancel</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfile;