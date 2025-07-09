"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Solution } from "@/types/globelTypes"
import moment from "moment"
import { useState } from "react"
import { Edit, Trash2, ChevronDown, ChevronUp, Clock, User } from "lucide-react"
import { useIssuesSolutionsMutation } from "@/redux/services/issuesApi"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import UpdateSulation from "./updateSulation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const SolutionCard = ({ solution, setUpdateSulation }: { solution: Solution, setUpdateSulation: any }) => {

    const [isExpanded, setIsExpanded] = useState(false)

    const userDetails = useSelector((state: RootState) => state.user.userData);

    const maxLength = 300 // Increased for HTML content

    // Helper function to strip HTML tags for length calculation
    const stripHtml = (html: string) => {
        const tmp = document.createElement("div")
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ""
    }

    const textContent = stripHtml(solution.CONTENT!)
    const shouldTruncate = textContent.length > maxLength

    // For HTML content, we'll truncate by character count of text content
    const getTruncatedHtml = (html: string, maxChars: number) => {
        const tmp = document.createElement("div")
        tmp.innerHTML = html
        const text = tmp.textContent || tmp.innerText || ""

        if (text.length <= maxChars) return html

        // Simple truncation - in production, you might want a more sophisticated approach
        const truncatedText = text.slice(0, maxChars)
        const ratio = truncatedText.length / text.length
        const estimatedHtmlLength = Math.floor(html.length * ratio)

        return html.slice(0, estimatedHtmlLength) + "..."
    }

    const displayContent = isExpanded
        ? solution.CONTENT ?? ""
        : getTruncatedHtml(solution.CONTENT ?? "", maxLength)


    const [sulationsReq] = useIssuesSolutionsMutation();

    const handleSulationDelete = (id: number) => {
        sulationsReq({
            Type: 7,
            ID: id
        });
        setUpdateSulation((pre: number) => pre + 1)
    }


    return (
        <Card className="mb-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{solution.TITLE}</h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">{solution.Summary}</p>
                    </div>
                    {solution.USER_ID == userDetails?.EmpID && <div className="flex gap-2 ml-4">
                        <UpdateSulation setIsUpdateSulation={setUpdateSulation} sulationId={solution.ID!}>
                            <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                            </Button>
                        </UpdateSulation>
                        <AlertDialog>
                            <AlertDialogTrigger><Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                            </Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-500" onClick={() => handleSulationDelete(solution.ID!)}
                                    >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="relative">
                    <div
                        className={cn(
                            "prose prose-sm max-w-none transition-all duration-300",
                            "prose-headings:text-gray-900 dark:prose-headings:text-white",
                            "prose-p:text-gray-700 dark:prose-p:text-gray-300",
                            "prose-strong:text-gray-900 dark:prose-strong:text-white",
                            !isExpanded && shouldTruncate && "relative overflow-hidden",
                        )}
                    >
                        <div dangerouslySetInnerHTML={{ __html: displayContent }} className="leading-relaxed" />

                        {!isExpanded && shouldTruncate && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 pointer-events-none" />
                        )}
                    </div>

                    {shouldTruncate && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-3 h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 relative z-10"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Read More
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>

            <Separator className="mx-6" />

            <CardFooter className="pt-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                            <AvatarImage src={`data:image/jpeg;base64,${solution.IMAGE}`} alt={solution.FULL_NAME} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {solution.FULL_NAME!.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium text-gray-900 dark:text-white text-sm">{solution.FULL_NAME}</span>
                            </div>
                            {solution.DEPTNAME && (
                                <Badge variant="secondary" className="w-fit mt-1 text-xs">
                                    {solution.DEPTNAME}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{moment(solution.UPDATED_AT).format("DD MMM YYYY")}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SolutionCard
