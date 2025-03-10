// "use client";

// import * as React from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Bell,
//   CirclePlusIcon,
//   Copy,
//   CornerUpLeft,
//   CornerUpRight,
//   FileText,
//   GalleryVerticalEnd,
//   LineChart,
//   Link,
//   MoreHorizontal,
//   Settings2,
//   Star,
//   Trash,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { usePathname, useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";

// export function NavActions() {
//   const [isOpen, setIsOpen] = React.useState<boolean>(false);
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const workspaceId = searchParams.get("workspaceId");
//   const route = useRouter();

//   console.log("Right side: ", pathname);

//   React.useEffect(() => {
//     if (!pathname) return;
//     const isWorkspaceRoute =
//       // pathname.includes("/dashboard/workspace") ||
//       pathname.includes("/dashboard/idea");
//     setIsOpen(isWorkspaceRoute);
//   }, [pathname]);

//   const handleIdea = (id: string | number) => {
//     route.push(`/dashboard/idea?ideaId=${id}`);
//   };

//   return (
//     <div className="flex items-center gap-2 text-sm">
//       <div>
//         <Popover open={isOpen}>
//           <PopoverTrigger asChild>
//             <Button
//               onClick={() => setIsOpen(!isOpen)}
//               variant="ghost"
//               size="icon"
//               className="data-[state=open]:bg-accent h-7 w-7"
//             >
//               <MoreHorizontal />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent
//             className="w-56 overflow-hidden rounded-lg p-0"
//             align="end"
//           >
//             <Sidebar collapsible="none" className="bg-transparent">
//               <SidebarContent>
//                 <SidebarGroup className="border-b last:border-none">
//                   <SidebarGroupContent className="gap-0">
//                     <SidebarMenu>
//                       <SidebarMenuItem>
//                         <SidebarMenuButton
//                           className="border-2 cursor-pointer"
//                           variant="outline" asChild={true}
//                         >
//                           <CirclePlusIcon /> <span>Create A Document</span>
//                         </SidebarMenuButton>
//                       </SidebarMenuItem>
//                     </SidebarMenu>
//                   </SidebarGroupContent>
//                 </SidebarGroup>
//                 {/*  */}
//                 <SidebarGroup className="border-b last:border-none">
//                   <SidebarGroupContent className="gap-0">
//                     <SidebarMenu>
//                       <SidebarMenuItem>
//                         <SidebarMenuButton
//                           onClick={() => handleIdea(1)}
//                           className="cursor-pointer"
//                           variant="outline"
//                           asChild={true}
//                         >
//                           <img src="/assets/loopdocument.svg" alt="doc-icon" />
//                           <span>Create A Document</span>
//                         </SidebarMenuButton>
//                       </SidebarMenuItem>
//                     </SidebarMenu>
//                   </SidebarGroupContent>
//                 </SidebarGroup>
//               </SidebarContent>
//             </Sidebar>
//           </PopoverContent>
//         </Popover>
//       </div>
//     </div>
//   );
// }
