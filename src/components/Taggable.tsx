import React from "react";
import { useTagging } from "@/context/TaggingContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaggableProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

const Taggable: React.FC<TaggableProps> = ({ id, name, children }) => {
  const { isTaggingMode, taggedComponents, addTag, removeTag } = useTagging();

  const isTagged = taggedComponents.some((c) => c.id === id);

  const handleClick = (e: React.MouseEvent) => {
    if (!isTaggingMode) return;
    e.stopPropagation();
    e.preventDefault();
    if (isTagged) {
      removeTag(id);
    } else {
      addTag({ id, name });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative",
        isTaggingMode && "cursor-pointer",
        isTagged && "ring-2 ring-offset-2 ring-primary rounded"
      )}
      data-component-id={id}
      title={isTaggingMode ? (isTagged ? `Снять пометку: ${name}` : `Пометить: ${name}`) : undefined}
    >
      {children}
      {isTagged && (
        <Badge
          variant="secondary"
          className="absolute top-1 right-1 text-xs cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            removeTag(id);
          }}
        >
          ✓
        </Badge>
      )}
    </div>
  );
};

export default Taggable;