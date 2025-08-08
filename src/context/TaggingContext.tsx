import React, { createContext, useContext, useState, ReactNode } from "react";

export interface TaggedComponent {
  id: string;
  name: string;
}

interface TaggingContextType {
  taggedComponents: TaggedComponent[];
  isTaggingMode: boolean;
  toggleTaggingMode: () => void;
  addTag: (component: TaggedComponent) => void;
  removeTag: (id: string) => void;
  clearTags: () => void;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

export const TaggingProvider = ({ children }: { children: ReactNode }) => {
  const [taggedComponents, setTaggedComponents] = useState<TaggedComponent[]>([]);
  const [isTaggingMode, setIsTaggingMode] = useState(false);

  const toggleTaggingMode = () => setIsTaggingMode((prev) => !prev);

  const addTag = (component: TaggedComponent) => {
    setTaggedComponents((prev) => {
      if (prev.find((c) => c.id === component.id)) return prev;
      return [...prev, component];
    });
  };

  const removeTag = (id: string) => {
    setTaggedComponents((prev) => prev.filter((c) => c.id !== id));
  };

  const clearTags = () => setTaggedComponents([]);

  return (
    <TaggingContext.Provider
      value={{ taggedComponents, isTaggingMode, toggleTaggingMode, addTag, removeTag, clearTags }}
    >
      {children}
    </TaggingContext.Provider>
  );
};

export const useTagging = () => {
  const context = useContext(TaggingContext);
  if (!context) {
    throw new Error("useTagging must be used within a TaggingProvider");
  }
  return context;
};