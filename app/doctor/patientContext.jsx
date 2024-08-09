import { createContext } from "react";

export const PatientContext = createContext(
    {
        patients: [],
        setPatients: () => {},
        showAddPatientForm: false,
        setShowAddPatientForm: () => {},
        cancelVisit: (patientsID, visitTimeID) => {},
        deleteVisit: (visitTimeID) => {},
        Edit_Add_Visit: (patientData) => {},
        changeIsActiveOfPatient: (id) => {}
    }
);
