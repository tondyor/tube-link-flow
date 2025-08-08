import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTagging } from "@/context/TaggingContext";

const TaggingDialog = () => {
  const { taggedComponents, removeTag, clearTags } = useTagging();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Пометки ({taggedComponents.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Помеченные компоненты</DialogTitle>
        </DialogHeader>
        {taggedComponents.length === 0 ? (
          <p className="text-muted-foreground">Нет помеченных компонентов.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {taggedComponents.map(({ id, name }) => (
              <li
                key={id}
                className="flex justify-between items-center border rounded p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const el = document.querySelector(`[data-component-id="${id}"]`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    // Можно добавить краткую анимацию выделения
                    el.classList.add("ring-4", "ring-primary");
                    setTimeout(() => el.classList.remove("ring-4", "ring-primary"), 2000);
                  }
                }}
              >
                <span>{name}</span>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeTag(id); }}>
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        )}
        {taggedComponents.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" onClick={clearTags}>
              Очистить все
            </Button>
          </div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full">
            Закрыть
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TaggingDialog;