import { GetDepartmentsHttpRequest, GetDoctorsHttpRequest, GetTimesHttpRequest } from "@/app/utilities/httpService"
import { validateEmailError, validateFitLengthError, validateMaxLengthError, validateMinLengthError, validateRequiredError } from "@/app/utilities/validateErrors"
import { useFormik } from "formik"
import { useEffect, useMemo, useState } from "react"
import * as Yup from "yup"

export default function Appointment() {
    const [departments, setDepartments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [times,setTimes] = useState([]) 

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

            onSubmit: (values) => {
                if (JSON.stringify(obj) === JSON.stringify(formik.values)) {
                    cancelVisit()
                } else {
                    const UserName = values.name
                    const Email = values.email
                    const PhoneNumber = values.phone
                    const Comment = values.message
                    const VisitTimeID = values.time
                    const val = { UserName, Email, PhoneNumber, Comment, VisitTimeID }
                    addPatient(val)
                }
            }
        }
    )

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

    return (
        <form>
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
        </form>
    )
};
