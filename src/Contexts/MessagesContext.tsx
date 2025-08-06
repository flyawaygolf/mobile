import React, { createContext, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../Redux';
import { guildI } from '../Redux/guildList';
import { updateGuildList } from '../Redux/guildList/action';

export interface MessagesContextType {
  // État des guilds
  guild: guildI;
  // Fonctions de synchronisation interne
  updateGuildInfoSync: (guildId: string, updates: Partial<guildI>) => void;
  selectGuild: (guildId: string) => void;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const guilds = useAppSelector((state) => state.guildListFeed);

  const [guild, setGuild] = React.useState<guildI | null>(null);

  // Fonction pour mettre à jour les informations d'une guild
  const updateGuildInfoSync = (guildId: string, updates: Partial<guildI>) => {
    // Mettre à jour dans Redux si nécessaire
    dispatch(updateGuildList({
        guild_id: guildId,
        ...updates
    }));

    if(guild) setGuild({
          ...guild,
          ...updates
        });
  }

  // Fonction utilitaire pour trouver une guild par ID
  const findGuildById = useCallback((guildId: string): guildI | undefined => {
    return guilds.find(g => g.guild_id === guildId);
  }, [guilds]);

  // Fonction pour sélectionner une guild
  const selectGuild = useCallback((guildId: string) => {
    const selectedGuild = findGuildById(guildId);
    setGuild(selectedGuild || null);
  }, [findGuildById]);

  const contextValue: MessagesContextType = {
    guild: guild!,
    updateGuildInfoSync,
    selectGuild
  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMessages = () => {
  const context = React.useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages doit être utilisé dans un MessagesProvider');
  }
  return context;
};

export default MessagesContext;
