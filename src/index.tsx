/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { FirebaseProvider } from 'solid-firebase';
import App from './App';
import { firebaseConfig } from './firebaseConfig';
import { Router } from 'solid-app-router';

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
