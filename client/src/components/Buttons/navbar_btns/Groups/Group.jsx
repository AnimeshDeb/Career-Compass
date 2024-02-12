import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import PropTypes from 'prop-types'

export default function GroupButton({className, iconSize}) {
    return(
        <>
            <button className={className}>
            <FontAwesomeIcon icon={faUserGroup} size={iconSize}/>
            </button>
        </>
    )
}

GroupButton.propTypes = {
    className: PropTypes.string,
    iconSize: PropTypes.string
}