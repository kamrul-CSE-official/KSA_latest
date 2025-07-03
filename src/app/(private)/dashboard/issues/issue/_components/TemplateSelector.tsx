"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  HelpCircle,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Monitor,
  Factory,
  Printer,
  Shirt,
  Circle,
  Minus,
  Package,
  FolderOpen,
  Target,
  CheckCircle,
  Settings,
  User,
  Edit,
  Delete,
} from "lucide-react";
import templatesData from "./templatesData.json";
import CreateTemplate from "./createTemplate";
import { useAboutTemplatesMutation } from "@/redux/services/issuesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateTemplate from "./updateTemplate";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  icon: keyof typeof iconMap;
}

interface ICustomTemp {
  ID: number;
  Title: string;
  Image: string;
  CreatedAt: string;
  MESSAGE: string;
  Content: string;
  Description: string;
  FullName: string;
  Dept: string;
  Creator: number
}

interface TemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
}

const templates: Template[] = templatesData.templates.map((t) => ({
  ...t,
  icon: t.icon as keyof typeof iconMap,
}));

const iconMap = {
  Monitor,
  Factory,
  Printer,
  Shirt,
  Zap,
  Circle,
  Minus,
  CheckCircle,
  Bug,
  Package,
  Users,
  FolderOpen,
  Target,
};

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUpdateTemp, setIsUpdateTemp] = useState<number>(0);

  const [reqTemp, { isLoading, data = [] }] = useAboutTemplatesMutation();
  const userDetails = useSelector((state: RootState) => state.user.userData);

  const categories = useMemo(
    () => Array.from(new Set(templates.map((t) => t.category))),
    []
  );

  const filteredTemplates = selectedCategory === "custom"
    ? []
    : selectedCategory
      ? templates.filter((t) => t.category === selectedCategory)
      : templates;

  const displayedTemplates = isExpanded ? filteredTemplates : filteredTemplates.slice(0, 3);

  useEffect(() => {
    if (selectedCategory === "custom" && userDetails?.EmpID) {
      reqTemp({
        Type: 3,
        ID: userDetails.EmpID,
      });
    }
  }, [selectedCategory, userDetails?.EmpID, reqTemp, isUpdateTemp]);


  const handleTemplateDelete = async (id: number) => {
    await reqTemp({
      Type: 5,
      ID: id
    });
    setIsUpdateTemp((pre) => pre + 1)
  }


  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All Templates
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}

        <Button
          type="button"
          variant={selectedCategory === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("custom")}
          className="text-xs"
        >
          Custom
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Preset Templates */}
        {displayedTemplates && displayedTemplates?.map((template) => {
          const IconComponent = iconMap[template.icon] || HelpCircle;
          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-slate-200"
              onClick={() => onSelectTemplate(template.content)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold text-slate-800">
                      {template.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-slate-600 line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}

        {/* Create Custom Template */}
        {selectedCategory === "custom" && (
          <>
            <CreateTemplate setIsUpdateTemp={setIsUpdateTemp} isUpdateTemp={isUpdateTemp}>
              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-slate-200 bg-blue-50 hover:bg-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-slate-800">
                        Create Template
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-slate-600 line-clamp-2">
                    Create a template to use in your issues.
                  </CardDescription>
                </CardContent>
              </Card>
            </CreateTemplate>

            {/* Custom Templates Loaded from API */}
            {data && data?.map((customTemp: ICustomTemp) => (
              <Card
                key={customTemp?.ID}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-slate-200"
                onClick={() => onSelectTemplate(customTemp?.Content)}
              >
                {userDetails?.EmpID == customTemp.Creator && <div>
                  <UpdateTemplate setIsUpdateTemp={setIsUpdateTemp} isUpdateTemp={isUpdateTemp} tempId={customTemp?.ID}>
                    <Button size="sm" variant="ghost"><Edit /></Button>
                  </UpdateTemplate>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        size="sm"
                        variant="destructive"
                      >
                        <Delete />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this template? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleTemplateDelete(customTemp?.ID);
                            }}
                          >
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>}


                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <img className="h-4 w-4 text-blue-600" src={`data:image/jpeg;base64,${customTemp?.Image}`} alt={customTemp?.FullName} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-slate-800">
                        {customTemp?.Title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 flex flex-col">
                        {customTemp?.FullName}
                        <small>{customTemp?.Dept}</small>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-slate-600 line-clamp-2">
                    {customTemp?.Description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Show More/Less Button */}
      {filteredTemplates && filteredTemplates?.length > 3 && (
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-slate-600 hover:text-slate-800"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More Templates ({filteredTemplates?.length - 3} more)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
