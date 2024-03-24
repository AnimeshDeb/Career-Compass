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
                  <div key={menteeId} className="mb-4">
                    <p className="text-lg font-semibold">{menteeData.name}</p>
                    {/* Add other mentee details here */}
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
      <ChatBox />
      <Footer />
    </>
  );
};

export default GroupPage;
