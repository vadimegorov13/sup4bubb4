import { Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';
import { lazy } from 'solid-js';

const Stream = lazy(() => import('./pages/Stream'));
const Home = lazy(() => import('./pages/Home'));

const App: Component = () => {
  return (
    <div style="background-color: #181818" class="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stream/:id" element={<Stream />} />
      </Routes>
    </div>
  );
};

export default App;
