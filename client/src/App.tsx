import { Route, Switch } from 'wouter';
import WishlistPage from './pages/WishlistPage';
import DealsPage from './pages/DealsPage';
import DealDetailsPage from './pages/DealDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        {/* Auth Routes - Full Page */}
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />

        {/* Main App Routes - With Header */}
        <Route>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Switch>
              <Route path="/" component={DealsPage} />
              <Route path="/deals/:id" component={DealDetailsPage} />
              <Route path="/wishlist" component={WishlistPage} />
              <Route>
                <div className="text-center py-16">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="mt-2 text-gray-600">Page not found</p>
                </div>
              </Route>
            </Switch>
          </main>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
