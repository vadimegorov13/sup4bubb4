/* @refresh reload */
import { Router } from 'solid-app-router';
import { FirebaseProvider } from 'solid-firebase';
import { render } from 'solid-js/web';
import App from './App';
import './index.css';
import { firebaseConfig } from './utils/firebaseConfig';

render(
  () => (
    <FirebaseProvider config={firebaseConfig}>
      <Router>
        <App />
      </Router>
    </FirebaseProvider>
  ),
  document.getElementById('root') as HTMLElement
);
