import "./UserBanner.css";
import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";
export default function UserBanner({banner, picture, name}) {


    return(
        <>
            <Edit_Btn/>
            <img className="banner" src={banner} alt="banner" />
            <img src={picture} className= "profile-picture" alt="User" />
            <h3 className="username">{name}</h3>
        </>
    )
}
UserBanner.propTypes = {
    banner: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
    