/* @refresh reload */
import { Router } from 'solid-app-router';
import { FirebaseProvider } from 'solid-firebase';
import { render } from 'solid-js/web';
import App from './App';
import { firebaseConfig } from './utils/firebaseConfig';
import './index.css';

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
