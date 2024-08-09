"use client"

import { useEffect, useState } from "react"
import { AddPatientHttpRequest, AddTimeHttpRequest, CancelVisitHttpRequest, DeleteVisitHttpRequest, GetPatientsHttpRequest, GetTimesHttpRequest } from "../../utilities/httpService"
import { MapTime } from "./timeDepend"
import { produce } from "immer"
import moment from "jalali-moment"
import PatientsOfDoctor from "../patients/patients"
import { PatientContext } from "../patientContext"

export default function DoctorClient() {
    const [patients, setPatients] = useState([])
    const [showAddPatientForm, setShowAddPatientForm] = useState(false)
    const [times, setTimes] = useState([])
    const [addTimeBool, setAddTimebool] = useState(false)
    const [newTime, setNewTime] = useState("")

    const deleteTime = async (visitTimeID) => {
        const { status } = await DeleteVisitHttpRequest(visitTimeID)
        if (status == 200) {
            setPatients(
                produce(draft => draft.filter(x => x.visitTimeID !== visitTimeID))
            )

            setTimes(
                produce(
                    draft => draft.filter(x => x.id !== visitTimeID)
                )
            )
        }
    }

    const cancelVisit = async (patientsID, visitTimeID) => {
        const { status } = await CancelVisitHttpRequest(patientsID, visitTimeID)
        if (status == 200) {
            setPatients(
                produce(draft => draft.filter(x => x.visitTimeID !== visitTimeID))
            )
        }
    }

    const Edit_Add_Visit = async (patientData = {
        userName: "",
        email: "",
        phoneNumber: "",
        visitTimeID: 0,
        comment: "",
    }) => {
        const { status } = await AddPatientHttpRequest(patientData)
        if (status == 200) {
            console.log("success");
            const { data } = await GetPatientsHttpRequest()
            setPatients(data)
        }
    }

    const changeIsActiveOfPatient = (id) => {
        setPatients(
            produce(draft => {
                var patietn1 = draft.find(x => x.id === id)
                patietn1.isEdit = !patietn1?.isEdit
                draft[id] == patietn1
            })
        )
    }


    useEffect(
        () => {
            const getTimes = async () => {
                const { data } = await GetTimesHttpRequest(null)
                setTimes(data)
            }

            getTimes()
        }, []
    )

    const AddTimeF = async () => {
        var time = moment.from(newTime, 'fa').locale('en').format();

        const sendTime = await AddTimeHttpRequest({ time })
        if (sendTime.status == 200) {
            setAddTimebool(false)
            var newTimesArr = [...times, time]
            setTimes(newTimesArr)
        }
    }

    return (
        <PatientContext.Provider value={{ changeIsActiveOfPatient, Edit_Add_Visit, patients, setPatients, setShowAddPatientForm, showAddPatientForm, cancelVisit, deleteVisit: deleteTime }}>
            <div>
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                TIME
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                {
                                    addTimeBool ? (
                                        <>
                                            <input onChange={(ev) => setNewTime(ev.target.value)} className="border" />
                                            <button onClick={AddTimeF} className="btn btn-secondary">send</button>
                                        </>
                                    ) : <button onClick={() => setAddTimebool(true)} className="btn btn-secondary">add Time</button>
                                }
                                {
                                    <MapTime times={times} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                patients
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <PatientsOfDoctor />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Accordion Item #3
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientContext.Provider>

    )
};
