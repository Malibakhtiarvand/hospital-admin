import moment from "jalali-moment";
import _ from "lodash"
import { useContext, useEffect, useMemo, useState } from "react";
import { PatientContext } from "../patientContext";
import { GetTimesHttpRequest } from "@/app/utilities/httpService";

export const MapPatients = () => {
    var { patients } = useContext(PatientContext)

    return (

        <table className="table">
            <thead>
                <tr>
                    <th>row</th>
                    <th>name</th>
                    <th>time</th>
                    <th>phone</th>
                    <th>email</th>
                </tr>
            </thead>

            <tbody>
                {
                    _.map(patients, (item, id) => (
                        <HandlePatient id={id} patient={item} key={id} />
                    ))
                }
            </tbody>
        </table>
    )
}

const HandlePatient = ({ patient, id }) => {
    const { cancelVisit, deleteVisit, Edit_Add_Visit, changeIsActiveOfPatient } = useContext(PatientContext)
    // {
    //     "id": 10003,
    //     "patientsID": 10003,
    //     "userName": "",
    //     "email": "",
    //     "phoneNumber": "",
    //     "doctorID": "",
    //     "skill": 0,
    //     "departmentName": "",
    //     "departmentID": 0,
    //     "visitTime": "{date time}",
    //     "visitTimeID": 0,
    //     "comment": "",
    //     "adminUserName": "",
    //     "adminEmail": "",
    //     "adminPhoneNumber": ""
    // }


    const [userData, setUserData] = useState(
        {
            userName: patient.userName,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            visitTimeID: patient.visitTimeID,
            comment: patient.comment,
        }
    )

    var [times, setTimes] = useState([])

    useEffect(
        () => {
            var x = async () => {
                const { data } = await GetTimesHttpRequest(null)
                setTimes(data)
            }
            if (patient.isEdit) {
                x()
            }
        }, [patient.isEdit]
    )


    const showInputsForChangePatientData = () => {
        changeIsActiveOfPatient(patient.id)
    }

    const finishEdit = () => {
        deleteVisit(patient.visitTimeID)
        console.log(userData);
        Edit_Add_Visit(userData)
    }

    const changeDataOfUser = (val, name) => {
        console.log(val);
        setUserData({ ...userData, [name]: val })
    }

    const EditComponent = (
        <tr>
            <td>{"#" + id}</td>
            <td><input onChange={(ev) => changeDataOfUser(ev.target.value, "userName")} type="text" value={userData.userName} /></td>
            <td>
                <select value={userData.visitTimeID} onChange={(ev) => changeDataOfUser(ev.target.value, "visitTimeID")}>
                    <option></option>
                    {
                        times.map(
                            (val, index) => (
                                <option value={val.id} key={index}>{moment.from(val.visitTime, "en").locale("fa").format()}</option>
                            )
                        )
                    }
                </select>
            </td>
            <td><input onChange={(ev) => changeDataOfUser(ev.target.value, "phoneNumber")} type="text" value={userData.phoneNumber} /></td>
            <td><input onChange={(ev) => changeDataOfUser(ev.target.value, "email")} type="text" value={userData.email} /></td>
            <td>
                <button className="m-1 btn btn-primary" onClick={finishEdit}>finish</button>
                <button className="m-1 btn btn-primary" onClick={() => changeIsActiveOfPatient(patient.id)}>Abort</button>
            </td>
        </tr>
    )

    const showData = (
        <tr>
            <td>{"#" + id}</td>
            <td>{patient.userName}</td>
            <td>{moment.from(patient.visitTime, "en").locale("fa").format()}</td>
            <td>{patient.phoneNumber}</td>
            <td>{patient.email}</td>
            <td>
                <button className="m-1 btn btn-primary" onClick={showInputsForChangePatientData}>edit</button>
                <button onClick={() => deleteVisit(patient.visitTimeID)} className=" btn btn-danger m-1">delete</button>
                <button onClick={() => cancelVisit(patient.patientsID, patient.visitTimeID)} className=" btn btn-warning m-1">cancel</button>
            </td>
        </tr>
    )

    return (
        patient.isEdit ? EditComponent : showData
    )
}

