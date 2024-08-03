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
export const GetTimesHttpRequest = () => axios.get(baseUrl + "Auth/times/81a7358d-c092-4353-8bbf-33d72723a565")
export const AddTimeHttpRequest = (time) => axios.post(baseUrl + "Auth/Admin/addTime", time)
