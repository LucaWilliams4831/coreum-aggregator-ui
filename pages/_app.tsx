import { Provider } from 'react-redux';
import { useStore } from '../store';

import '../public/css/animate.min.css';
import '../public/css/bootstrap.min.css';
import '../public/css/boxicons.min.css';
import '../public/css/fontawesome.min.css';
import '../public/css/meanmenu.min.css';
import '../public/css/style.css';
import '../public/css/responsive.css';
import '../public/css/custom.css';
import '../public/css/blackHole.css';

import Layout from '../components/Layout/Layout';
import GoTop from '../components/Shared/GoTop';
import { SigningCosmWasmProvider } from '../contexts/cosmwasm'
import { NotificationContainer } from '../components/Notification'

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <NotificationContainer>
      <SigningCosmWasmProvider>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
            <GoTop />
          </Layout>
        </Provider>
      </SigningCosmWasmProvider>
    </NotificationContainer>
  );
}
