import axios from "axios";
import { useState } from "react";

export default function Bill() {

    const [data, setData] = useState(null);

    const API = "https://uppclmp.myxenius.com/Prepaid_data_daily_log_gridHelper/get_previous_month_data/";

    axios.get(`${API}500152051101`)
      .then((res:{data:any}):void => {
        const data = res.data;
         setData(data);
      })

    return (
        <>
            <div>
                {data}
            </div>
        </>
    )
}