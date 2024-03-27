import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/version1/navbar";
import Footer from "../../components/footer/footer";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc, updateDoc, arrayRemove,
  collection,
  addDoc, arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import AddMenteeDialog from "./AddMentee";
import { AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSuitcase,
  faUserCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const GroupPage = () => {
  const location = useLocation();
  const userType = location.state?.userType;
  const userId = location.state?.userId;
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [userGroups, setUserGroups] = useState([]);
  const [chats, setChats] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddMenteeDialogOpen, setIsAddMenteeDialogOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
const textSize = "text-base md:text-lg lg:text-xl xl:text-2xl";
const placeholderPFP = "/placeholderPFP.png";

  const openAddMenteeDialog = (groupId) => {
    setSelectedGroupId(groupId);
    setIsAddMenteeDialogOpen(true);
  };

  const closeAddMenteeDialog = () => {
    setSelectedGroupId(null);
    setIsAddMenteeDialogOpen(false);
  };

  useEffect(() => {
    if (windowWidth < 400) {
      setIconSize("xs");
    } else if (windowWidth < 769) {
      setIconSize("lg");
    } else {
      setIconSize("2x");
    }
  }, [windowWidth]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;
      let userRef;
      if(userType=="mentor"){
        userRef = doc(db, "Mentors", userId);
      } else{
        userRef = doc(db, "Seekers", userId);
      }
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const chatUIDs = userData.chats || [];
        setChats(chatUIDs);
      } else {
        console.log("No such user!");
      }
    };

    fetchChats();
  }, [userId]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddGroup = async () => {
  try {
    const dataRef = doc(db, "Mentors", userId);
    const dataSnap = await getDoc(dataRef);

    if (!dataSnap.exists()) {
      console.error("User document does not exist!");
      return;
    }

    const userData = dataSnap.data();
    console.log(userData)
    const userName = userData.displayName || "User";
    const userPicture = userData.pictureURL || null;

    const randomNumber = Math.floor(Math.random() * 10000);
    const groupName = `Group ${randomNumber}`;

    const newGroupDocRef = await addDoc(collection(db, "Groups"), {
      mentees: {
        [userId]: { 
          name: userName, 
          picture: userPicture,
          id: userId
        }
      },
      uid: "",
      name: groupName,
    });

    await setDoc(newGroupDocRef, { uid: newGroupDocRef.id }, { merge: true });

    const newGroupData = {
      id: newGroupDocRef.id,
      mentees: {
        [userId]: {
          name: userName,
          picture: userPicture,
        },
      },
      uid: newGroupDocRef.id,
      name: groupName,
    };

    let userRef = dataRef; // You've already fetched this, no need to fetch again

    // Assuming userSnap exists based on the early return above
    const updatedGroupIds = userData.groups ? [...userData.groups, newGroupDocRef.id] : [newGroupDocRef.id];
    await updateDoc(userRef, { groups: updatedGroupIds });

    // Update local state with the new group, including the name
    setUserGroups((prevGroups) => [...prevGroups, newGroupData]);
  } catch (error) {
    console.error("Error creating a new group or updating user:", error);
  }
};
const handleDeleteGroup = async (groupId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this group?");
  if (isConfirmed) {
    try {
      // Retrieve the group document to get the list of mentees
      const groupDocRef = doc(db, "Groups", groupId);
      const groupDocSnap = await getDoc(groupDocRef);
      if (groupDocSnap.exists()) {
        const groupData = groupDocSnap.data();
        const mentees = groupData.mentees || {};

        // Iterate over the mentees map and remove the groupId from each mentee's groups array
        const menteeIds = Object.keys(mentees);
        for (const menteeId of menteeIds) {
          if(userId != menteeId){
          const menteeRef = doc(db, "Seekers", menteeId);
          await updateDoc(menteeRef, {
            groups: arrayRemove(groupId)
          });
        }
        }
      }

      // Delete the group from the Groups collection
      await deleteDoc(groupDocRef);
let userRef;
      if(userType=="mentor"){
        userRef = doc(db, "Mentors", userId);
      } else{
        userRef = doc(db, "Seekers", userId);
      }
      await updateDoc(userRef, {
        groups: arrayRemove(groupId)
      });

      // Update local state to remove the deleted group
      setUserGroups(userGroups.filter((group) => group.id !== groupId));

      alert("Group deleted successfully.");
    } catch (error) {
      console.error("Error deleting group and updating users:", error);
      alert("Failed to delete the group.");
    }
  }
};
  const handleRemoveMentee = async (groupId, menteeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this mentee from the group?"
    );
    if (isConfirmed) {
      try {
        // Remove the mentee from the group in the Groups collection
        const groupRef = doc(db, "Groups", groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const existingMentees = groupSnap.data().mentees || {};
          delete existingMentees[menteeId]; // Remove the mentee from the object
          await setDoc(groupRef, { mentees: existingMentees }, { merge: true });
          
          // Remove the group from the mentee's groups array in the Seekers collection
          const menteeRef = doc(db, "Seekers", menteeId);
          await updateDoc(menteeRef, {
            groups: arrayRemove(groupId)
          });

          // Update local state to reflect the removal of the mentee from the group
          const updatedGroups = userGroups.map((group) => {
            if (group.id === groupId) {
              return { ...group, mentees: existingMentees };
            }
            return group;
          });
          setUserGroups(updatedGroups);

          alert("Mentee removed successfully.");
        }
      } catch (error) {
        console.error("Error removing mentee from group and updating their data:", error);
        alert("Failed to remove the mentee from the group.");
      }
    }
  };
  const fetchGroupsDetails = async (groupIds) => {
    const groupsWithDetails = await Promise.all(
      groupIds.map(async (groupId) => {
        const groupRef = doc(db, "Groups", groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          return { id: groupId, ...groupSnap.data() };
        } else {
          return null;
        }
      })
    );

    setUserGroups(groupsWithDetails.filter((group) => group)); // Filter out any null values
  };
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!userId) return;
let userRef;
      if(userType=="mentor"){
        userRef = doc(db, "Mentors", userId);
      } else{
        userRef = doc(db, "Seekers", userId);
      }
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const groupIds = userData.groups || []; // assuming 'groups' is the field containing group UIDs

        fetchGroupsDetails(groupIds);
      } else {
        console.log("No such user!");
      }
    };

    fetchUserGroups();
  }, [userId]);
  const handleProfile = (userId) => {
    navigate("/public", { state: { userId: userId, userType: "seeker" } });
  };
  const handleChatIconClick = (mentee) => {
    setIsOpen(true);
    setSelectedMentee(mentee);
  };
  const handleLeaveGroup = async (groupId) => {
  if (!userId || !groupId) {
    console.error("Missing user ID or group ID. Cannot proceed.");
    return;
  }

  const isConfirmed = window.confirm("Are you sure you want to leave this group?");
  if (!isConfirmed) {
    return; // Early return if the user cancels the action
  }

  try {
    // Step 1: Update the mentee's document to remove the groupId from their groups array
    const menteeRef = doc(db, "Seekers", userId);
    await updateDoc(menteeRef, {
      groups: arrayRemove(groupId)
    });

    // Step 2: Update the group's document to remove the mentee's userId from its mentees map/object
    const groupRef = doc(db, "Groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      const groupData = groupSnap.data();
      const updatedMentees = { ...groupData.mentees };
      delete updatedMentees[userId]; // Remove the mentee from the map

      await updateDoc(groupRef, {
        mentees: updatedMentees
      });
    }

    // Optionally: Update local state to reflect the changes if needed
    // This step depends on how your component or application state is managed

    console.log("Successfully left the group.");
    alert("You have left the group successfully.");
  } catch (error) {
    console.error("Error leaving group:", error);
    alert("Failed to leave the group.");
  }
};
  const handleAddMentee = async (selectedSeekers, groupId) => {
    if (!groupId) {
      console.error("Group ID is undefined. Cannot add mentees.");
      return;
    }

    try {
      const groupRef = doc(db, "Groups", groupId);
      const groupSnap = await getDoc(groupRef);
      let existingMentees = groupSnap.exists() && groupSnap.data().mentees ? groupSnap.data().mentees : {};

      // Prepare new mentees to be added to the group
      const newMentees = selectedSeekers.reduce((acc, seeker) => {
        acc[seeker.id] = {
          name: seeker.displayName || "Unknown Name",
          picture: seeker.pictureURL || null,
          id: seeker.UID || null
        };
        return acc;
      }, {});

      // Add new mentees to the group in the Groups collection
      await setDoc(groupRef, { mentees: { ...existingMentees, ...newMentees } }, { merge: true });

      // Update each mentee's record to include this groupId in their groups field
      for (const menteeId of Object.keys(newMentees)) {
        const menteeRef = doc(db, "Seekers", menteeId);
        await updateDoc(menteeRef, {
          groups: arrayUnion(groupId)
        });
      }

      // Update the local state to reflect the added mentees
      const updatedGroups = userGroups.map((group) => {
        if (group.id === groupId) {
          // Assuming group data structure matches what's being stored in Firestore
          return { ...group, mentees: { ...group.mentees, ...newMentees } };
        }
        return group;
      });

      setUserGroups(updatedGroups);
    } catch (error) {
      console.error("Error adding mentees to the group and their records:", error);
    }
};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar
          userType={userType}
          iconSize={iconSize}
          currentPage={"groups"}
          userId={userId}
        />

        {userGroups.length > 0 ? (
  userGroups.map((group) => (
    <div key={group.id} className="mb-3">
              <AnimatePresence>
                {isAddMenteeDialogOpen && selectedGroupId === group.id && (
                  <AddMenteeDialog
                    isOpen={isAddMenteeDialogOpen}
                    onClose={closeAddMenteeDialog}
                    onAddMentee={handleAddMentee}
                    groupId={group.id}
                  />
                )}
              </AnimatePresence>
              <div className="my-5 pr-5 flex w-full items-center justify-between">
                <div className="bg-secondary flex items-center justify-between rounded-br-md rounded-tr-md py-2 pl-10 pr-5 flex-grow">
                  <h1 className="text-4xl font-bold text-white">
                    {group.name}
                  </h1>
                  {/* <a
                    href="#"
                    className="text-2xl text-secondary-lighter hover:text-white transition-colors duration-300"
                  >
                    Link
                  </a> */}
                  {userType==="mentor" && (<button onClick={() => handleDeleteGroup(group.id)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-white hover:text-red-700"
                    />
                  </button>)}
                  {userType==="seeker" && (
                  <button className={`font-bold ${textSize} text-white hover:text-red-600`} onClick={() => handleLeaveGroup(group.id)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="pr-2"
                    />
                    Leave Group
                  </button>)}
                </div>
                {userType==="mentor" && (<button
                  className="text-2xl text-secondary-dark px-4 m-0 rounded"
                  onClick={() => openAddMenteeDialog(group.id)}
                >
                  + Add Mentee
                </button>)}
              </div>
              {Object.keys(group.mentees).length > 0 ? (
        Object.entries(group.mentees).filter(([menteeId, _]) => menteeId !== userId) // Filter out the current user
        .map(([menteeId, menteeData]) => (
          <div
            key={menteeId}
            className="flex flex-col bg-gray-200 p-5 mx-6 rounded-md hover:bg-gray-300 sm:flex-row items-center justify-between mb-2"
          >
                    <div className=" flex">
                      <div className="rounded-full overflow-hidden border-4 border-primary bg-white flex justify-center items-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-24 xl:h-24">
                        <img
                          src={menteeData.picture || placeholderPFP}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      </div>

                      <p className="text-4xl pl-7 pt-10 text-secondary font-semibold mb-3 sm:mb-0">
                        {menteeData.name}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-4 sm:space-x-4">
                      {userType==="mentor" && (<button
                        onClick={() => handleProfile(menteeId)}
                        className="text-primary hover:text-primary-light flex items-center focus:outline-none space-x-2 mb-2 sm:mb-0"
                      >
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="h-8 w-8 text-primary hover:text-primary-light"
                        />
                        <p className="text-xl hover:text-primary-light">
                          Profile
                        </p>
                      </button>)}
                      <button
                        onClick={() => handleChatIconClick(menteeData)}
                        className="text-primary hover:text-primary-light flex items-center focus:outline-none space-x-2 mb-2 sm:mb-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <p className="text-xl">Chat</p>
                      </button>
                      {userType==="mentor" && (<button
                        onClick={() => handleChatIconClick(menteeData)}
                        className="text-primary hover:text-primary-light flex items-center focus:outline-none space-x-2"
                      >
                        <FontAwesomeIcon
                          icon={faSuitcase}
                          className="h-8 w-8 text-primary hover:text-primary-light"
                        />
                        <p className="text-xl hover:text-primary-light">Jobs</p>
                      </button>)}
                      {userType==="mentor" && (<button
                        onClick={() => handleRemoveMentee(group.id, menteeId)}
                        title="Remove Mentee"
                        className="text-secondary hover:text-red-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>)}
                    </div>
                  </div>
                ))
              ) : (
                <p>No mentees found in this group.</p>
              )}
            </div>
          ))
        ) : (
          <p className="pl-5 text-2xl text-primary font-semibold py-auto">
            Loading group information...
          </p>
        )}
        {userType==="mentor" && (<button
          className=" text-2xl text-white mb-10 bg-secondary hover:bg-secondary-light px-5 py-2 mx-auto mt-3 rounded-lg"
          onClick={handleAddGroup}
        >
          + Add Group
        </button>)}
      </div>

      <ChatBox
        userId={userId}
        selectedSeeker={selectedMentee}
        userType={userType}
        selectedMentee={selectedMentee}
        onMenteeClick={handleChatIconClick}
        chats={chats}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Footer />
    </>
  );
};

export default GroupPage;
