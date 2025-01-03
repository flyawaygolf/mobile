import * as React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Services';

export type NavigationContextI = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigation'> | undefined

const NavigationContext = React.createContext<NavigationContextI>(undefined);

NavigationContext.displayName = 'NavigationContext';

export default NavigationContext;
