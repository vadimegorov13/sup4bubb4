import 'firebase/app';
import { collection, doc, getFirestore } from 'firebase/firestore';
import { useFirestore } from 'solid-firebase';

const db = getFirestore();

const getStreams = () => {
  return useFirestore(collection(db, 'streams'));
};

const getStream = (id: string) => {
  const stream = useFirestore(doc(db, 'streams', id));
  const playlist = useFirestore(doc(db, 'songs', id));

  return [stream, playlist];
};

export { getStreams, getStream };
