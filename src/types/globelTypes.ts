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



export interface IIssue {
  ID: string | number
  TITLE: string
  CONTENT: string
  USER_ID: number
  CREATED_AT: string
  TAGS?: string[]
  TAG_LIST?: string
  VOTES?: number
  LIKES_COUNT: number
  solutions: Solution[]
  IMAGE: string
  FULL_NAME: string
  VIEWS_COUNT: string
  NUMBER_OF_SULATION: number
  IsLiked: number | string
  LIKES_TYPE?: number
  SUMMARY: string
  DesgName: string
}

export interface Solution {
  ID?: number
  FULL_NAME?: string
  IMAGE?: string
  content: string
  createdAt?: string
  votes?: number
  reviews?: Review[]
  replies?: Reply[]
  Summary?: string
  TITLE?: string
  STATUS?: number
  CONTENT?: string
  DEPTNAME?: string
  USER_ID: number
  UPDATED_AT: string
}

export interface Review {
  ID: string
  IMAGE: string
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
