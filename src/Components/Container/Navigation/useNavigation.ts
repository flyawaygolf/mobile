import * as React from 'react';

import NavigationContext from './NavigationContext';

function useNavigation() {
  const navigation = React.useContext(NavigationContext);

  return navigation;
}
