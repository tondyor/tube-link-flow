import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TaggedElement {
  id: string;
  name: string;
  element: HTMLElement;
}

interface TaggingContextType {
  taggedElements: TaggedElement[];
  isTaggingMode: boolean;
  toggleTaggingMode: () => void;
  addTag: (el: HTMLElement) => void;
  removeTag: (id: string) => void;
  clearTags: () => void;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

function generateId() {
  return "tag-" + Math.random().toString(36).substr(2, 9);
}

export const TaggingProvider = ({ children }: { children: ReactNode }) => {
  const [taggedElements, setTaggedElements] = useState<TaggedElement[]>([]);
  const [isTaggingMode, setIsTaggingMode] = useState(false);

  // Добавить элемент в пометки
  const addTag = (el: HTMLElement) => {
    let id = el.getAttribute("data-tag-id");
    if (!id) {
      id = generateId();
      el.setAttribute("data-tag-id", id);
    }
    const name =
      el.getAttribute("data-tag-name") ||
      el.tagName.toLowerCase() +
        (el.className ? "." + el.className.trim().replace(/\s+/g, ".") : "");
    setTaggedElements((prev) => {
      if (prev.find((t) => t.id === id)) return prev;
      return [...prev, { id, name, element: el }];
    });
    // Добавляем класс выделения
    el.classList.add("tagged-element-highlight");
  };

  // Удалить элемент из пометок
  const removeTag = (id: string) => {
    setTaggedElements((prev) => {
      const toRemove = prev.find((t) => t.id === id);
      if (toRemove) {
        toRemove.element.classList.remove("tagged-element-highlight");
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  // Очистить все пометки
  const clearTags = () => {
    taggedElements.forEach(({ element }) => {
      element.classList.remove("tagged-element-highlight");
    });
    setTaggedElements([]);
  };

  // Переключить режим пометки
  const toggleTaggingMode = () => setIsTaggingMode((prev) => !prev);

  // Глобальный обработчик кликов для пометки элементов
  useEffect(() => {
    if (!isTaggingMode) return;

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (!target) return;

      // Игнорируем элементы диалогов и кнопок управления пометками
      if (target.closest(".tagging-ui-ignore")) return;

      const id = target.getAttribute("data-tag-id");
      if (id && taggedElements.find((t) => t.id === id)) {
        removeTag(id);
      } else {
        addTag(target);
      }
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, [isTaggingMode, taggedElements]);

  // При выключении режима пометки убираем выделения
  useEffect(() => {
    if (!isTaggingMode) {
      taggedElements.forEach(({ element }) => {
        element.classList.remove("tagged-element-highlight");
      });
    } else {
      // При включении — подсвечиваем все помеченные
      taggedElements.forEach(({ element }) => {
        element.classList.add("tagged-element-highlight");
      });
    }
  }, [isTaggingMode, taggedElements]);

  return (
    <TaggingContext.Provider
      value={{ taggedElements, isTaggingMode, toggleTaggingMode, addTag, removeTag, clearTags }}
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