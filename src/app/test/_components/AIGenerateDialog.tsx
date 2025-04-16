import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { memo, useCallback, useState } from "react";

const AIGenerateDialog = memo(function AIGenerateDialog({
  open,
  onClose,
  onGenerate,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
  loading: boolean;
}) {
  const [userInput, setUserInput] = useState("");

  const handleGenerate = useCallback(async () => {
    await onGenerate(userInput);
    setUserInput("");
  }, [onGenerate, userInput]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate AI Template</DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="template-prompt"
                  className="block text-sm font-medium mb-1"
                >
                  What would you like to write about?
                </label>
                <Input
                  id="template-prompt"
                  placeholder="Ex. Project Idea, Meeting Notes, Marketing Plan..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={!userInput.trim() || loading}
                  onClick={handleGenerate}
                  className="min-w-[90px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});

export default AIGenerateDialog