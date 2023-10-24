import { UpdateInsurancePayload } from "@/types";

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

type LoginBody = {
  username: string;
  password: string;
};

export const loginApi = (body: LoginBody) => {
  return fetch(`${baseApiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) return res.json();
    else
      throw new Error(
        "Failed to login, please provide correct username and password."
      );
  });
};

export const getInsuranceListApi = (bikeId: number) => {
  return fetch(`${baseApiUrl}/bikes/${bikeId}/insurances`).then((res) => {
    if (res.status === 200) return res.json();
    else throw new Error(`Failed to get insurance list with bikeId ${bikeId}`);
  });
};

export const updateInsuranceByIdApi = (
  body: UpdateInsurancePayload,
  bikeId: number,
  insuranceId: number
) => {
  const token = localStorage.getItem("SESSION_ID");
  return fetch(`${baseApiUrl}/bikes/${bikeId}/insurance/${insuranceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) return res.json();
    else
      throw new Error(
        `Failed to update insurance with BikeId ${bikeId}, InsuranceId ${insuranceId}.`
      );
  });
};
