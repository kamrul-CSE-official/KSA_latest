import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { IUserinfo } from "@/types/globelTypes";
import { AUTH_KEY } from "@/constant/storage.key";



export async function getUserInfo(): Promise<IUserinfo | null> {
  const token = Cookies.get(AUTH_KEY);

  if (!token) {
    return null;
  }

  

  try {
    const decodedData = jwtDecode<IUserinfo>(token);
    if (decodedData.EmpID && decodedData.UserName) {
      return {
        EmpID: decodedData.EmpID,
        CompanyID: decodedData.CompanyID,
        CostCenterID: decodedData.CostCenterID,
        ServiceDepartmentID: decodedData.ServiceDepartmentID,
        SubCostCenterID: decodedData.SubCostCenterID,
        UserID: decodedData.UserID,
        UserName: decodedData.UserName,
        iat: decodedData.iat,
        exp: decodedData.exp,
      };
    }
  } catch (error) {
    console.log("Error decoding token:", error);
  }

  return null;
}






export function logout() {
  Cookies.remove(AUTH_KEY);
}