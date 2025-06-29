"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import templatesData from "./templatesData.json"

interface Template {
  id: string
  title: string
  description: string
  content: string
  category: string
  icon: any
}

interface TemplateSelectorProps {
  onSelectTemplate: (content: string) => void
}

const templates = templatesData.templates

const iconMap = {
  Monitor: Monitor,
  Factory: Factory,
  Printer: Printer,
  Shirt: Shirt,
  Zap: Zap,
  Circle: Circle,
  Minus: Minus,
  CheckCircle: CheckCircle,
  Bug: Bug,
  Package: Package,
  Users: Users,
  FolderOpen: FolderOpen,
  Target: Target,
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(templates.map((t) => t.category)))
  const filteredTemplates = selectedCategory ? templates.filter((t) => t.category === selectedCategory) : templates

  const displayedTemplates = isExpanded ? filteredTemplates : filteredTemplates.slice(0, 3)

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
      </div>

      {/* Templates Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {displayedTemplates.map((template) => {
          const IconComponent = iconMap[template.icon as keyof typeof iconMap] || HelpCircle
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
                    <CardTitle className="text-sm font-semibold text-slate-800">{template.title}</CardTitle>
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
          )
        })}
      </div>

      {/* Show More/Less Button */}
      {filteredTemplates.length > 3 && (
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
                Show More Templates ({filteredTemplates.length - 3} more)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
