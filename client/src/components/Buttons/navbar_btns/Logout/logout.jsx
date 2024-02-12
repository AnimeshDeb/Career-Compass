import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PropTypes from 'prop-types'

export default function LogoutButton({className, iconSize}) {
    return(
        <>
            <button className={className}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} size={iconSize}/>
            </button>
        </>
    )
}
LogoutButton.propTypes = {
    className: PropTypes.string,
    iconSize: PropTypes.string
}