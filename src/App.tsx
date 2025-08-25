import './locales/i18n';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { ClientContainer, ThemeContainer } from './Components/Container';
import WebsocketProvider from './Components/Container/WebSocket/WebsocketProvider';
import { BaseToast } from './Components/Elements/Toasts';
import { store } from './Redux';
import Routes from './Routes';
import { stripe_public_key } from './Services/constante';
import UserStoreRealmSchema from './Services/Realm/userDatabase';

type providerProps = {
  children: React.ReactElement;
};

const Providers = ({ children }: providerProps): JSX.Element => (
  <RealmProvider schema={[UserStoreRealmSchema]}>
    <Provider store={store}>
      <StripeProvider
        publishableKey={stripe_public_key ?? ""}
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.flyawaygolf" // required for Apple Pay
      >
        {children}
      </StripeProvider>
    </Provider>
  </RealmProvider>
);

const App = () => {

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast {...props} />
    ),
  };

  return (
    <Providers>
      <ThemeContainer>
        <NavigationContainer>
          <ClientContainer>
            <WebsocketProvider>
              <Routes />
            </WebsocketProvider>
          </ClientContainer>
        </NavigationContainer>
        <Toast onPress={() => Toast.hide()} config={toastConfig} />
      </ThemeContainer>
    </Providers>
  );
};

export default App;
