import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import AppLayout from '@/layouts/AppLayout'
import LandingPage from '@/features/auth/LandingPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/ResetPasswordPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public landing at root
      { index: true, element: <LandingPage /> },

      // Auth routes (public)
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },

      // Protected app routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: 'dashboard',
                lazy: () =>
                  import('@/pages/DashboardPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'services',
                lazy: () =>
                  import('@/pages/ServicesPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'subscription',
                lazy: () =>
                  import('@/pages/SubscriptionPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'billing',
                lazy: () =>
                  import('@/pages/BillingPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'team',
                lazy: () =>
                  import('@/pages/TeamPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'referrals',
                lazy: () =>
                  import('@/pages/ReferralsPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'notifications',
                lazy: () =>
                  import('@/pages/NotificationsPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'support',
                lazy: () =>
                  import('@/pages/SupportPage').then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: 'profile',
                lazy: () =>
                  import('@/pages/ProfilePage').then((m) => ({
                    Component: m.default,
                  })),
              },
            ],
          },
        ],
      },
    ],
  },
])
