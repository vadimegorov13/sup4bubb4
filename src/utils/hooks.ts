import { doc, getFirestore } from 'firebase/firestore';
import { useFirestore } from 'solid-firebase';
const db = getFirestore();

const getStream = (id: string) => {
  console.log(id);
  return useFirestore(doc(db, 'streams', id));
};

export { getStream };
