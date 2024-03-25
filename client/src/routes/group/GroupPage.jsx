import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/version1/navbar';
import Footer from '../../components/footer/footer';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AddMenteeDialog from './AddMentee';
import { AnimatePresence, motion } from 'framer-motion';
import ChatBox from './ChatBox';

const GroupPage = () => {
  const location = useLocation();
  const userType = location.state?.userType;
  const userId = location.state?.userId;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState('2x');
  const [group, setGroup] = useState(null);
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [isAddMenteeDialogOpen, setIsAddMenteeDialogOpen] = useState(false);

  const openAddMenteeDialog = () => {
    setIsAddMenteeDialogOpen(true);
  };

  useEffect(() => {
    if (windowWidth < 400) {
      setIconSize('xs');
    } else if (windowWidth < 769) {
      setIconSize('lg');
    } else {
      setIconSize('2x');
    }
  }, [windowWidth]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupRef = doc(db, 'Groups', userId);
        const groupSnapshot = await getDoc(groupRef);

        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.data();
          setGroup(groupData);
        } else {
          await setDoc(groupRef, { mentees: {} });
          setGroup({ mentees: {} });
        }
      } catch (error) {
        console.error('Error fetching/creating group:', error);
      }
    };

    if (userId) {
      fetchGroup();
    }
  }, [userId]);

  const handleChatIconClick = (seeker) => {
    setSelectedSeeker(seeker);
  };

  const handleAddMentee = async (selectedSeekers) => {
    try {
      const groupRef = doc(db, 'Groups', userId);
      const mentees = selectedSeekers.reduce((acc, seeker) => {
        acc[seeker.id] = {
          name: seeker.displayName,
          // Add other relevant mentee data
        };
        return acc;
      }, {});
      await setDoc(
        groupRef,
        { mentees: { ...group.mentees, ...mentees } },
        { merge: true }
      );

      const updatedGroupSnapshot = await getDoc(groupRef);
      setGroup(updatedGroupSnapshot.data());
    } catch (error) {
      console.error('Error adding mentees to the group:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar
          userType={userType}
          iconSize={iconSize}
          currentPage={'groups'}
          userId={userId}
        />
        <div className="px-3">
          <h1 className="text-7xl pt-2 font-bold text-primary">Groups</h1>
          <button
            className="bg-secondary text-white px-4 py-2 rounded"
            onClick={openAddMenteeDialog}
          >
            Add Mentee
          </button>
          <AnimatePresence>
            {isAddMenteeDialogOpen && (
              <AddMenteeDialog
                isOpen={isAddMenteeDialogOpen}
                onClose={() => setIsAddMenteeDialogOpen(false)}
                onAddMentee={handleAddMentee}
              />
            )}
          </AnimatePresence>
          {group ? (
            <div>
              {Object.keys(group.mentees).length > 0 ? (
                Object.entries(group.mentees).map(([menteeId, menteeData]) => (
                  <div key={menteeId} className="mb-6 flex items-center">
                    <p className="text-2xl font-semibold mr-6">{menteeData.name}</p>
                    <button
                      onClick={() => handleChatIconClick(menteeData)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p>No Mentees to Display!</p>
              )}
            </div>
          ) : (
            <p>Loading group information...</p>
          )}
        </div>
      </div>
      <ChatBox userId={userId} selectedSeeker={selectedSeeker} />
      <Footer />
    </>
  );
};

export default GroupPage;
