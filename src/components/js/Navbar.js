import { NavLink } from 'react-router-dom';
import '../css/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCompass, faBook, faFeed, faUserCircle, faGear, faTerminal, faGears } from '@fortawesome/free-solid-svg-icons';
import bg from '../../images/bg.jpg';
import { useContext, useEffect, useState } from 'react';
import DbUserContext from '../../context/DbUserContext';

const Navbar = () => {
    const [logo, setLogo] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { dbUser, setDbUser } = useContext(DbUserContext);

    const checkIfAdmin = () => {
        setIsAdmin(false);
        if(dbUser.admin == true){
            setIsAdmin(true);
        }
    }

    useEffect(() => {
        setIsAdmin(false);
        if(dbUser){
            checkIfAdmin();
        }
    }, [dbUser])

    const logoDecider = () => {
        if(window.innerWidth <= 1360 && window.innerWidth > 451){
            setLogo('A');
            return;
        }else if(window.innerWidth < 451){
            setLogo('');
            return;
        }
        setLogo('Astrome')
        return;
    }

    useEffect(() => {
        logoDecider();
        window.addEventListener('resize', logoDecider);
        return () => {
          window.removeEventListener('resize', logoDecider);
        };
    }, [])

    return(
        <div className='navbar-outer'>
            <div className='navbar-bg'></div>     
            <div className='navbar-logo'>
                <NavLink to='/home' className='never-active'><h1>{logo}</h1></NavLink>
            </div>
            <div className='navbar-links'>
                <NavLink to='/home'><FontAwesomeIcon icon={faHome} className='navbar-icon'/><p className='navbar-text'>Home</p></NavLink>
                <NavLink to={'/feed'}><FontAwesomeIcon icon={faFeed} className='navbar-icon'/><p className='navbar-text'>Feed</p></NavLink>
                <NavLink to={/*`/learn`*/ '/learn'}><FontAwesomeIcon icon={faBook} className='navbar-icon'/><p className='navbar-text'>Learn</p></NavLink>
                <NavLink to='/profile'><FontAwesomeIcon icon={faUserCircle} className='navbar-icon'/><p className='navbar-text'>Profile</p></NavLink>
                { isAdmin ? <NavLink to='/admin'><FontAwesomeIcon icon={faGear} className='navbar-icon'/><p className='navbar-text'>Admin</p></NavLink> : null}
            </div>
            
        </div>
    )
}

export default Navbar;