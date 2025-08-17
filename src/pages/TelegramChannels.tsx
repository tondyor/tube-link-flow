import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Source {
  id: string;
  name: string;
}

const fetchSources = async (): Promise<Source[]> => {
  const { data, error } = await supabase
    .from('telegram_channels')
    .select('id, name')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const TelegramChannels = () => {
  const [sourceInput, setSourceInput] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sources = [], isLoading: isLoadingSources } = useQuery({
    queryKey: ['textSources'],
    queryFn: fetchSources,
  });

  const addSourceMutation = useMutation({
    mutationFn: async (rawInput: string) => {
      const { data, error } = await supabase
        .from('telegram_channels')
        .insert({ name: rawInput })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textSources'] });
      toast({
        title: "Источник добавлен",
        description: "Текст успешно сохранен.",
      });
      setSourceInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка добавления",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const { error } = await supabase.from('telegram_channels').delete().eq('id', sourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textSources'] });
      toast({
        title: "Источник удален",
        description: "Запись успешно удалена.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddSource = async () => {
    if (!sourceInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Поле не может быть пустым.",
        variant: "destructive",
      });
      return;
    }
    addSourceMutation.mutate(sourceInput);
  };

  const isLoading = addSourceMutation.isPending || deleteSourceMutation.isPending;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Источники Telegram</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Добавить источник</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-input">Текст для сохранения</Label>
            <div className="flex gap-2">
              <Input
                id="source-input"
                placeholder="Введите любой текст..."
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleAddSource} 
                disabled={isLoading}
                className="flex items-center gap-2 w-32"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Добавить
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Введенный текст будет сохранен в базе данных как есть.
            </p>
          </div>
        </CardContent>
      </Card>

      {isLoadingSources ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card key={source.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{source.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex justify-end mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSourceMutation.mutate(source.id)}
                  disabled={deleteSourceMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Send className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет добавленных записей</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Добавьте первую запись, чтобы увидеть ее здесь.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TelegramChannels;