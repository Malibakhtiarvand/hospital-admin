import _ from "lodash"

export const MapPatients = ({patients}) => {
    return (
        <>
            {
                _.map(patients,(item,id)=> (
                    <HandlePatient patient={item} key={id} />
                ))
            }
        </>
    )
}

const HandlePatient = ({patient}) => {
    console.log(patient);
    return <div>{patient.userName}</div>
}

