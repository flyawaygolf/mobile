import { useContext } from 'react';
import ProfileContext from './ProfileContext';

export default function useClient() {
  const profile = useContext(ProfileContext);

  return profile;
}
