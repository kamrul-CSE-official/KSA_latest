export interface IUserinfo {
  EmpID: number;
  CompanyID: number;
  CostCenterID: number;
  ServiceDepartmentID: number;
  SubCostCenterID: number;
  UserID: number;
  UserName: string;
  iat: number;
  exp: number;
  SectionID: number;
  DepartmentID: number;

  $id?: string;
  Company?: string;
  CostCenter?: string;
  EMPNO?: string;
  FullName?: string;
  Email?: string;
  GRP_EMP_NO?: number;
  Image?: string;
  ImageBase64?: string;
  ItemImage?: string | null;
  Location?: number;
  SectionName?: string;
  SubCostCenter?: string;
}

export interface IEmployee {
  $id: string;
  FullName: string;
  Company: string;
  CompanyID: number;
  SectionName: string;
  SubCostCenter: number;
  SubCostCenterID: number;
  CostCenter: string;
  CostCenterID: number;
  EmpID: number | string;
  Location: number;
  EMPNO: string;
  GRP_EMP_NO: number;
  ItemImage: string | null;
  Image: string | null;
  ImageBase64: string;
}


export interface IWorkspaceDetails {
  CoverImg: string;
  Emoji: string;
  EnterDept: string;
  EnterImg: string;
  EnterSec: string;
  EnterdDesg: string;
  EnterdName: string;
  EnterdOn: string;
  IdeaEmoji: string;
  IdeaId: string;
  IdeaTitle: string;
  IdeaEnterdOn: string;
  EnterdBy: string;
  WorkSpaceName: string;
  ShareTypeName: "Public" | "Private" | "Custom";
}




// Issues

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Issue {
  id: string
  title: string
  content: string
  author: User
  createdAt: string
  tags: string[]
  votes: number
  solutions: Solution[]
}

export interface Solution {
  id: string
  author: User
  content: string
  createdAt: string
  votes: number
  reviews: Review[]
  replies: Reply[]
}

export interface Review {
  id: string
  author: User
  rating: number
  comment: string
  createdAt: string
}

export interface Reply {
  id: string
  author: User
  content: string
  createdAt: string
  votes: number
  replies: Reply[]
}
