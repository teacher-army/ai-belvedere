import React from 'react';
import useStore from '@store/store';
import { generateDefaultChat, supportedModels } from '@constants/chat';
import { ChatInterface, ModelOptions } from '@type/chat';
import { handleNewMessageDraftBufferPersist } from '@utils/handleNewMessageDraftsPersistence';

const useAddChat = () => {

  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const setNewMessageDraftBuffer = useStore((state) => state.setNewMessageDraftBuffer);
  const replaceCurrentChat = useStore((state) => state.replaceCurrentChat);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const addChat = (folder?: string, model?: ModelOptions) => { // Added optional model parameter

    handleNewMessageDraftBufferPersist("useAddChat"); //persist new message draft buffer where it belonged to

    const chats = useStore.getState().chats || [];

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
    let titleIndex = 1;
    let title = `New Chat ${titleIndex}`;

    while (chats.some((chat) => chat.title === title)) {
      titleIndex += 1;
      title = `New Chat ${titleIndex}`;
    }

    const newChat = generateDefaultChat(title, folder);

    if (model) {
      newChat.config = { ...newChat.config, model };
      newChat.config.maxGenerationTokens = supportedModels[model].maxModelCompletionTokens;
    }  

    if (replaceCurrentChat)
      updatedChats[currentChatIndex] = newChat;
    else
      updatedChats.unshift(newChat);
  
    setChats(updatedChats);
  
    setNewMessageDraftBuffer("", 0);    // clear the new message draft buffer for new chat

    setCurrentChatIndex(0);             
    
  };

  return addChat;
};

export default useAddChat;
