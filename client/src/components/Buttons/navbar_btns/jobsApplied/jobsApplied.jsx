import { faSuitcase } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'

export default function JobsButton({className, iconSize}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/myjobs')
    }

    return(
        <>
            <button className={className} onClick={handleClick}>
            <FontAwesomeIcon icon={faSuitcase} size={iconSize}/>
            </button>
        </>
    )
}
JobsButton.propTypes = {
    className: PropTypes.string,
    iconSize: PropTypes.string
}