import React, { Suspense, lazy, useContext, Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Algo salió mal</div>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 28px', borderRadius: 24, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import Welcome from './pages/Welcome';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import { AuthContext } from './context/AuthContext';

function MyProfileRedirect() {
  const { user } = useContext(AuthContext);
  const id = user?._id || user?.id;
  return id ? <Navigate to={`/profile/${id}`} replace /> : <Navigate to="/auth/login" replace />;
}

// Lazy load modules
const SocialModule = lazy(() => import('./social/SocialModule'));
const ShopModule = lazy(() => import('./shop/ShopModule'));
const FoodModule = lazy(() => import('./food/FoodModule'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const OAuthCallback = lazy(() => import('./components/Auth/OAuthCallback'));
const UniversalSearch = lazy(() => import('./pages/Search'));
const HybridFeed = lazy(() => import('./pages/Feed'));
const UserProfile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const VirtualCinema = lazy(() => import('./pages/Cinema'));
const BlackHoleEvents = lazy(() => import('./pages/Events'));
const PortalKronos = lazy(() => import('./pages/Portal'));
const MiniAppDashboard = lazy(() => import('./pages/MiniApps'));
const KronosMockups = lazy(() => import('./pages/KronosMockups'));
const Pricing = lazy(() => import('./pages/Pricing'));
const SubscriptionSuccess = lazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCancel = lazy(() => import('./pages/SubscriptionCancel'));
const Communities = lazy(() => import('./pages/Communities'));
const CommunityDetail = lazy(() => import('./pages/CommunityDetail'));
const Live = lazy(() => import('./pages/Live'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Wallet = lazy(() => import('./pages/Wallet'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Health = lazy(() => import('./pages/Health'));
const AvatarPage = lazy(() => import('./pages/Avatar'));
const VideoEditorPage = lazy(() => import('./pages/VideoEditor'));

function App() {
  return (
    <Router>
      <NotificationToast />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 15, 26, 0.95)',
            color: '#fff',
            border: '1px solid rgba(179, 68, 255, 0.3)',
            backdropFilter: 'blur(20px)'
          }
        }}
      />
      <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</div></div>}>
        <Routes>
          {/* Welcome Page */}
          <Route path="/" element={<Welcome />} />

          {/* Design System Preview */}
          <Route path="/mockups" element={<KronosMockups />} />

          {/* Kronos Pro / Suscripciones */}
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/subscription/success"
            element={
              <ProtectedRoute>
                <SubscriptionSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/login" element={<Navigate to="/auth/login" />} />
          <Route path="/register" element={<Navigate to="/auth/register" />} />

          {/* Protected Routes */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Navbar />
                <UniversalSearch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Navbar />
                <HybridFeed />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/me" element={<ProtectedRoute><MyProfileRedirect /></ProtectedRoute>} />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Navbar />
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/social/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <SocialModule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <ShopModule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <FoodModule />
              </ProtectedRoute>
            }
          />

          {/* Settings (2FA + Sessions) */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Navbar />
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/:tab"
            element={
              <ProtectedRoute>
                <Navbar />
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Virtual Cinema Sync */}
          <Route
            path="/cinema"
            element={
              <ProtectedRoute>
                <Navbar />
                <div
                  className="min-h-screen p-6"
                  style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0528 50%, #0d1117 100%)' }}
                >
                  <VirtualCinema />
                </div>
              </ProtectedRoute>
            }
          />

          {/* BlackHole Events */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Navbar />
                <div
                  className="min-h-screen p-6"
                  style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0528 50%, #0d1117 100%)' }}
                >
                  <BlackHoleEvents />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Portal Kronos (Audio Rooms) */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <Navbar />
                <div
                  className="min-h-screen"
                  style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0528 50%, #0d1117 100%)' }}
                >
                  <PortalKronos />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Mini-Apps */}
          <Route
            path="/miniapps"
            element={
              <ProtectedRoute>
                <Navbar />
                <div
                  className="min-h-screen p-6"
                  style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0528 50%, #0d1117 100%)' }}
                >
                  <MiniAppDashboard />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Marketplace P2P con Escrow */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Navbar />
                <Marketplace />
              </ProtectedRoute>
            }
          />

          {/* Wallet */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Navbar />
                <Wallet />
              </ProtectedRoute>
            }
          />

          {/* LIVE - Videollamadas, Streaming, Audio Spaces */}
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <Navbar />
                <Live />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Navbar />
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Comunidades */}
          <Route
            path="/communities"
            element={
              <ProtectedRoute>
                <Navbar />
                <Communities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <CommunityDetail />
              </ProtectedRoute>
            }
          />

          {/* Reservaciones */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Navbar />
                <Reservations />
              </ProtectedRoute>
            }
          />

          {/* Health & Fitness */}
          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <Navbar />
                <Health />
              </ProtectedRoute>
            }
          />

          {/* Avatar 3D + Tienda */}
          <Route
            path="/avatar"
            element={
              <ProtectedRoute>
                <Navbar />
                <AvatarPage />
              </ProtectedRoute>
            }
          />

          {/* Editor de Video Lite */}
          <Route
            path="/video-editor"
            element={
              <ProtectedRoute>
                <Navbar />
                <VideoEditorPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Panel */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
