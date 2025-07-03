"use client";

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { useIssuesSolutionsMutation } from "@/redux/services/issuesApi";
import { useEffect } from "react";

interface SulationTopNavProps {
    setTopNavState: (index: number) => void;
    topNavState: number;
    issueId: number | string;
}

const SulationTopNav = ({ setTopNavState, topNavState, issueId }: SulationTopNavProps) => {

    const [sulationReq, { isLoading, data }] = useIssuesSolutionsMutation();

    useEffect(() => {

        sulationReq({
            Type: 5,
            ISSUES_ID: issueId
        });
    }, [issueId]);


    return (
        <nav className="border-b">
            {
                isLoading && <p>Loading...</p>
            }
            <Menubar className="rounded-none border-b-0">
                {data?.map((department: { DEPTNAME: string }, index: number) => (
                    <MenubarMenu key={index}>
                        <MenubarTrigger
                            onClick={() => setTopNavState(index)}
                            className={cn(
                                "cursor-pointer",
                                topNavState === index && "bg-muted font-semibold"
                            )}
                        >
                            {department.DEPTNAME}
                        </MenubarTrigger>
                    </MenubarMenu>
                ))}
            </Menubar>
        </nav>
    );
};

export default SulationTopNav;
