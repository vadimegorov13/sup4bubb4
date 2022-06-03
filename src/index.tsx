/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { FirebaseProvider } from 'solid-firebase';
import App from './App';
import { firebaseConfig } from './firebaseConfig';

render(
  () => (
    <FirebaseProvider config={firebaseConfig}>
      <App />
    </FirebaseProvider>
  ),
  document.getElementById('root') as HTMLElement
);
