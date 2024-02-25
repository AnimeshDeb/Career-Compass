import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const performSearch = async (searchTerm) => {
  const seekersRef = collection(db, "Seekers");
  const mentorsRef = collection(db, "Mentors");
  const searchFields = ["displayName"];

  const searchQueries = searchFields
    .map((field) => {
      return [
        query(
          seekersRef,
          where(field, ">=", searchTerm),
          where(field, "<=", searchTerm + "\uf8ff")
        ),
        query(
          mentorsRef,
          where(field, ">=", searchTerm),
          where(field, "<=", searchTerm + "\uf8ff")
        ),
      ];
    })
    .flat();

  const searchPromises = searchQueries.map(async (q) => {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      userType: q._query.path.segments[0],
    }));
  });

  const results = await Promise.all(searchPromises);
  const flattenedResults = [].concat(...results);
  const uniqueResults = Array.from(
    new Map(flattenedResults.map((item) => [item.id, item])).values()
  );

  const sortedResults = uniqueResults.sort((a, b) =>
    a.userType.localeCompare(b.userType)
  );

  return sortedResults;
};