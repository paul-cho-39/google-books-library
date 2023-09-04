import router from "next/router";
import { SignInForm } from "../types/formInputsWithChildren";

type Data<T> = T extends SignInForm ? Partial<SignInForm> : string;
export type Method = "PUT" | "POST" | "GET" | "DELETE";

interface ParamProps<T> {
  url: string;
  method: Method;
  data?: Data<T>;
  options?: {
    shouldRoute?: boolean;
    routeTo?: string;
    delay?: number;
  };
}

async function fetchApiData<T>({
  url,
  method,
  data,
  options = {
    shouldRoute: true,
    routeTo: "/",
    delay: 2500,
  },
}: ParamProps<T>) {
  const apiBaseUrl = "/api";
  await fetch(apiBaseUrl + url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok || res.status === 400 || res.status === 404) {
      throw new Error(`${data} cannot be found`);
    }
    if ((res.ok && method === "POST") || (res.ok && method === "PUT")) {
      setTimeout(() => {
        options.shouldRoute && options.routeTo && router.push(options.routeTo);
      }, options.delay ?? 0);
    }
    if (method === "GET") {
      return res.json();
    }
  });
}

export default fetchApiData;
