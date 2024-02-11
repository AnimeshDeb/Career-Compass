import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default function SearchButton() {
    return(
        <>
            <button>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
        </>
    )
}