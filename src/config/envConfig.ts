export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8880/api";
};

export const clientBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "https://192.168.1.253:3333"
  );
};

export const aiAPI1 = (): string => {
  return process.env.NEXT_PUBLIC_AI_KEY || "";
};

export const reportBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_API_REPORT ||
    "http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx"
  );
};

export const imageBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://192.168.1.253:8080";
};



export const secret = (): string => {
  return process.env.NEXT_PUBLIC_SECRET || "MyNameIsMdKamrulHasan";
};
export const random = (): number => {
  return Number(process.env.NEXT_PUBLIC_RANDOM) || 15;
};
