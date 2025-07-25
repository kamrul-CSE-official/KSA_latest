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

