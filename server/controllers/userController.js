const { db, admin } = require('../database');
const { collection, getDocs, getDoc, doc } = require('firebase-admin/firestore');

const getUsers = async (req, res) => { 
    try {
        const usersCollection = collection(db, 'Seekers');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(doc => doc.data());
        res.json(usersData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const usersCollection = collection(db, 'Seekers');
        const userDoc = doc(usersCollection, userId);
        const userSnapshot = await getDoc(userDoc);
        console.log("called")

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            res.json(userData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getUsers, getUserById };