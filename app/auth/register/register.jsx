"use client"

import * as Yup from "yup"
import { validateEmailError, validateFitLengthError, validateRequiredError } from "../../utilities/validateErrors"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import _ from "lodash"
import "./register.css"
import {useSession} from "next-auth/react"
import { getCookie } from "@/app/utilities/cookie"
import sweetAlert from "sweet-alert"

export default function Register() {
    const Session = useSession()
    console.log(Session);
    const [skills, setSkills] = useState([])
    const validator = Yup.object(
        {
            UserName: Yup.string().required(validateRequiredError),
            Email: Yup.string().email(validateEmailError).required(validateRequiredError),
            PhoneNumber: Yup.string().length(11, validateFitLengthError(11)),
            Password: Yup.string(),
            ConfrimPassword: Yup.string(),
            Skill: Yup.number().test(
                "skill",
                "مهارت نامعتبر",
                (value) => {
                    return skills.find(x => x.id == value) !== undefined
                }
            ),
        }
    )

    const formik = useFormik(
        {
            validationSchema: validator,
            initialValues: {
                UserName: "",
                Email: "",
                PhoneNumber: "",
                Password: "",
                ConfrimPassword: "",
                Skill: 0,
            },
            onSubmit: async (values) => {
                const cookie = getCookie("token")
                console.log(cookie);
                const { status } = await axios.post("https://localhost:7087/Auth/admin/Add", values,{headers: {"Authorization": "Bearer " + cookie}})
                alert("success")
            }
        }
    )

    useEffect(
        () => {
            const getSkills = async () => {
                const { data } = await axios.get("https://localhost:7087/Auth/allInfo")
                setSkills(data)
            }
            getSkills()
        }, []
    )

    return (
        <form className="signInForm" onSubmit={formik.handleSubmit}>
            <h4>CREATE ADMIN <span className="text-primary">(just manager)</span></h4>
            <hr />
            <div>
                <div className="text-center">
                    <input
                        className="form-control"
                        type="text"
                        name="UserName"
                        id="UserName"
                        value={formik.values.UserName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="UserName"
                    />
                    <span className="text-danger d-block">{formik.touched.UserName && formik.errors?.UserName}</span>
                </div>

                <div className="text-center">
                    <input
                        className="form-control"
                        type="text"
                        name="Email"
                        id="Email"
                        value={formik.values.Email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Email"
                    />
                    <span className="text-danger d-block">{formik.touched.Email && formik.errors?.Email}</span>
                </div>

                <div className="text-center">
                    <input
                        className="form-control"
                        type="text"
                        name="PhoneNumber"
                        id="PhoneNumber"
                        value={formik.values.PhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="PhoneNumber"
                    />
                    <span className="text-danger d-block">{formik.touched.PhoneNumber && formik.errors?.PhoneNumber}</span>
                </div>

                <div className="text-center">
                    <input
                        className="form-control"
                        type="text"
                        name="Password"
                        id="Password"
                        value={formik.values.Password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Password"
                    />
                    <span className="text-danger d-block">{formik.touched.Password && formik.errors?.Password}</span>
                </div>

                <div className="text-center">
                    <input
                        className="form-control"
                        type="text"
                        name="ConfrimPassword"
                        id="ConfrimPassword"
                        value={formik.values.ConfrimPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="ConfrimPassword"
                    />
                    <span className="text-danger d-block">{formik.touched.ConfrimPassword && formik.errors?.ConfrimPassword}</span>
                </div>

                <div className="text-center">
                    <select
                        className="text-center"
                        id="Skill"
                        name="Skill"
                        value={formik.values.Skill}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option></option>
                        {
                            _.map(
                                skills, i => <option key={i.id} value={i.id}>{i.departmentName}</option>
                            )
                        }
                    </select>
                    <span className="d-block text-danger">{formik.touched.Skill && formik.errors.Skill}</span>
                </div>
                <div className="text-center">
                    <button type="submit">SEND</button>
                </div>
            </div>
        </form>
    )
};
