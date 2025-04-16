import { memo, ReactNode, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Briefcase, CalendarClock, ClipboardList, FileText, Megaphone, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface Template {
    id: string;
    name: string;
    template: string;
  }

const TemplateSelector = memo(function TemplateSelector({
    templates,
    onSelectTemplate,
    onAIGenerate,
    setTempOpen,
    tempOpen,
  }: {
    templates: Template[];
    onSelectTemplate: (template: string) => void;
    onAIGenerate: () => void;
    setTempOpen: (open: boolean) => void;
    tempOpen: boolean;
  }) {
    const renderIcon = useCallback((iconName: string): ReactNode => {
      const icons: Record<string, ReactNode> = {
        Briefcase: <Briefcase size={16} />,
        CalendarClock: <CalendarClock size={16} />,
        ClipboardList: <ClipboardList size={16} />,
        FileText: <FileText size={16} />,
        Megaphone: <Megaphone size={16} />,
        Users: <Users size={16} />,
      };
      return icons[iconName] || null;
    }, []);
  
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg backdrop-blur-md p-4 min-w-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose a template to get started
          </h3>
          <Button
            variant="ghost"
            onClick={() => setTempOpen(false)}
            size="icon"
          >
            X
          </Button>
        </div>
  
        <div className="flex overflow-x-auto pb-2 mb-3 gap-2 scrollbar-hide">
          <Button
            onClick={onAIGenerate}
            size="sm"
            variant="secondary"
            className="flex items-center gap-2 rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gradient-to-r from-blue-50 to-purple-50 active:bg-blue-100 transition-all duration-300 ease-in-out"
          >
            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Generate with AI
            </span>
          </Button>
        </div>
  
        <div className="grid grid-cols-3 gap-3">
          {templates.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onSelectTemplate(item.template)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3",
                      "bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700",
                      "rounded-lg hover:border-primary/50 hover:shadow-sm",
                      "transition-all duration-200 h-full"
                    )}
                  >
                    <span className="text-xs font-medium text-center line-clamp-2">
                      {item.name}
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  });


  export default TemplateSelector