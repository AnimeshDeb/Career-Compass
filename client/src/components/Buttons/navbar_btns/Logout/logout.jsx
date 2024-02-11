import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default function LogoutButton() {
    return(
        <>
            <button>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </>
    )
}