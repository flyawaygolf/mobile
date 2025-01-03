import * as React from 'react';

import NavigationContext from './NavigationContext';

export function useNavigation() {
  const navigation = React.useContext(NavigationContext);

  return navigation;
}

export default useNavigation;