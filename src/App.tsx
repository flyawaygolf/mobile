import './locales/i18n';
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ClientContainer, ThemeContainer } from './Components/Container';
import { BaseToast } from './Components/Elements/Toasts';
import Routes from './Routes';
import { store } from './Redux';
import { RealmProvider } from '@realm/react';
import UserStoreRealmSchema from './Services/Realm/userDatabase';
import WebsocketProvider from './Components/Container/WebSocket/WebsocketProvider';

type providerProps = {
  children: React.ReactElement;
};

const Providers = ({ children }: providerProps): JSX.Element => (
  <RealmProvider schema={[UserStoreRealmSchema]}>
    <Provider store={store}>
      {children}
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
