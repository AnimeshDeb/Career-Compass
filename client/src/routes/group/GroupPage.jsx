import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/version1/navbar";
import Footer from "../../components/footer/footer";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import AddMenteeDialog from "./AddMentee";
import { AnimatePresence } from "framer-motion";
import ChatGroup from "./ChatGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSuitcase,
  faUserCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../components/Chat/ChatBox";
import { ClipLoader } from "react-spinners";
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
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [isAddMenteeDialogOpen, setIsAddMenteeDialogOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
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

      const userRef = doc(db, "Mentors", userId);
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
      const randomNumber = Math.floor(Math.random() * 10000);
      const groupName = `Group ${randomNumber}`;

      const newGroupDocRef = await addDoc(collection(db, "Groups"), {
        mentees: {},
        uid: "",
        name: groupName,
      });

      console.log("New group created with ID:", newGroupDocRef.id);

      await setDoc(newGroupDocRef, { uid: newGroupDocRef.id }, { merge: true });

      const newGroupData = {
        id: newGroupDocRef.id,
        mentees: {},
        uid: newGroupDocRef.id,
        name: groupName,
      };

      const userRef = doc(db, "Mentors", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedGroupIds = userData.groups
          ? [...userData.groups, newGroupDocRef.id]
          : [newGroupDocRef.id];

        await setDoc(userRef, { groups: updatedGroupIds }, { merge: true });

        // Update local state with the new group, including the name
        setUserGroups((prevGroups) => [...prevGroups, newGroupData]);
      } else {
        console.error("User document does not exist!");
      }
    } catch (error) {
      console.error("Error creating a new group or updating user:", error);
    }
  };
  const handleDeleteGroup = async (groupId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "Groups", groupId));
        // Update local state to remove the deleted group
        setUserGroups(userGroups.filter((group) => group.id !== groupId));
        alert("Group deleted successfully.");
      } catch (error) {
        console.error("Error deleting group:", error);
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
        const groupRef = doc(db, "Groups", groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const existingMentees = groupSnap.data().mentees || {};
          delete existingMentees[menteeId]; // Remove the mentee from the object
          await setDoc(groupRef, { mentees: existingMentees }, { merge: true });
          // Update local state
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
        console.error("Error removing mentee from group:", error);
        alert("Failed to remove the mentee from the group.");
      }
    }
  };
  const fetchGroupsDetails = async (groupIds) => {
    if (groupIds.length === 0) {
      setUserGroups([]);
      setIsLoadingGroups(false);
      return;
    }
    const groupsWithDetails = await Promise.all(
      groupIds.map(async (groupId) => {
        const groupRef = doc(db, "Groups", groupId);
        const groupSnap = await getDoc(groupRef);
        return groupSnap.exists() ? { id: groupId, ...groupSnap.data() } : null;
      })
    );

    setUserGroups(groupsWithDetails.filter((group) => group));
    setIsLoadingGroups(false);
  };
  useEffect(() => {
    const fetchUserGroups = async () => {
      setIsLoadingGroups(true);
      if (!userId) {
        setIsLoadingGroups(false);
        return;
      }

      const userCollection = userType === "seeker" ? "Seekers" : "Mentors";
      const userRef = doc(db, userCollection, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const groupIds = userData.groups || [];
        if (groupIds.length > 0) {
          fetchGroupsDetails(groupIds);
        } else {
          setUserGroups([]);
          setIsLoadingGroups(false);
        }
      } else {
        console.log("No such user found in", userCollection);
        setIsLoadingGroups(false);
      }
    };

    fetchUserGroups();
  }, [userId, userType]);
  const handleProfile = (userId) => {
    navigate("/public", { state: { userId: userId, userType: "seeker" } });
  };
  const handleChatIconClick = (mentee) => {
    setIsOpen(true);
    setSelectedMentee(mentee);
  };
  const handleAddMentee = async (selectedSeekers, groupId) => {
    if (!groupId) {
      console.error("Group ID is undefined. Cannot add mentees.");
      return;
    }

    try {
      const groupRef = doc(db, "Groups", groupId);
      const groupSnap = await getDoc(groupRef);
      let existingMentees =
        groupSnap.exists() && groupSnap.data().mentees
          ? groupSnap.data().mentees
          : {};

      const newMentees = selectedSeekers.reduce((acc, seeker) => {
        acc[seeker.id] = {
          name: seeker.displayName || "Unknown Name",
          picture: seeker.pictureURL || null,
        };
        return acc;
      }, {});

      await setDoc(
        groupRef,
        { mentees: { ...existingMentees, ...newMentees } },
        { merge: true }
      );

      // Update the local state to reflect the added mentee
      const updatedGroups = userGroups.map((group) => {
        if (group.id === groupId) {
          // Assuming group data structure matches what's being stored in Firestore
          return { ...group, mentees: { ...group.mentees, ...newMentees } };
        }
        return group;
      });

      setUserGroups(updatedGroups);
    } catch (error) {
      console.error("Error adding mentees to the group:", error);
    }
  };
  const placeholderPFP = "/placeholderPFP.png";
  return (
    <>
      <div className="bg-primary-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg w-full overflow-hidden">
            <div className="flex flex-col min-h-screen">
              <Navbar
                userType={userType}
                iconSize={iconSize}
                currentPage={"groups"}
                userId={userId}
              />

              {isLoadingGroups ? (
                <div className="flex flex-col items-center justify-center w-full min-h-screen">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    Loading group information...
                  </h2>
                  <ClipLoader color="#2e318e" size={50} />{" "}
                </div>
              ) : userGroups.length > 0 ? (
                userGroups.map((group) => (
                  <div key={group.id} className="mb-3">
                    <AnimatePresence>
                      {isAddMenteeDialogOpen &&
                        selectedGroupId === group.id && (
                          <AddMenteeDialog
                            isOpen={isAddMenteeDialogOpen}
                            onClose={closeAddMenteeDialog}
                            onAddMentee={handleAddMentee}
                            groupId={group.id}
                          />
                        )}
                    </AnimatePresence>
                    <div className="mt-5 flex w-full items-center justify-between mb-5">
                      <div className="bg-secondary flex items-center justify-between rounded-br-md rounded-tr-md py-2 pl-10 pr-5 flex-grow">
                        <h1 className="text-4xl font-bold text-white">
                          {group.name}
                        </h1>
                        <button onClick={() => handleDeleteGroup(group.id)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-white hover:text-red-700"
                          />
                        </button>
                      </div>
                      <button
                        className="text-2xl text-secondary-dark px-4 m-0 rounded"
                        onClick={() => openAddMenteeDialog(group.id)}
                      >
                        + Add Mentee
                      </button>
                    </div>
                    {Object.keys(group.mentees).length > 0 ? (
                      Object.entries(group.mentees).map(
                        ([menteeId, menteeData]) => (
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
                              <button
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
                              </button>
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
                              <button
                                onClick={() => handleChatIconClick(menteeData)}
                                className="text-primary hover:text-primary-light flex items-center focus:outline-none space-x-2"
                              >
                                <FontAwesomeIcon
                                  icon={faSuitcase}
                                  className="h-8 w-8 text-primary hover:text-primary-light"
                                />
                                <p className="text-xl hover:text-primary-light">
                                  Jobs
                                </p>
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveMentee(group.id, menteeId)
                                }
                                title="Remove Mentee"
                                className="text-secondary hover:text-red-700 focus:outline-none"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="pl-5 text-2xl text-primary font-semibold py-auto">
                        Not in any groups.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
                  <div className="text-center p-4">
                    <h2 className="text-3xl font-bold text-primary">
                      Not in any groups
                    </h2>
                    <p className="text-xl mt-2 text-secondary">
                      You are currently not part of any groups.
                    </p>
                  </div>
                </div>
              )}
              {userType === "mentor" && (
                <button
                  className=" text-2xl text-white mb-10 bg-secondary hover:bg-secondary-light px-5 py-2 mx-auto mt-3 rounded-lg"
                  onClick={handleAddGroup}
                >
                  + Add Group
                </button>
              )}
            </div>

            <ChatGroup
              userId={userId}
              selectedSeeker={selectedSeeker}
              userType={userType}
              selectedMentee={selectedMentee}
              onMenteeClick={handleChatIconClick}
              chats={chats}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <ChatBox currentPage="groups" />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupPage;
