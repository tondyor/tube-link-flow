import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTagging } from "@/context/TaggingContext";

const TaggingDialog = () => {
  const { taggedElements, removeTag, clearTags } = useTagging();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="tagging-ui-ignore">
          Пометки ({taggedElements.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Помеченные элементы</DialogTitle>
        </DialogHeader>
        {taggedElements.length === 0 ? (
          <p className="text-muted-foreground">Нет помеченных элементов.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {taggedElements.map(({ id, name, element }) => (
              <li
                key={id}
                className="flex justify-between items-center border rounded p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.classList.add("ring-4", "ring-primary");
                    setTimeout(() => element.classList.remove("ring-4", "ring-primary"), 2000);
                  }
                }}
              >
                <span>{name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="tagging-ui-ignore"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(id);
                  }}
                >
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        )}
        {taggedElements.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" className="tagging-ui-ignore" onClick={clearTags}>
              Очистить все
            </Button>
          </div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full tagging-ui-ignore">
            Закрыть
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TaggingDialog;