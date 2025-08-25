import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';

import { MainNavigation } from "./";
import DrawerContent from '../Components/Container/Drawer/Content';

const DrawerNavigator = createDrawerNavigator();

const DrawerNavigation = () => {

  const [routes] = useState([
    { name: "MainNavigation", screen: MainNavigation },
  ])

  return (
      <DrawerNavigator.Navigator initialRouteName="MainNavigation" screenOptions={{ headerShown: false }}
        drawerContent={(navigation) => DrawerContent(navigation)}>
        {
          routes.map((r, index) => <DrawerNavigator.Screen key={index} name={r.name} component={r.screen} />)
        }
      </DrawerNavigator.Navigator>

  )
}

export default DrawerNavigation
