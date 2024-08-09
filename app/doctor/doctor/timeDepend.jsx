import moment from "jalali-moment"
import _ from "lodash"

export const HandleTime = ({time}) => {
    var time1 = moment.from(time.visitTime, 'en').locale('fa').format();
    return <span className="badge bg-warning m-2 p-2 h5">{time1}</span>
}

export const MapTime = ({times}) => {
    return (
        <div>
            {
                _.map(times,(time,id) => (
                    <HandleTime time={time} key={id} />
                ))
            }
        </div>
    )
}