import axios from "axios"
import { getCookie } from "./cookie"

const baseUrl = "https://localhost:7087/"
const cookie = getCookie("token")
axios.defaults.headers.common["Authorization"] = "Bearer " + cookie
export const GetDepartmentsHttpRequest = () => axios.get(baseUrl + "Auth/allInfo")
export const GetDoctorsHttpRequest = (skillID) => axios.get(baseUrl + `Auth/doctors/${skillID}`)
export const AddAdminHttpRequest = (data) => axios.post(baseUrl + "Auth/admin/Add", data)
export const GetSkillsHttpRequest = () => axios.get(baseUrl + "Auth/allInfo")
export const GetPatientsHttpRequest = () => axios.get(baseUrl + "Auth/Admin/patients")
export const AddPatientHttpRequest = (data) => axios.post(baseUrl + "Auth", data)
export const GetTimesHttpRequest = (id) => axios.get(baseUrl + "Auth/times/" + id || "")
export const AddTimeHttpRequest = (time) => axios.post(baseUrl + "Auth/Admin/addTime", time)
export const DeleteVisitHttpRequest = (visitTimeId) => axios.delete(baseUrl + `Auth/deleteTime/${visitTimeId}`)
export const CancelVisitHttpRequest = (patientId, visitTimeId) => axios.get(baseUrl + `Auth/CancelVisit/${patientId}/${visitTimeId}`)
