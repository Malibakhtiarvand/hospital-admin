import { AddPatientHttpRequest, GetDepartmentsHttpRequest, GetDoctorsHttpRequest, GetTimesHttpRequest } from "@/app/utilities/httpService"
import { validateEmailError, validateFitLengthError, validateMaxLengthError, validateMinLengthError, validateRequiredError } from "@/app/utilities/validateErrors"
import { useFormik } from "formik"
import moment from "jalali-moment"
import { useEffect, useMemo, useState } from "react"
import * as Yup from "yup"
import {decodeToken, useJwt} from "react-jwt"

export default function Appointment() {
    const [departments, setDepartments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [times, setTimes] = useState([])

    useEffect(
        () => {
            const getDepartmentOnloadPageAsync = async () => {
                const { data } = await GetDepartmentsHttpRequest()
                setDepartments(data)
            }

            getDepartmentOnloadPageAsync()
        }, []
    )

    const validator = Yup.object(
        {
            name: Yup.string().min(5, validateMinLengthError(7)).max(40, validateMaxLengthError(40)).required(validateRequiredError),
            phone: Yup.string().length(11, validateFitLengthError(11)).required(validateRequiredError),
            email: Yup.string().email(validateEmailError).required(validateRequiredError),
            department: Yup.string().test(
                'department',
                'ساختمان غلط',
                function (item) {
                    return departments.find(x => x.id === item) === undefined
                }
            ).required(validateRequiredError),
            doctor: Yup.string().test(
                'doctor',
                'دکتر غلط',
                function (item) {
                    return doctors.find(x => x.id === item) !== undefined
                }
            ).required(validateRequiredError),
            time: Yup.string().test(
                'time',
                'ساعت غلط',
                function (item) {
                    return times.find(x => x.id == item) !== undefined
                }
            ).required(validateRequiredError)
        }
    )

    const formik = useFormik(
        {
            validationSchema: validator,
            initialValues: {
                name: "",
                phone: "",
                email: "",
                department: "",
                doctor: "",
                message: "",
                time: 0,
            },

            onSubmit: async (values) => {
                const UserName = values.name
                const Email = values.email
                const PhoneNumber = values.phone
                const Comment = values.message
                const VisitTimeID = values.time
                const val = { UserName, Email, PhoneNumber, Comment, VisitTimeID }
                const sendPatientToServer = await AddPatientHttpRequest(val)
                if(sendPatientToServer.status == 200){
                    console.log("success");
                    console.log(decodeToken(sendPatientToServer.data));
                }
            }
        }
    )
    console.log(formik.values);

    useEffect(
        () => {
            const GetDoctorsOnChangeDepartmentAsync = async () => {
                var val = formik.values.department
                if (val != "") {
                    const { data } = await GetDoctorsHttpRequest(val)
                    console.log(data);
                    setDoctors(data)
                }
            }

            GetDoctorsOnChangeDepartmentAsync()
        }, [formik.values.department]
    )

    useEffect(
        () => {
            const GetDoctorsOnChangeDepartmentAsync = async () => {
                var val = formik.values.doctor
                if (val != "") {
                    const { data } = await GetTimesHttpRequest(val)
                    console.log(data);
                    setTimes(data)
                }
            }

            GetDoctorsOnChangeDepartmentAsync()
        }, [formik.values.doctor]
    )

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mt-2">
                <input type="text" id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {(formik.errors?.name && formik.touched.name) && <span id="validate-name-patient" className="text-danger d-block">{formik.errors.name}</span>}
            </div>

            <div className="mt-2">
                <input type="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {(formik.errors?.email && formik.touched.email) && <span id="validate-email-patient" className="text-danger d-block">{formik.errors.email}</span>}
            </div>

            <div className="mt-2">
                <input type="tel" id="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {(formik.errors?.phone && formik.touched.phone) && <span id="validate-phone-patient" className="text-danger d-block">{formik.errors.phone}</span>}
            </div>

            <div className="mt-2">
                <select id="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value=""></option>
                    {
                        departments.map(
                            (val, index) => (
                                <option value={val.id} key={index}>{val.departmentName}</option>
                            )
                        )
                    }
                </select>
                {(formik.errors?.department && formik.touched.department) && <span id="validate-department-patient" className="text-danger d-block">{formik.errors.department}</span>}
            </div>

            <div className="mt-2">
                {formik.values.department != "" && (
                    <select id="doctor" value={formik.values.doctor} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value=""></option>
                        {
                            doctors.map(
                                (val, index) => (
                                    <option value={val.id} key={index}>{val.userName}</option>
                                )
                            )
                        }
                    </select>
                )}
                {(formik.errors?.doctor && formik.touched.doctor) && <span id="validate-doctor-patient" className="text-danger d-block">{formik.errors.doctor}</span>}
            </div>

            <div className="mt-2">
                {
                    formik.values.doctor != "" && (
                        <select id="time" value={formik.values.time} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                            <option value=""></option>
                            {
                                times.map(
                                    (val, index) => (
                                        <option value={val.id} key={index}>{moment.from(val.visitTime, "en").locale("fa").format()}</option>
                                    )
                                )
                            }
                        </select>
                    )
                }
                {(formik.errors?.time && formik.touched.time) && <span id="validate-time-patient" className="text-danger d-block">{formik.errors.time}</span>}
            </div>

            <button type="submit" className="btn btn-primary">send</button>
        </form>
    )
};
