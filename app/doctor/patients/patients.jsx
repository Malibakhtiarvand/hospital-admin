import { useContext, useEffect, useState } from "react"
import { GetPatientsHttpRequest } from "../../utilities/httpService"
import { MapPatients } from "./handlePatients"
import { produce } from "immer"
import Appointment from "./Appointment"
import { PatientContext } from "../patientContext"

export default function PatientsOfDoctor() {
    const { setPatients, setShowAddPatientForm, showAddPatientForm } = useContext(PatientContext)
    
    useEffect(
        () => {
            const getPatientsOnLoadPageAsync = async () => {
                const { data } = await GetPatientsHttpRequest()
                setPatients(data)
            }

            getPatientsOnLoadPageAsync()
        }, []
    )

    return (
        <div>
            <button className="btn btn-light" onClick={() => setShowAddPatientForm(produce(draft => !draft))}>add patient</button>
            {showAddPatientForm && <Appointment />}
            <MapPatients />
        </div>
    )
};

