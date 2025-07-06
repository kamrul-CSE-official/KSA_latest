"use client"

import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

function UpdateSulation({ children, sulationId }: { children: ReactNode, sulationId: number }) {
    
    return (
        <div>
            <Dialog>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent className="max-w-[75rem] w-full max-h-[96vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update sulation</DialogTitle>
                    </DialogHeader>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateSulation