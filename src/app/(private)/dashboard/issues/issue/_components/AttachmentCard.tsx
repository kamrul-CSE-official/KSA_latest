import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"


interface IAttachement {
    ID: number;
    FilePath: string;
    ParentID: number;
    FileType: string
}

const AttachmentCard = ({ attachment }: { attachment: IAttachement }) => {
    const getFileIcon = (fileType: string, attachment: IAttachement) => {
        if (fileType?.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
        if (fileType?.includes("image")) return <img src={attachment.FilePath} alt={attachment.FileType} className="h-5 w-5 text-blue-500" />
        return <FileText className="h-5 w-5 text-gray-500" />
    }

    const getFileTypeLabel = (fileType: string) => {
        if (fileType?.includes("pdf")) return "PDF Document"
        if (fileType?.includes("image")) return "Image File"
        return "File"
    }

    if (!attachment) return null

    return (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    {getFileIcon(attachment.FileType, attachment)}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{getFileTypeLabel(attachment.FileType)}</p>
                        <p className="text-xs text-muted-foreground">{attachment.FileType}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <Link href={attachment.FilePath} target="_blank" className="gap-2">
                            <Download className="h-4 w-4" />
                            View
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AttachmentCard